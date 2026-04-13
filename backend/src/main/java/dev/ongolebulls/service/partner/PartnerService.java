package dev.ongolebulls.service.partner;

import dev.ongolebulls.dto.partner.*;
import dev.ongolebulls.dto.admin.ArnRequestResponse;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.SipPlanRepo;
import dev.ongolebulls.repository.TrackerHoldingRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

/**
 * PartnerService — handles partner profile, dashboard stats, SIPs, and tracker.
 * Client, Transaction, and Revenue logic are delegated to their own services.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class PartnerService {

    private final UserRepository userRepository;
    private final SipPlanRepo sipPlanRepo;
    private final TrackerHoldingRepository trackerHoldingRepository;
    // Domain services for aggregation in stats
    private final ClientService clientService;
    private final TransactionService transactionService;
    private final RevenueService revenueService;

    // ── Auth helper ─────────────────────────────────────────────────────────

    public User getCurrentPartner(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
    }

    // ── Profile ─────────────────────────────────────────────────────────────

    public PartnerProfileResponse getProfile(User partner) {
        // Resolve assigned RM name/email for display on the partner dashboard.
        String rmName = null;
        String rmEmail = null;
        if (partner.getAssignedRmId() != null) {
            User rm = userRepository.findById(partner.getAssignedRmId()).orElse(null);
            if (rm != null) {
                rmName = rm.getFullName() != null && !rm.getFullName().isBlank()
                        ? rm.getFullName()
                        : rm.getEmail();
                rmEmail = rm.getEmail();
            }
        }

        return PartnerProfileResponse.builder()
                .id(partner.getId())
                .fullName(partner.getFullName())
                .email(partner.getEmail())
                .mobileNumber(partner.getMobileNumber())
                .pan(partner.getPan())
                .arn(partner.getArn())
                .euin(partner.getEuin())
                .euinHolderName(partner.getEuinHolderName())
                .firmName(partner.getFirmName())
                .authorizedPerson(partner.getAuthorizedPerson())
                .partnerBankAccount(partner.getPartnerBankAccount())
                .partnerIfsc(partner.getPartnerIfsc())
                .partnerBankName(partner.getPartnerBankName())
                .arnStatus(partner.getArnStatus() != null ? partner.getArnStatus().name() : "NOT_SUBMITTED")
                .rejectionReason(partner.getRejectionReason())
                .isActivated(partner.isActivated())
                .termsAccepted(Boolean.TRUE.equals(partner.getTermsAccepted()))
                .declarationAccepted(Boolean.TRUE.equals(partner.getDeclarationAccepted()))
                .role(partner.getRole().name())
                .createdAt(partner.getCreatedAt())
                .hasArn(partner.getArn() != null && !partner.getArn().isEmpty())
                .hasBankDetails(partner.getPartnerBankAccount() != null && !partner.getPartnerBankAccount().isEmpty())
                .hasAgreement(Boolean.TRUE.equals(partner.getTermsAccepted()) && Boolean.TRUE.equals(partner.getDeclarationAccepted()))
                .state(partner.getState())
                .district(partner.getDistrict())
                .city(partner.getCity())
                .assignedRmId(partner.getAssignedRmId())
                .assignedRmName(rmName)
                .assignedRmEmail(rmEmail)
                .build();
    }

    // ── Dashboard Stats (aggregates from domain services) ───────────────────

    public PartnerStatsResponse getStats(Long partnerId) {
        long totalClients = clientService.countByPartner(partnerId);
        long activeInvestors = clientService.countByPartnerAndStage(partnerId, LifecycleStage.ACTIVE_INVESTOR);
        long pendingKyc = clientService.countByPartnerAndStages(partnerId,
                List.of(LifecycleStage.KYC_STARTED, LifecycleStage.KYC_COMPLETED));

        // SIPs — still in PartnerService since SipPlan is partner-domain
        long monthlySips = 0;
        List<User> clients = userRepository.findByAssignedPartnerIdOrderByCreatedAtDesc(partnerId);
        for (User client : clients) {
            if (client.getInvestorAccount() != null) {
                monthlySips += sipPlanRepo
                        .findByInvestor_IdAndActiveTrue(client.getInvestorAccount().getId())
                        .size();
            }
        }

        // Lifecycle distribution — delegate to client counts
        Map<String, Long> lifecycleDistribution = new LinkedHashMap<>();
        for (LifecycleStage stage : LifecycleStage.values()) {
            lifecycleDistribution.put(stage.name(),
                    clientService.countByPartnerAndStage(partnerId, stage));
        }

        // Delegate to domain services
        long totalTransactions = transactionService.countByPartner(partnerId);
        BigDecimal totalTxnAmount = transactionService.sumActiveAmount(partnerId);
        BigDecimal totalRevenue = revenueService.getTotalRevenue(partnerId);

        return PartnerStatsResponse.builder()
                .totalClients(totalClients)
                .activeInvestors(activeInvestors)
                .pendingKyc(pendingKyc)
                .monthlySips(monthlySips)
                .totalTransactions(totalTransactions)
                .totalTransactionAmount(totalTxnAmount)
                .totalRevenue(totalRevenue)
                .lifecycleDistribution(lifecycleDistribution)
                .build();
    }

    // ── Profile updates ─────────────────────────────────────────────────────

    public PartnerProfileResponse updateProfile(User partner, Map<String, String> updates) {
        if (updates.containsKey("fullName")) partner.setFullName(updates.get("fullName"));
        if (updates.containsKey("mobileNumber")) partner.setMobileNumber(updates.get("mobileNumber"));
        if (updates.containsKey("pan")) {
            String pan = updates.get("pan");
            if (pan != null && !pan.matches("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")) {
                throw new RuntimeException("Invalid PAN format. Expected: ABCDE1234F");
            }
            partner.setPan(pan);
        }
        if (updates.containsKey("arn")) partner.setArn(updates.get("arn"));
        if (updates.containsKey("euin")) partner.setEuin(updates.get("euin"));
        userRepository.save(partner);
        log.info("Partner {} updated profile", partner.getId());
        return getProfile(partner);
    }

    public PartnerProfileResponse updateBankDetails(User partner, String bankAccount, String ifsc, String bankName) {
        if (bankAccount == null || bankAccount.isBlank()) throw new RuntimeException("Bank account number is required");
        if (ifsc == null || ifsc.isBlank()) throw new RuntimeException("IFSC code is required");
        if (bankName == null || bankName.isBlank()) throw new RuntimeException("Bank name is required");
        if (!ifsc.matches("^[A-Z]{4}0[A-Z0-9]{6}$")) throw new RuntimeException("Invalid IFSC format. Expected: ABCD0123456");
        partner.setPartnerBankAccount(bankAccount);
        partner.setPartnerIfsc(ifsc);
        partner.setPartnerBankName(bankName);
        userRepository.save(partner);
        log.info("Partner {} updated bank details", partner.getId());
        return getProfile(partner);
    }

    public PartnerProfileResponse acceptAgreement(User partner) {
        partner.setTermsAccepted(true);
        partner.setDeclarationAccepted(true);
        userRepository.save(partner);
        log.info("Partner {} accepted agreement", partner.getId());
        return getProfile(partner);
    }

    public PartnerProfileResponse submitArn(User partner, ArnSubmitRequest request) {
        partner.setArn(request.getArnNumber());
        partner.setPan(request.getPan());
        if (request.getEuin() != null && !request.getEuin().isBlank()) {
            partner.setEuin(request.getEuin());
        }
        partner.setArnStatus(ArnStatus.PENDING_APPROVAL);
        partner.setRejectionReason(null);
        userRepository.save(partner);
        log.info("Partner {} submitted ARN for approval", partner.getId());
        return getProfile(partner);
    }

    public List<ArnRequestResponse> getArnRequests(String status, String search) {
        List<Role> partnerRoles = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);
        List<User> partners = userRepository.findByRoleIn(partnerRoles);

        return partners.stream()
                .filter(p -> p.getArnStatus() != null && p.getArnStatus() != ArnStatus.NOT_SUBMITTED)
                .filter(p -> {
                    if (status == null || status.isBlank()) return true;
                    return status.equalsIgnoreCase(p.getArnStatus().name());
                })
                .filter(p -> {
                    if (search == null || search.isBlank()) return true;
                    String q = search.toLowerCase();
                    String name = p.getFullName() != null ? p.getFullName().toLowerCase() : "";
                    String firmName = p.getFirmName() != null ? p.getFirmName().toLowerCase() : "";
                    String arn = p.getArn() != null ? p.getArn().toLowerCase() : "";
                    return name.contains(q) || firmName.contains(q) || arn.contains(q);
                })
                .map(this::toArnRequestResponse)
                .toList();
    }

    private ArnRequestResponse toArnRequestResponse(User u) {
        return ArnRequestResponse.builder()
                .userId(u.getId())
                .fullName(u.getFullName())
                .firmName(u.getFirmName())
                .email(u.getEmail())
                .partnerType(u.getRole().name())
                .arn(u.getArn())
                .pan(u.getPan())
                .euin(u.getEuin())
                .arnStatus(u.getArnStatus() != null ? u.getArnStatus().name() : "NOT_SUBMITTED")
                .rejectionReason(u.getRejectionReason())
                .createdAt(u.getCreatedAt())
                .build();
    }

    public ArnRequestResponse approveArn(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        List<Role> partnerRoles = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);
        if (!partnerRoles.contains(user.getRole())) {
            throw new RuntimeException("User is not a partner");
        }
        user.setArnStatus(ArnStatus.APPROVED);
        user.setActivated(true);
        user.setRejectionReason(null);
        userRepository.save(user);
        log.info("Partner {} ARN approved", userId);
        return toArnRequestResponse(user);
    }

    public ArnRequestResponse rejectArn(Long userId, String reason) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        List<Role> partnerRoles = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);
        if (!partnerRoles.contains(user.getRole())) {
            throw new RuntimeException("User is not a partner");
        }
        user.setArnStatus(ArnStatus.REJECTED);
        user.setRejectionReason(reason);
        userRepository.save(user);
        log.info("Partner {} ARN rejected: {}", userId, reason);
        return toArnRequestResponse(user);
    }

    // ── SIPs (partner-domain — tied to InvestorAccount) ─────────────────────

    public List<SipSummaryResponse> getSips(Long partnerId, String statusFilter) {
        List<User> clients = userRepository.findByAssignedPartnerIdOrderByCreatedAtDesc(partnerId);
        return clients.stream()
                .filter(client -> client.getInvestorAccount() != null)
                .flatMap(client -> {
                    List<SipPlan> sips = sipPlanRepo
                            .findByInvestor_IdAndActiveTrue(client.getInvestorAccount().getId());
                    return sips.stream().map(sip -> SipSummaryResponse.builder()
                            .id(sip.getId())
                            .clientName(client.getFullName())
                            .clientId(client.getId())
                            .fundName(sip.getFundName())
                            .amount(sip.getMonthlyAmount())
                            .frequency("MONTHLY")
                            .startDate(null)
                            .nextDueDate(sip.getNextSIPDate() != null ? sip.getNextSIPDate().toString() : null)
                            .status(sip.isActive() ? "ACTIVE" : "PAUSED")
                            .build());
                })
                .collect(Collectors.toList());
    }

    // ── Tracker (partner-domain — CAS holdings) ─────────────────────────────

    public Map<String, Object> uploadCasFile(User partner, MultipartFile file) {
        partner.setLastCasUpload(LocalDateTime.now());
        userRepository.save(partner);
        log.info("Partner {} uploaded CAS file: {}", partner.getId(), file.getOriginalFilename());
        return Map.of("message", "File uploaded successfully. Holdings will be processed shortly.",
                "uploadDate", partner.getLastCasUpload());
    }

    public TrackerSummaryResponse addHoldings(Long partnerId, List<TrackerHoldingRequest> requests) {
        for (TrackerHoldingRequest req : requests) {
            TrackerHolding holding = TrackerHolding.builder()
                    .partnerId(partnerId).clientName(req.getClientName()).clientId(req.getClientId())
                    .amcName(req.getAmcName()).fundName(req.getFundName()).folioNumber(req.getFolioNumber())
                    .units(req.getUnits()).nav(req.getNav()).currentValue(req.getCurrentValue())
                    .uploadDate(LocalDateTime.now()).build();
            trackerHoldingRepository.save(holding);
        }
        log.info("Partner {} added {} holdings", partnerId, requests.size());
        return getHoldings(partnerId);
    }

    public TrackerSummaryResponse getHoldings(Long partnerId) {
        List<TrackerHolding> holdings = trackerHoldingRepository.findByPartnerIdOrderByUploadDateDescAmcName(partnerId);
        List<TrackerHoldingResponse> responses = holdings.stream()
                .map(h -> TrackerHoldingResponse.builder()
                        .id(h.getId()).clientName(h.getClientName()).clientId(h.getClientId())
                        .amcName(h.getAmcName()).fundName(h.getFundName()).folioNumber(h.getFolioNumber())
                        .units(h.getUnits()).nav(h.getNav()).currentValue(h.getCurrentValue())
                        .uploadDate(h.getUploadDate()).build())
                .toList();
        BigDecimal totalValue = holdings.stream().map(TrackerHolding::getCurrentValue).filter(Objects::nonNull).reduce(BigDecimal.ZERO, BigDecimal::add);
        long folioCount = holdings.stream().map(TrackerHolding::getFolioNumber).filter(Objects::nonNull).distinct().count();
        long amcCount = holdings.stream().map(TrackerHolding::getAmcName).filter(Objects::nonNull).distinct().count();
        return TrackerSummaryResponse.builder().holdings(responses).totalValue(totalValue).folioCount(folioCount).amcCount(amcCount).build();
    }

    public List<CobOpportunityResponse> getCobOpportunities(Long partnerId) {
        List<Object[]> rows = trackerHoldingRepository.findCobOpportunities(partnerId);
        return rows.stream()
                .map(row -> CobOpportunityResponse.builder()
                        .clientName((String) row[0])
                        .amcCount(((Number) row[1]).longValue())
                        .totalValue(row[2] instanceof BigDecimal ? (BigDecimal) row[2] : new BigDecimal(row[2].toString()))
                        .build())
                .toList();
    }
}
