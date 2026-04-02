package dev.ongolebulls.service.compliance;

import dev.ongolebulls.dto.compliance.*;
import dev.ongolebulls.model.AuditLog;
import dev.ongolebulls.model.ComplianceFlag;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.AuditLogRepository;
import dev.ongolebulls.repository.ComplianceFlagRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplianceService {

    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final ComplianceFlagRepository complianceFlagRepository;

    private static final List<Role> PARTNER_ROLES = List.of(Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER);

    public User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ---- Stats ----

    public ComplianceStatsResponse getStats() {
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();

        long openFlags = complianceFlagRepository.countByStatus(ComplianceFlag.FlagStatus.OPEN);
        long resolvedToday = complianceFlagRepository.countByStatusAndResolvedAtAfter(
                ComplianceFlag.FlagStatus.RESOLVED, todayStart);

        // Partners under review = distinct partners that have at least one OPEN flag
        List<User> partners = userRepository.findByRoleIn(PARTNER_ROLES);
        long partnersUnderReview = partners.stream()
                .filter(p -> complianceFlagRepository.countByEntityIdAndStatus(p.getId(), ComplianceFlag.FlagStatus.OPEN) > 0)
                .count();

        long totalAuditLogsToday = auditLogRepository.countByPerformedAtAfter(todayStart);

        return ComplianceStatsResponse.builder()
                .openFlags(openFlags)
                .resolvedToday(resolvedToday)
                .partnersUnderReview(partnersUnderReview)
                .pendingApprovals(0)
                .totalAuditLogsToday(totalAuditLogsToday)
                .build();
    }

    // ---- Audit Logs ----

    public List<AuditLogResponse> getAuditLogs(String entityType, String search, LocalDateTime from, LocalDateTime to) {
        List<AuditLog> logs = auditLogRepository.findAllByOrderByPerformedAtDesc();

        if (entityType != null && !entityType.isBlank()) {
            logs = logs.stream()
                    .filter(l -> entityType.equalsIgnoreCase(l.getEntityType()))
                    .collect(Collectors.toList());
        }

        if (from != null) {
            logs = logs.stream()
                    .filter(l -> l.getPerformedAt() != null && !l.getPerformedAt().isBefore(from))
                    .collect(Collectors.toList());
        }

        if (to != null) {
            logs = logs.stream()
                    .filter(l -> l.getPerformedAt() != null && !l.getPerformedAt().isAfter(to))
                    .collect(Collectors.toList());
        }

        return logs.stream().map(l -> {
            String performedByName = null;
            if (l.getPerformedBy() != null) {
                performedByName = userRepository.findById(l.getPerformedBy())
                        .map(User::getFullName)
                        .orElse(null);
            }
            return AuditLogResponse.builder()
                    .id(l.getId())
                    .entityType(l.getEntityType())
                    .entityId(l.getEntityId())
                    .action(l.getAction())
                    .performedBy(l.getPerformedBy())
                    .performedByName(performedByName)
                    .performedAt(l.getPerformedAt())
                    .oldValue(l.getOldValue())
                    .newValue(l.getNewValue())
                    .notes(l.getNotes())
                    .build();
        }).collect(Collectors.toList());
    }

    // ---- Flags ----

    public List<ComplianceFlagResponse> getFlags(String status) {
        List<ComplianceFlag> flags;
        if (status != null && !status.isBlank()) {
            ComplianceFlag.FlagStatus flagStatus = ComplianceFlag.FlagStatus.valueOf(status.toUpperCase());
            flags = complianceFlagRepository.findByStatusOrderByFlaggedAtDesc(flagStatus);
        } else {
            flags = complianceFlagRepository.findAllByOrderByFlaggedAtDesc();
        }

        return flags.stream().map(this::toFlagResponse).collect(Collectors.toList());
    }

    public ComplianceFlagResponse raiseFlag(RaiseFlagRequest request, Long userId) {
        ComplianceFlag flag = ComplianceFlag.builder()
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .entityName(request.getEntityName())
                .flagType(request.getFlagType())
                .reason(request.getReason())
                .flaggedBy(userId)
                .status(ComplianceFlag.FlagStatus.OPEN)
                .build();

        flag = complianceFlagRepository.save(flag);

        // Log to audit
        AuditLog auditLog = AuditLog.builder()
                .entityType("COMPLIANCE_FLAG")
                .entityId(flag.getId())
                .action("FLAG_RAISED")
                .performedBy(userId)
                .notes("Flag raised: " + request.getFlagType() + " on " + request.getEntityType() + " #" + request.getEntityId())
                .build();
        auditLogRepository.save(auditLog);

        return toFlagResponse(flag);
    }

    public ComplianceFlagResponse resolveFlag(Long flagId, String notes, Long userId) {
        ComplianceFlag flag = complianceFlagRepository.findById(flagId)
                .orElseThrow(() -> new RuntimeException("Flag not found with id: " + flagId));

        flag.setStatus(ComplianceFlag.FlagStatus.RESOLVED);
        flag.setResolvedAt(LocalDateTime.now());
        flag.setResolvedBy(userId);
        flag.setNotes(notes);
        flag = complianceFlagRepository.save(flag);

        // Log to audit
        AuditLog auditLog = AuditLog.builder()
                .entityType("COMPLIANCE_FLAG")
                .entityId(flag.getId())
                .action("FLAG_RESOLVED")
                .performedBy(userId)
                .notes("Flag resolved: " + notes)
                .build();
        auditLogRepository.save(auditLog);

        return toFlagResponse(flag);
    }

    // ---- Risk Summary ----

    public List<PartnerRiskResponse> getRiskSummary() {
        List<User> partners = userRepository.findByRoleIn(PARTNER_ROLES);

        return partners.stream().map(p -> {
            long openFlagsCount = complianceFlagRepository.countByEntityIdAndStatus(p.getId(), ComplianceFlag.FlagStatus.OPEN);

            return PartnerRiskResponse.builder()
                    .id(p.getId())
                    .fullName(p.getFullName())
                    .firmName(p.getFirmName())
                    .email(p.getEmail())
                    .partnerType(p.getRole().name())
                    .isActivated(p.isActivated())
                    .missingArn(p.getArn() == null || p.getArn().isBlank())
                    .missingEuin(p.getEuin() == null || p.getEuin().isBlank())
                    .missingBankDetails(p.getPartnerBankAccount() == null || p.getPartnerBankAccount().isBlank())
                    .openFlagsCount(openFlagsCount)
                    .createdAt(p.getCreatedAt())
                    .build();
        }).collect(Collectors.toList());
    }

    // ---- Disclosures ----

    public List<DisclosureResponse> getDisclosures() {
        List<User> partners = userRepository.findByRoleIn(PARTNER_ROLES);

        return partners.stream().map(p -> DisclosureResponse.builder()
                .id(p.getId())
                .fullName(p.getFullName())
                .email(p.getEmail())
                .partnerType(p.getRole().name())
                .termsAccepted(Boolean.TRUE.equals(p.getTermsAccepted()))
                .declarationAccepted(Boolean.TRUE.equals(p.getDeclarationAccepted()))
                .consentComm(Boolean.TRUE.equals(p.getConsentComm()))
                .consentShareAmc(Boolean.TRUE.equals(p.getConsentShareWithAmc()))
                .consentShareDocs(Boolean.TRUE.equals(p.getConsentShareDocs()))
                .createdAt(p.getCreatedAt())
                .build()
        ).collect(Collectors.toList());
    }

    // ---- Helpers ----

    private ComplianceFlagResponse toFlagResponse(ComplianceFlag flag) {
        String flaggedByName = null;
        if (flag.getFlaggedBy() != null) {
            flaggedByName = userRepository.findById(flag.getFlaggedBy())
                    .map(User::getFullName)
                    .orElse(null);
        }
        String resolvedByName = null;
        if (flag.getResolvedBy() != null) {
            resolvedByName = userRepository.findById(flag.getResolvedBy())
                    .map(User::getFullName)
                    .orElse(null);
        }

        return ComplianceFlagResponse.builder()
                .id(flag.getId())
                .entityType(flag.getEntityType())
                .entityId(flag.getEntityId())
                .entityName(flag.getEntityName())
                .flagType(flag.getFlagType())
                .reason(flag.getReason())
                .flaggedBy(flag.getFlaggedBy())
                .flaggedByName(flaggedByName)
                .flaggedAt(flag.getFlaggedAt())
                .status(flag.getStatus().name())
                .resolvedAt(flag.getResolvedAt())
                .resolvedBy(flag.getResolvedBy())
                .resolvedByName(resolvedByName)
                .notes(flag.getNotes())
                .build();
    }
}
