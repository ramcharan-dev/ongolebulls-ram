package dev.ongolebulls.service.operations;

import dev.ongolebulls.dto.operations.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.DocumentReviewRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OperationsService {

    private final UserRepository userRepository;
    private final DocumentReviewRepository documentReviewRepository;

    private static final List<Role> PARTNER_ROLES = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);

    public User getCurrentOpsUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Operations user not found"));
    }

    // ── Stats ────────────────────────────────────────────────────────────

    public OperationsStatsResponse getStats() {
        long pendingActivation = userRepository.countByRoleInAndIsActivated(PARTNER_ROLES, false);

        // Activated today
        Instant todayStart = LocalDate.now().atStartOfDay(ZoneId.systemDefault()).toInstant();
        long activatedToday = userRepository.countActivatedSince(PARTNER_ROLES, todayStart);

        // Activated this month
        Instant monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay(ZoneId.systemDefault()).toInstant();
        long activatedThisMonth = userRepository.countActivatedSince(PARTNER_ROLES, monthStart);

        // Clients in KYC queue
        List<LifecycleStage> kycStages = List.of(LifecycleStage.KYC_STARTED, LifecycleStage.KYC_COMPLETED);
        long clientsInKyc = userRepository.findByLifecycleStageInOrderByCreatedAtAsc(kycStages).size();

        // Top 5 urgent partners
        List<PartnerVerificationResponse> urgent = userRepository
                .findTop5ByRoleInAndIsActivatedOrderByCreatedAtAsc(PARTNER_ROLES, false)
                .stream().map(this::toPartnerVerification).toList();

        return OperationsStatsResponse.builder()
                .pendingActivation(pendingActivation)
                .activatedToday(activatedToday)
                .clientsInKycQueue(clientsInKyc)
                .activatedThisMonth(activatedThisMonth)
                .urgentPartners(urgent)
                .build();
    }

    // ── Partner Verification ─────────────────────────────────────────────

    public List<PartnerVerificationResponse> getPendingPartners() {
        return userRepository.findByRoleInAndIsActivatedOrderByCreatedAtAsc(PARTNER_ROLES, false)
                .stream().map(this::toPartnerVerification).toList();
    }

    public List<PartnerVerificationResponse> getAllPartners(String search, String status, String type) {
        List<User> partners;
        if (search != null && !search.isBlank()) {
            partners = userRepository.searchPartners(PARTNER_ROLES, search);
        } else {
            partners = userRepository.findByRoleIn(PARTNER_ROLES);
        }

        if ("active".equalsIgnoreCase(status)) {
            partners = partners.stream().filter(User::isActivated).collect(Collectors.toList());
        } else if ("pending".equalsIgnoreCase(status)) {
            partners = partners.stream().filter(p -> !p.isActivated()).collect(Collectors.toList());
        }

        if ("INDIVIDUAL_PARTNER".equalsIgnoreCase(type)) {
            partners = partners.stream().filter(p -> p.getRole() == Role.INDIVIDUAL_PARTNER).collect(Collectors.toList());
        } else if ("NON_INDIVIDUAL_PARTNER".equalsIgnoreCase(type)) {
            partners = partners.stream().filter(p -> p.getRole() == Role.NON_INDIVIDUAL_PARTNER).collect(Collectors.toList());
        }

        partners.sort((a, b) -> {
            if (a.getCreatedAt() == null || b.getCreatedAt() == null) return 0;
            return b.getCreatedAt().compareTo(a.getCreatedAt());
        });

        return partners.stream().map(this::toPartnerVerification).toList();
    }

    public PartnerVerificationResponse activatePartner(Long partnerId) {
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        if (!PARTNER_ROLES.contains(partner.getRole())) {
            throw new RuntimeException("User is not a partner");
        }
        partner.setIsActivated(true);
        partner.setRejectionReason(null);
        userRepository.save(partner);
        log.info("Operations activated partner {}: {}", partnerId, partner.getEmail());
        return toPartnerVerification(partner);
    }

    public PartnerVerificationResponse rejectPartner(Long partnerId, String reason) {
        User partner = userRepository.findById(partnerId)
                .orElseThrow(() -> new RuntimeException("Partner not found"));
        if (!PARTNER_ROLES.contains(partner.getRole())) {
            throw new RuntimeException("User is not a partner");
        }
        if (reason == null || reason.isBlank()) {
            throw new RuntimeException("Rejection reason is required");
        }
        partner.setIsActivated(false);
        partner.setRejectionReason(reason);
        userRepository.save(partner);
        log.info("Operations rejected partner {}: reason={}", partnerId, reason);
        return toPartnerVerification(partner);
    }

    // ── Client KYC Queue ─────────────────────────────────────────────────

    public List<ClientKycResponse> getKycQueue(String stage) {
        List<User> clients;
        if (stage != null && !stage.isBlank()) {
            try {
                LifecycleStage ls = LifecycleStage.valueOf(stage);
                clients = userRepository.findByLifecycleStageOrderByCreatedAtAsc(ls);
            } catch (IllegalArgumentException e) {
                clients = List.of();
            }
        } else {
            clients = userRepository.findByLifecycleStageInOrderByCreatedAtAsc(
                    List.of(LifecycleStage.values()));
        }

        // Only include users with role USER (actual clients, not partners)
        clients = clients.stream()
                .filter(u -> u.getRole() == Role.USER)
                .collect(Collectors.toList());

        return clients.stream().map(this::toClientKyc).toList();
    }

    public ClientKycResponse updateClientLifecycle(Long clientId, String stage) {
        User client = userRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Client not found"));
        LifecycleStage newStage = LifecycleStage.valueOf(stage);
        client.setLifecycleStage(newStage);
        userRepository.save(client);
        log.info("Operations updated client {} lifecycle to {}", clientId, stage);
        return toClientKyc(client);
    }

    // ── Document Review ──────────────────────────────────────────────────

    public List<DocumentReviewResponse> getPendingDocuments() {
        List<DocumentReview> reviews = documentReviewRepository.findByStatusInOrderBySubmittedAtAsc(
                List.of(DocumentReview.ReviewStatus.PENDING, DocumentReview.ReviewStatus.UNDER_REVIEW));

        return reviews.stream().map(this::toDocReviewResponse).toList();
    }

    public DocumentReviewResponse markDocumentReviewed(Long reviewId, Long opsUserId, String status) {
        DocumentReview review = documentReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Document review not found"));
        review.setStatus(DocumentReview.ReviewStatus.valueOf(status));
        review.setReviewedAt(LocalDateTime.now());
        review.setReviewedBy(opsUserId);
        documentReviewRepository.save(review);
        return toDocReviewResponse(review);
    }

    // ── Helpers ──────────────────────────────────────────────────────────

    private PartnerVerificationResponse toPartnerVerification(User partner) {
        long daysWaiting = 0;
        if (partner.getCreatedAt() != null) {
            daysWaiting = ChronoUnit.DAYS.between(partner.getCreatedAt(), Instant.now());
        }
        return PartnerVerificationResponse.builder()
                .id(partner.getId())
                .fullName(partner.getFullName())
                .firmName(partner.getFirmName())
                .email(partner.getEmail())
                .mobileNumber(partner.getMobileNumber())
                .partnerType(partner.getRole().name())
                .arn(partner.getArn())
                .pan(partner.getPan())
                .euin(partner.getEuin())
                .partnerBankAccount(partner.getPartnerBankAccount())
                .partnerIfsc(partner.getPartnerIfsc())
                .partnerBankName(partner.getPartnerBankName())
                .isActivated(partner.isActivated())
                .termsAccepted(Boolean.TRUE.equals(partner.getTermsAccepted()))
                .declarationAccepted(Boolean.TRUE.equals(partner.getDeclarationAccepted()))
                .hasArn(partner.getArn() != null && !partner.getArn().isEmpty())
                .hasPan(partner.getPan() != null && !partner.getPan().isEmpty())
                .hasBankDetails(partner.getPartnerBankAccount() != null && !partner.getPartnerBankAccount().isEmpty())
                .hasAgreement(Boolean.TRUE.equals(partner.getTermsAccepted()) && Boolean.TRUE.equals(partner.getDeclarationAccepted()))
                .daysWaiting(daysWaiting)
                .createdAt(partner.getCreatedAt())
                .rejectionReason(partner.getRejectionReason())
                .build();
    }

    private ClientKycResponse toClientKyc(User client) {
        long daysSince = 0;
        if (client.getCreatedAt() != null) {
            daysSince = ChronoUnit.DAYS.between(client.getCreatedAt(), Instant.now());
        }
        String partnerName = null;
        if (client.getAssignedPartnerId() != null) {
            partnerName = userRepository.findById(client.getAssignedPartnerId())
                    .map(u -> u.getFullName() != null ? u.getFullName() : u.getFirmName())
                    .orElse(null);
        }
        String kycStatus = "NOT_STARTED";
        if (client.getKycDetails() != null && client.getKycDetails().isVerified()) {
            kycStatus = "VERIFIED";
        } else if (client.getKycDetails() != null) {
            kycStatus = "SUBMITTED";
        }
        return ClientKycResponse.builder()
                .id(client.getId())
                .fullName(client.getFullName())
                .email(client.getEmail())
                .mobileNumber(client.getMobileNumber())
                .lifecycleStage(client.getLifecycleStage() != null ? client.getLifecycleStage().name() : "LEAD_CREATED")
                .kycStatus(kycStatus)
                .assignedPartnerName(partnerName)
                .assignedPartnerId(client.getAssignedPartnerId())
                .daysSinceRegistration(daysSince)
                .createdAt(client.getCreatedAt())
                .build();
    }

    private DocumentReviewResponse toDocReviewResponse(DocumentReview review) {
        String partnerName = userRepository.findById(review.getPartnerId())
                .map(u -> u.getFullName() != null ? u.getFullName() : u.getFirmName())
                .orElse("Unknown");
        return DocumentReviewResponse.builder()
                .id(review.getId())
                .partnerId(review.getPartnerId())
                .partnerName(partnerName)
                .documentType(review.getDocumentType().name())
                .status(review.getStatus().name())
                .submittedAt(review.getSubmittedAt())
                .reviewedAt(review.getReviewedAt())
                .notes(review.getNotes())
                .build();
    }
}
