package dev.ongolebulls.service.finance;

import dev.ongolebulls.dto.finance.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.AuditLogRepository;
import dev.ongolebulls.repository.CommissionRuleRepository;
import dev.ongolebulls.repository.PayoutRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceService {

    private final UserRepository userRepository;
    private final PayoutRepository payoutRepository;
    private final CommissionRuleRepository commissionRuleRepository;
    private final AuditLogRepository auditLogRepository;

    private static final List<Role> PARTNER_ROLES = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);

    public User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Finance user not found"));
    }

    // ── Stats ───────────────────────────────────────────────────────────

    public FinanceStatsResponse getStats() {
        long totalPending = payoutRepository.countByStatus(Payout.PayoutStatus.PENDING);
        long totalReleased = payoutRepository.countByStatus(Payout.PayoutStatus.RELEASED);
        BigDecimal pendingAmount = payoutRepository.sumPendingAmount();
        LocalDate startOfMonth = LocalDate.now().withDayOfMonth(1);
        BigDecimal releasedThisMonth = payoutRepository.sumReleasedThisMonth(startOfMonth);
        long activeRules = commissionRuleRepository.countByIsActiveTrue();
        long disputed = payoutRepository.countByStatus(Payout.PayoutStatus.DISPUTED);

        return FinanceStatsResponse.builder()
                .totalPayoutsPending(totalPending)
                .totalPayoutsReleased(totalReleased)
                .pendingAmount(pendingAmount)
                .releasedThisMonth(releasedThisMonth)
                .activeCommissionRules(activeRules)
                .disputedPayouts(disputed)
                .build();
    }

    // ── Payouts ─────────────────────────────────────────────────────────

    public List<PayoutResponse> getPayouts(String status, String period, String search) {
        List<Payout> payouts = payoutRepository.findAllByOrderByCreatedAtDesc();

        if (status != null && !status.isBlank()) {
            Payout.PayoutStatus ps = Payout.PayoutStatus.valueOf(status.toUpperCase());
            payouts = payouts.stream().filter(p -> p.getStatus() == ps).collect(Collectors.toList());
        }
        if (period != null && !period.isBlank()) {
            payouts = payouts.stream().filter(p -> period.equals(p.getPeriod())).collect(Collectors.toList());
        }
        if (search != null && !search.isBlank()) {
            String lowerSearch = search.toLowerCase();
            payouts = payouts.stream()
                    .filter(p -> p.getPartnerName() != null && p.getPartnerName().toLowerCase().contains(lowerSearch))
                    .collect(Collectors.toList());
        }

        return payouts.stream().map(this::toPayoutResponse).collect(Collectors.toList());
    }

    public PayoutResponse createPayout(PayoutRequest req, Long userId) {
        BigDecimal gst = req.getGrossAmount()
                .multiply(req.getGstPercent())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal tds = req.getGrossAmount()
                .multiply(req.getTdsPercent())
                .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);

        BigDecimal net = req.getGrossAmount().subtract(gst).subtract(tds);

        Payout payout = Payout.builder()
                .partnerId(req.getPartnerId())
                .partnerName(req.getPartnerName())
                .period(req.getPeriod())
                .grossAmount(req.getGrossAmount())
                .gst(gst)
                .tds(tds)
                .netAmount(net)
                .status(Payout.PayoutStatus.PENDING)
                .build();

        payout = payoutRepository.save(payout);

        auditLogRepository.save(AuditLog.builder()
                .entityType("PAYOUT")
                .entityId(payout.getId())
                .action("PAYOUT_CREATED")
                .performedBy(userId)
                .notes("Payout created for partner " + req.getPartnerName() + ", period " + req.getPeriod())
                .build());

        log.info("Payout created: id={}, partner={}, net={}", payout.getId(), req.getPartnerName(), net);
        return toPayoutResponse(payout);
    }

    public PayoutResponse releasePayout(Long id, Long userId) {
        Payout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payout not found with id: " + id));

        payout.setStatus(Payout.PayoutStatus.RELEASED);
        payout.setPayoutDate(LocalDate.now());
        payout.setReleasedBy(userId);
        payout = payoutRepository.save(payout);

        auditLogRepository.save(AuditLog.builder()
                .entityType("PAYOUT")
                .entityId(payout.getId())
                .action("PAYOUT_RELEASED")
                .performedBy(userId)
                .notes("Payout released for partner " + payout.getPartnerName())
                .build());

        log.info("Payout released: id={}, releasedBy={}", id, userId);
        return toPayoutResponse(payout);
    }

    public PayoutResponse disputePayout(Long id, String reason) {
        Payout payout = payoutRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payout not found with id: " + id));

        payout.setStatus(Payout.PayoutStatus.DISPUTED);
        payout.setDisputeReason(reason);
        payout = payoutRepository.save(payout);

        log.info("Payout disputed: id={}, reason={}", id, reason);
        return toPayoutResponse(payout);
    }

    // ── Commission Rules ────────────────────────────────────────────────

    public List<CommissionRuleResponse> getCommissionRules() {
        return commissionRuleRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toCommissionRuleResponse)
                .collect(Collectors.toList());
    }

    public CommissionRuleResponse createCommissionRule(CommissionRuleRequest req, Long userId) {
        CommissionRule rule = CommissionRule.builder()
                .amcName(req.getAmcName())
                .fundCategory(CommissionRule.FundCategory.valueOf(req.getFundCategory().toUpperCase()))
                .trailPercent(req.getTrailPercent())
                .upfrontPercent(req.getUpfrontPercent())
                .effectiveFrom(LocalDate.parse(req.getEffectiveFrom()))
                .effectiveTo(req.getEffectiveTo() != null && !req.getEffectiveTo().isBlank()
                        ? LocalDate.parse(req.getEffectiveTo()) : null)
                .isActive(true)
                .createdBy(userId)
                .build();

        rule = commissionRuleRepository.save(rule);
        log.info("Commission rule created: id={}, amc={}", rule.getId(), req.getAmcName());
        return toCommissionRuleResponse(rule);
    }

    public CommissionRuleResponse updateCommissionRule(Long id, CommissionRuleRequest req) {
        CommissionRule rule = commissionRuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission rule not found with id: " + id));

        rule.setAmcName(req.getAmcName());
        rule.setFundCategory(CommissionRule.FundCategory.valueOf(req.getFundCategory().toUpperCase()));
        rule.setTrailPercent(req.getTrailPercent());
        rule.setUpfrontPercent(req.getUpfrontPercent());
        rule.setEffectiveFrom(LocalDate.parse(req.getEffectiveFrom()));
        rule.setEffectiveTo(req.getEffectiveTo() != null && !req.getEffectiveTo().isBlank()
                ? LocalDate.parse(req.getEffectiveTo()) : null);

        rule = commissionRuleRepository.save(rule);
        log.info("Commission rule updated: id={}", id);
        return toCommissionRuleResponse(rule);
    }

    public CommissionRuleResponse deactivateCommissionRule(Long id) {
        CommissionRule rule = commissionRuleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Commission rule not found with id: " + id));

        rule.setIsActive(false);
        rule = commissionRuleRepository.save(rule);
        log.info("Commission rule deactivated: id={}", id);
        return toCommissionRuleResponse(rule);
    }

    // ── Reconciliation ──────────────────────────────────────────────────

    public ReconciliationResponse getReconciliation(String period) {
        List<Payout> payouts = payoutRepository.findByPeriod(period);

        BigDecimal totalGross = payouts.stream()
                .map(Payout::getGrossAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalGst = payouts.stream()
                .map(Payout::getGst)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTds = payouts.stream()
                .map(Payout::getTds)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalNetReleased = payouts.stream()
                .filter(p -> p.getStatus() == Payout.PayoutStatus.RELEASED)
                .map(Payout::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal pendingRelease = payouts.stream()
                .filter(p -> p.getStatus() != Payout.PayoutStatus.RELEASED)
                .map(Payout::getNetAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<PayoutResponse> breakdown = payouts.stream()
                .map(this::toPayoutResponse)
                .collect(Collectors.toList());

        return ReconciliationResponse.builder()
                .period(period)
                .totalGross(totalGross)
                .totalGst(totalGst)
                .totalTds(totalTds)
                .totalNetReleased(totalNetReleased)
                .pendingRelease(pendingRelease)
                .partnerBreakdown(breakdown)
                .build();
    }

    // ── GST / TDS Summary ───────────────────────────────────────────────

    public GstTdsSummaryResponse getGstTdsSummary(String period) {
        List<Payout> payouts = payoutRepository.findByPeriod(period);

        BigDecimal totalGst = payouts.stream()
                .map(Payout::getGst)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalTds = payouts.stream()
                .map(Payout::getTds)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Build partner-wise GST entries
        List<PartnerTaxEntry> gstEntries = payouts.stream().map(p -> {
            BigDecimal gstRate = p.getGrossAmount().compareTo(BigDecimal.ZERO) != 0
                    ? p.getGst().multiply(BigDecimal.valueOf(100)).divide(p.getGrossAmount(), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            String pan = lookupPartnerPan(p.getPartnerId());
            return PartnerTaxEntry.builder()
                    .partnerName(p.getPartnerName())
                    .pan(pan)
                    .period(p.getPeriod())
                    .grossAmount(p.getGrossAmount())
                    .rate(gstRate)
                    .amount(p.getGst())
                    .status(p.getStatus().name())
                    .build();
        }).collect(Collectors.toList());

        // Build partner-wise TDS entries
        List<PartnerTaxEntry> tdsEntries = payouts.stream().map(p -> {
            BigDecimal tdsRate = p.getGrossAmount().compareTo(BigDecimal.ZERO) != 0
                    ? p.getTds().multiply(BigDecimal.valueOf(100)).divide(p.getGrossAmount(), 2, RoundingMode.HALF_UP)
                    : BigDecimal.ZERO;
            String pan = lookupPartnerPan(p.getPartnerId());
            return PartnerTaxEntry.builder()
                    .partnerName(p.getPartnerName())
                    .pan(pan)
                    .period(p.getPeriod())
                    .grossAmount(p.getGrossAmount())
                    .rate(tdsRate)
                    .amount(p.getTds())
                    .status(p.getStatus().name())
                    .build();
        }).collect(Collectors.toList());

        return GstTdsSummaryResponse.builder()
                .period(period)
                .totalGst(totalGst)
                .totalTds(totalTds)
                .gstEntries(gstEntries)
                .tdsEntries(tdsEntries)
                .build();
    }

    // ── Partners list ───────────────────────────────────────────────────

    public List<Map<String, Object>> getPartners() {
        return userRepository.findByRoleIn(PARTNER_ROLES).stream()
                .map(u -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", u.getId());
                    map.put("name", u.getFullName());
                    return map;
                })
                .collect(Collectors.toList());
    }

    // ── Private helpers ─────────────────────────────────────────────────

    private PayoutResponse toPayoutResponse(Payout p) {
        String releasedByName = null;
        if (p.getReleasedBy() != null) {
            releasedByName = userRepository.findById(p.getReleasedBy())
                    .map(User::getFullName)
                    .orElse(null);
        }

        return PayoutResponse.builder()
                .id(p.getId())
                .partnerId(p.getPartnerId())
                .partnerName(p.getPartnerName())
                .period(p.getPeriod())
                .grossAmount(p.getGrossAmount())
                .gst(p.getGst())
                .tds(p.getTds())
                .netAmount(p.getNetAmount())
                .status(p.getStatus().name())
                .payoutDate(p.getPayoutDate())
                .releasedBy(p.getReleasedBy())
                .releasedByName(releasedByName)
                .disputeReason(p.getDisputeReason())
                .createdAt(p.getCreatedAt())
                .build();
    }

    private CommissionRuleResponse toCommissionRuleResponse(CommissionRule rule) {
        return CommissionRuleResponse.builder()
                .id(rule.getId())
                .amcName(rule.getAmcName())
                .fundCategory(rule.getFundCategory().name())
                .trailPercent(rule.getTrailPercent())
                .upfrontPercent(rule.getUpfrontPercent())
                .effectiveFrom(rule.getEffectiveFrom())
                .effectiveTo(rule.getEffectiveTo())
                .isActive(Boolean.TRUE.equals(rule.getIsActive()))
                .createdBy(rule.getCreatedBy())
                .createdAt(rule.getCreatedAt())
                .build();
    }

    private String lookupPartnerPan(Long partnerId) {
        if (partnerId == null) return null;
        return userRepository.findById(partnerId)
                .map(User::getPan)
                .orElse(null);
    }
}
