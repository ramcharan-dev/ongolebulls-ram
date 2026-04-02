package dev.ongolebulls.service.partner;

import dev.ongolebulls.dto.partner.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.SipPlanRepo;
import dev.ongolebulls.repository.TrackerHoldingRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PartnerService {

    private final UserRepository userRepository;
    private final SipPlanRepo sipPlanRepo;
    private final TrackerHoldingRepository trackerHoldingRepository;
    private final PasswordEncoder passwordEncoder;

    // ── Helper ───────────────────────────────────────────────────────────────

    public User getCurrentPartner(Authentication auth) {
        String email = auth.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
    }

    // ── 1. Profile ───────────────────────────────────────────────────────────

    public PartnerProfileResponse getProfile(User partner) {
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
                .isActivated(partner.isActivated())
                .termsAccepted(Boolean.TRUE.equals(partner.getTermsAccepted()))
                .declarationAccepted(Boolean.TRUE.equals(partner.getDeclarationAccepted()))
                .role(partner.getRole().name())
                .createdAt(partner.getCreatedAt())
                .hasArn(partner.getArn() != null && !partner.getArn().isEmpty())
                .hasBankDetails(partner.getPartnerBankAccount() != null && !partner.getPartnerBankAccount().isEmpty())
                .hasAgreement(Boolean.TRUE.equals(partner.getTermsAccepted()) && Boolean.TRUE.equals(partner.getDeclarationAccepted()))
                .build();
    }

    // ── 2. Stats ─────────────────────────────────────────────────────────────

    public PartnerStatsResponse getStats(Long partnerId) {
        long totalClients = userRepository.countByAssignedPartnerId(partnerId);
        long activeInvestors = userRepository.countByAssignedPartnerIdAndLifecycleStage(
                partnerId, LifecycleStage.ACTIVE_INVESTOR);
        long pendingKyc = userRepository.countByAssignedPartnerIdAndLifecycleStageIn(
                partnerId, List.of(LifecycleStage.KYC_STARTED, LifecycleStage.KYC_COMPLETED));

        // Count active SIPs across all clients
        long monthlySips = 0;
        List<User> clients = userRepository.findByAssignedPartnerIdOrderByCreatedAtDesc(partnerId);
        for (User client : clients) {
            if (client.getInvestorAccount() != null) {
                monthlySips += sipPlanRepo
                        .findByInvestor_IdAndActiveTrue(client.getInvestorAccount().getId())
                        .size();
            }
        }

        return PartnerStatsResponse.builder()
                .totalClients(totalClients)
                .activeInvestors(activeInvestors)
                .pendingKyc(pendingKyc)
                .monthlySips(monthlySips)
                .build();
    }

    // ── 3. Clients list ──────────────────────────────────────────────────────

    public List<ClientSummaryResponse> getClients(Long partnerId, String stage, String search) {
        List<User> users;

        if (search != null && !search.isEmpty()) {
            users = userRepository.searchClientsByPartner(partnerId, search);
        } else {
            users = userRepository.findByAssignedPartnerIdOrderByCreatedAtDesc(partnerId);
        }

        if (stage != null && !stage.isEmpty()) {
            users = users.stream()
                    .filter(u -> u.getLifecycleStage() != null && u.getLifecycleStage().name().equals(stage))
                    .collect(Collectors.toList());
        }

        return users.stream().map(this::toClientSummary).collect(Collectors.toList());
    }

    // ── 4. Add client ────────────────────────────────────────────────────────

    public ClientSummaryResponse addClient(User partner, AddClientRequest req) {
        if (!partner.isActivated()) {
            throw new RuntimeException("Account not activated. Cannot add clients until your account is activated.");
        }
        if (req.getFullName() == null || req.getFullName().isBlank()) {
            throw new RuntimeException("Full name is required");
        }
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            throw new RuntimeException("Email is required");
        }
        if (req.getMobile() == null || req.getMobile().isBlank()) {
            throw new RuntimeException("Mobile number is required");
        }
        if (!req.getMobile().matches("^[0-9]{10}$")) {
            throw new RuntimeException("Mobile number must be exactly 10 digits");
        }
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }

        User client = User.builder()
                .fullName(req.getFullName())
                .email(req.getEmail())
                .mobileNumber(req.getMobile())
                .role(Role.USER)
                .assignedPartnerId(partner.getId())
                .lifecycleStage(LifecycleStage.LEAD_CREATED)
                .isActivated(false)
                .enabled(true)
                .termsAccepted(false)
                .declarationAccepted(false)
                .build();

        userRepository.save(client);
        log.info("Partner {} added client {} ({})", partner.getId(), client.getFullName(), client.getEmail());

        return toClientSummary(client);
    }

    // ── 5. Update client lifecycle ───────────────────────────────────────────

    public ClientSummaryResponse updateClientLifecycle(User partner, Long clientId, String stage) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));

        if (!partner.getId().equals(client.getAssignedPartnerId())) {
            throw new RuntimeException("Client not assigned to this partner");
        }

        LifecycleStage newStage = LifecycleStage.valueOf(stage);
        client.setLifecycleStage(newStage);
        userRepository.save(client);
        log.info("Partner {} updated client {} lifecycle to {}", partner.getId(), clientId, stage);

        return toClientSummary(client);
    }

    // ── 6. SIPs ──────────────────────────────────────────────────────────────

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

    // ── 7. CAS file upload ───────────────────────────────────────────────────

    public Map<String, Object> uploadCasFile(User partner, MultipartFile file) {
        partner.setLastCasUpload(LocalDateTime.now());
        userRepository.save(partner);
        log.info("Partner {} uploaded CAS file: {}", partner.getId(), file.getOriginalFilename());

        return Map.of(
                "message", "File uploaded successfully. Holdings will be processed shortly.",
                "uploadDate", partner.getLastCasUpload()
        );
    }

    // ── 8. Add holdings ──────────────────────────────────────────────────────

    public TrackerSummaryResponse addHoldings(Long partnerId, List<TrackerHoldingRequest> requests) {
        for (TrackerHoldingRequest req : requests) {
            TrackerHolding holding = TrackerHolding.builder()
                    .partnerId(partnerId)
                    .clientName(req.getClientName())
                    .clientId(req.getClientId())
                    .amcName(req.getAmcName())
                    .fundName(req.getFundName())
                    .folioNumber(req.getFolioNumber())
                    .units(req.getUnits())
                    .nav(req.getNav())
                    .currentValue(req.getCurrentValue())
                    .uploadDate(LocalDateTime.now())
                    .build();
            trackerHoldingRepository.save(holding);
        }
        log.info("Partner {} added {} holdings", partnerId, requests.size());

        return getHoldings(partnerId);
    }

    // ── 9. Get holdings ──────────────────────────────────────────────────────

    public TrackerSummaryResponse getHoldings(Long partnerId) {
        List<TrackerHolding> holdings = trackerHoldingRepository
                .findByPartnerIdOrderByUploadDateDescAmcName(partnerId);

        List<TrackerHoldingResponse> responses = holdings.stream()
                .map(h -> TrackerHoldingResponse.builder()
                        .id(h.getId())
                        .clientName(h.getClientName())
                        .clientId(h.getClientId())
                        .amcName(h.getAmcName())
                        .fundName(h.getFundName())
                        .folioNumber(h.getFolioNumber())
                        .units(h.getUnits())
                        .nav(h.getNav())
                        .currentValue(h.getCurrentValue())
                        .uploadDate(h.getUploadDate())
                        .build())
                .toList();

        BigDecimal totalValue = holdings.stream()
                .map(TrackerHolding::getCurrentValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long folioCount = holdings.stream()
                .map(TrackerHolding::getFolioNumber)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        long amcCount = holdings.stream()
                .map(TrackerHolding::getAmcName)
                .filter(Objects::nonNull)
                .distinct()
                .count();

        return TrackerSummaryResponse.builder()
                .holdings(responses)
                .totalValue(totalValue)
                .folioCount(folioCount)
                .amcCount(amcCount)
                .build();
    }

    // ── 10. COB opportunities ────────────────────────────────────────────────

    public List<CobOpportunityResponse> getCobOpportunities(Long partnerId) {
        List<Object[]> rows = trackerHoldingRepository.findCobOpportunities(partnerId);
        return rows.stream()
                .map(row -> CobOpportunityResponse.builder()
                        .clientName((String) row[0])
                        .amcCount(((Number) row[1]).longValue())
                        .totalValue(row[2] instanceof BigDecimal
                                ? (BigDecimal) row[2]
                                : new BigDecimal(row[2].toString()))
                        .build())
                .toList();
    }

    // ── 11. Update profile ───────────────────────────────────────────────────

    public PartnerProfileResponse updateProfile(User partner, Map<String, String> updates) {
        if (updates.containsKey("fullName")) {
            partner.setFullName(updates.get("fullName"));
        }
        if (updates.containsKey("mobileNumber")) {
            partner.setMobileNumber(updates.get("mobileNumber"));
        }
        if (updates.containsKey("pan")) {
            String pan = updates.get("pan");
            if (pan != null && !pan.matches("^[A-Z]{5}[0-9]{4}[A-Z]{1}$")) {
                throw new RuntimeException("Invalid PAN format. Expected: ABCDE1234F");
            }
            partner.setPan(pan);
        }
        if (updates.containsKey("arn")) {
            partner.setArn(updates.get("arn"));
        }
        if (updates.containsKey("euin")) {
            partner.setEuin(updates.get("euin"));
        }

        userRepository.save(partner);
        log.info("Partner {} updated profile", partner.getId());

        return getProfile(partner);
    }

    // ── 12. Update bank details ──────────────────────────────────────────────

    public PartnerProfileResponse updateBankDetails(User partner, String bankAccount, String ifsc, String bankName) {
        if (bankAccount == null || bankAccount.isBlank()) {
            throw new RuntimeException("Bank account number is required");
        }
        if (ifsc == null || ifsc.isBlank()) {
            throw new RuntimeException("IFSC code is required");
        }
        if (bankName == null || bankName.isBlank()) {
            throw new RuntimeException("Bank name is required");
        }
        if (!ifsc.matches("^[A-Z]{4}0[A-Z0-9]{6}$")) {
            throw new RuntimeException("Invalid IFSC format. Expected: ABCD0123456");
        }

        partner.setPartnerBankAccount(bankAccount);
        partner.setPartnerIfsc(ifsc);
        partner.setPartnerBankName(bankName);
        userRepository.save(partner);
        log.info("Partner {} updated bank details", partner.getId());

        return getProfile(partner);
    }

    // ── 13. Accept agreement ─────────────────────────────────────────────────

    public PartnerProfileResponse acceptAgreement(User partner) {
        partner.setTermsAccepted(true);
        partner.setDeclarationAccepted(true);
        userRepository.save(partner);
        log.info("Partner {} accepted agreement", partner.getId());

        return getProfile(partner);
    }

    // ── Private helpers ──────────────────────────────────────────────────────

    private ClientSummaryResponse toClientSummary(User user) {
        String kycStatus;
        if (user.getKycDetails() != null && user.getKycDetails().isVerified()) {
            kycStatus = "VERIFIED";
        } else if (user.getKycDetails() != null) {
            kycStatus = "SUBMITTED";
        } else {
            kycStatus = "NOT_STARTED";
        }

        return ClientSummaryResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .lifecycleStage(user.getLifecycleStage() != null
                        ? user.getLifecycleStage().name()
                        : "LEAD_CREATED")
                .kycStatus(kycStatus)
                .createdAt(user.getCreatedAt())
                .lastActivityDate(user.getCreatedAt())
                .build();
    }
}
