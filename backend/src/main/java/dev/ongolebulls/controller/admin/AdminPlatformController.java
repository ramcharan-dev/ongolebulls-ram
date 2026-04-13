package dev.ongolebulls.controller.admin;

import dev.ongolebulls.dto.admin.PartnerDetailResponse;
import dev.ongolebulls.dto.admin.PlatformStatsResponse;
import dev.ongolebulls.dto.admin.ReferralTreeEntry;
import dev.ongolebulls.model.AuditLog;
import dev.ongolebulls.model.LifecycleStage;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.AuditLogRepository;
import dev.ongolebulls.repository.ReferralClickRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminPlatformController {

    private final UserRepository userRepository;
    private final ReferralClickRepository referralClickRepository;
    private final AuditLogRepository auditLogRepository;

    private static final List<Role> PARTNER_ROLES = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);
    private static final List<Role> INTERNAL_ROLES = List.of(Role.RELATIONSHIP_MANAGER, Role.OPERATIONS, Role.COMPLIANCE, Role.FINANCE, Role.SUPPORT);

    @GetMapping("/platform-stats")
    public ResponseEntity<?> getPlatformStats() {
        try {
            long totalUsers = userRepository.count();
            long totalPartners = userRepository.countByRoleIn(PARTNER_ROLES);
            long totalClients = userRepository.countByRole(Role.USER);
            long totalInternalUsers = userRepository.countByRoleIn(INTERNAL_ROLES) + userRepository.countByRole(Role.ADMIN);
            long activePartners = userRepository.countByRoleInAndIsActivated(PARTNER_ROLES, true);
            long pendingPartners = totalPartners - activePartners;

            Map<String, Long> partnersByType = new LinkedHashMap<>();
            partnersByType.put("individual", userRepository.countByRole(Role.INDIVIDUAL_PARTNER));
            partnersByType.put("firm", userRepository.countByRole(Role.NON_INDIVIDUAL_PARTNER));

            Map<String, Long> clientsByLifecycle = new LinkedHashMap<>();
            for (LifecycleStage stage : LifecycleStage.values()) {
                clientsByLifecycle.put(stage.name(), (long) userRepository.findByLifecycleStageOrderByCreatedAtAsc(stage).size());
            }

            Map<String, Long> internalUsersByRole = new LinkedHashMap<>();
            for (Role r : INTERNAL_ROLES) {
                internalUsersByRole.put(r.name(), userRepository.countByRole(r));
            }
            internalUsersByRole.put("ADMIN", userRepository.countByRole(Role.ADMIN));

            long totalReferrals = referralClickRepository.count();
            long convertedReferrals = referralClickRepository.countByConvertedTrue();

            // Recent audit activity - last 10
            List<AuditLog> recentLogs = auditLogRepository.findAllByOrderByPerformedAtDesc();
            List<PlatformStatsResponse.ActivityEntry> recentActivity = recentLogs.stream()
                    .limit(10)
                    .map(log -> {
                        String performedByName = log.getPerformedBy() != null
                                ? userRepository.findById(log.getPerformedBy()).map(u -> u.getFullName() != null ? u.getFullName() : u.getEmail()).orElse("System")
                                : "System";
                        return PlatformStatsResponse.ActivityEntry.builder()
                                .action(log.getAction())
                                .entityType(log.getEntityType())
                                .entityName(log.getNotes() != null ? log.getNotes() : "")
                                .performedByName(performedByName)
                                .performedAt(log.getPerformedAt())
                                .build();
                    })
                    .toList();

            return ResponseEntity.ok(PlatformStatsResponse.builder()
                    .totalUsers(totalUsers)
                    .totalPartners(totalPartners)
                    .totalClients(totalClients)
                    .totalInternalUsers(totalInternalUsers)
                    .activePartners(activePartners)
                    .pendingPartners(pendingPartners)
                    .partnersByType(partnersByType)
                    .clientsByLifecycle(clientsByLifecycle)
                    .internalUsersByRole(internalUsersByRole)
                    .totalReferrals(totalReferrals)
                    .convertedReferrals(convertedReferrals)
                    .recentActivity(recentActivity)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching platform stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/referrals")
    public ResponseEntity<?> getReferrals() {
        try {
            // Find all users where referredBy is not null
            List<User> referredUsers = userRepository.findAll().stream()
                    .filter(u -> u.getReferredBy() != null)
                    .toList();

            List<ReferralTreeEntry> entries = referredUsers.stream().map(u -> {
                User referrer = userRepository.findById(u.getReferredBy()).orElse(null);
                return ReferralTreeEntry.builder()
                        .referrerId(u.getReferredBy())
                        .referrerName(referrer != null ? (referrer.getFullName() != null ? referrer.getFullName() : referrer.getFirmName()) : "Unknown")
                        .referrerType(referrer != null ? referrer.getRole().name() : "Unknown")
                        .referredUserId(u.getId())
                        .referredUserName(u.getFullName() != null ? u.getFullName() : u.getFirmName())
                        .referredUserRole(u.getRole().name())
                        .referredUserActivated(u.isActivated())
                        .referredAt(u.getCreatedAt())
                        .build();
            }).toList();

            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            log.error("Error fetching referral tree: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/partners/{id}/detail")
    public ResponseEntity<?> getPartnerDetail(@PathVariable Long id) {
        try {
            User partner = userRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Partner not found"));

            long totalClients = userRepository.countByAssignedPartnerId(id);

            Map<String, Long> clientsByLifecycle = new LinkedHashMap<>();
            for (LifecycleStage stage : LifecycleStage.values()) {
                long count = userRepository.countByAssignedPartnerIdAndLifecycleStage(id, stage);
                if (count > 0) clientsByLifecycle.put(stage.name(), count);
            }

            long referralCount = referralClickRepository.findByReferrerIdOrderByClickedAtDesc(id).size();

            return ResponseEntity.ok(PartnerDetailResponse.builder()
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
                    .createdAt(partner.getCreatedAt())
                    .totalClients(totalClients)
                    .clientsByLifecycle(clientsByLifecycle)
                    .referralCount(referralCount)
                    .build());
        } catch (Exception e) {
            log.error("Error fetching partner detail: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
