package dev.ongolebulls.service.admin;

import dev.ongolebulls.dto.admin.*;
import dev.ongolebulls.model.AuditLog;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.model.UserPermission;
import dev.ongolebulls.repository.AuditLogRepository;
import dev.ongolebulls.repository.UserPermissionRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PermissionService {

    private final UserPermissionRepository userPermissionRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;

    private static final Map<String, List<String>> DASHBOARD_SECTIONS = Map.of(
            "RM", List.of("OVERVIEW", "MY_PARTNERS", "BUSINESS_PERFORMANCE", "TASKS"),
            "OPERATIONS", List.of("OVERVIEW", "PARTNER_VERIFICATION", "CLIENT_KYC", "DOCUMENTS"),
            "COMPLIANCE", List.of("OVERVIEW", "AUDIT_LOGS", "FLAGS", "PARTNER_RISK", "DISCLOSURES"),
            "FINANCE", List.of("OVERVIEW", "PAYOUTS", "COMMISSION_RULES", "RECONCILIATION", "GST_TDS"),
            "SUPPORT", List.of("OVERVIEW", "ALL_TICKETS", "MY_TICKETS", "ESCALATIONS")
    );

    private static final Map<String, String> ROLE_TO_DASHBOARD = Map.of(
            "RELATIONSHIP_MANAGER", "RM",
            "OPERATIONS", "OPERATIONS",
            "COMPLIANCE", "COMPLIANCE",
            "FINANCE", "FINANCE",
            "SUPPORT", "SUPPORT"
    );

    private static final Map<String, String> ROLE_DISPLAY_NAMES = Map.of(
            "RELATIONSHIP_MANAGER", "Relationship Manager",
            "OPERATIONS", "Operations",
            "COMPLIANCE", "Compliance",
            "FINANCE", "Finance",
            "SUPPORT", "Support"
    );

    private PermissionRow getDefaultPermission(String role, String section) {
        boolean cv = true, cc = false, ce = false, cd = false, ca = false;

        switch (role) {
            case "RELATIONSHIP_MANAGER":
                cc = section.equals("TASKS");
                ce = section.equals("TASKS");
                break;
            case "OPERATIONS":
                ce = section.equals("CLIENT_KYC") || section.equals("PARTNER_VERIFICATION");
                ca = section.equals("PARTNER_VERIFICATION");
                break;
            case "COMPLIANCE":
                cc = section.equals("FLAGS");
                ca = section.equals("FLAGS");
                break;
            case "FINANCE":
                cc = section.equals("PAYOUTS") || section.equals("COMMISSION_RULES");
                ce = section.equals("COMMISSION_RULES");
                ca = section.equals("PAYOUTS");
                break;
            case "SUPPORT":
                cc = section.equals("ALL_TICKETS") || section.equals("MY_TICKETS");
                ce = section.equals("ALL_TICKETS") || section.equals("MY_TICKETS");
                break;
        }

        return PermissionRow.builder()
                .section(section).canView(cv).canCreate(cc).canEdit(ce).canDelete(cd).canApprove(ca)
                .build();
    }

    public List<RoleUsersResponse> getRoleUsers() {
        List<RoleUsersResponse> result = new ArrayList<>();

        for (Map.Entry<String, String> entry : ROLE_DISPLAY_NAMES.entrySet()) {
            String roleName = entry.getKey();
            String displayName = entry.getValue();
            Role role = Role.valueOf(roleName);

            List<User> users = userRepository.findByRole(role);
            List<RoleUsersResponse.UserEntry> userEntries = users.stream()
                    .map(u -> RoleUsersResponse.UserEntry.builder()
                            .id(u.getId())
                            .name(u.getFullName())
                            .email(u.getEmail())
                            .isActivated(u.getIsActivated() != null && u.getIsActivated())
                            .build())
                    .collect(Collectors.toList());

            result.add(RoleUsersResponse.builder()
                    .role(roleName)
                    .displayName(displayName)
                    .userCount(users.size())
                    .users(userEntries)
                    .build());
        }

        return result;
    }

    public UserPermissionResponse getUserPermissions(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String roleName = user.getRole().name();
        String dashboard = ROLE_TO_DASHBOARD.get(roleName);

        if (dashboard == null) {
            throw new RuntimeException("No dashboard mapping for role: " + roleName);
        }

        List<String> sections = DASHBOARD_SECTIONS.get(dashboard);
        List<UserPermission> stored = userPermissionRepository.findByUserId(userId);

        Map<String, UserPermission> storedMap = stored.stream()
                .collect(Collectors.toMap(UserPermission::getSection, p -> p, (a, b) -> b));

        List<PermissionRow> permissions = new ArrayList<>();
        for (String section : sections) {
            UserPermission sp = storedMap.get(section);
            if (sp != null) {
                permissions.add(PermissionRow.builder()
                        .section(section)
                        .canView(sp.getCanView() != null && sp.getCanView())
                        .canCreate(sp.getCanCreate() != null && sp.getCanCreate())
                        .canEdit(sp.getCanEdit() != null && sp.getCanEdit())
                        .canDelete(sp.getCanDelete() != null && sp.getCanDelete())
                        .canApprove(sp.getCanApprove() != null && sp.getCanApprove())
                        .build());
            } else {
                permissions.add(getDefaultPermission(roleName, section));
            }
        }

        return UserPermissionResponse.builder()
                .userId(userId)
                .userName(user.getFullName())
                .role(roleName)
                .dashboard(dashboard)
                .permissions(permissions)
                .build();
    }

    @Transactional
    public UserPermissionResponse updateUserPermissions(Long userId, UserPermissionRequest request, Long adminId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        String roleName = user.getRole().name();
        String dashboard = ROLE_TO_DASHBOARD.get(roleName);

        if (dashboard == null) {
            throw new RuntimeException("No dashboard mapping for role: " + roleName);
        }

        userPermissionRepository.deleteByUserId(userId);

        List<UserPermission> newPermissions = new ArrayList<>();
        for (UserPermissionRequest.PermissionEntry entry : request.getPermissions()) {
            UserPermission perm = UserPermission.builder()
                    .userId(userId)
                    .dashboard(entry.getDashboard() != null ? entry.getDashboard() : dashboard)
                    .section(entry.getSection())
                    .canView(entry.isCanView())
                    .canCreate(entry.isCanCreate())
                    .canEdit(entry.isCanEdit())
                    .canDelete(entry.isCanDelete())
                    .canApprove(entry.isCanApprove())
                    .updatedBy(adminId)
                    .build();
            newPermissions.add(perm);
        }

        userPermissionRepository.saveAll(newPermissions);

        AuditLog auditLog = AuditLog.builder()
                .entityType("USER")
                .entityId(userId)
                .action("PERMISSIONS_UPDATED")
                .performedBy(adminId)
                .notes("Permissions updated for user " + user.getFullName() + " (role: " + roleName + ")")
                .build();
        auditLogRepository.save(auditLog);

        log.info("Permissions updated for userId={} by adminId={}", userId, adminId);

        return getUserPermissions(userId);
    }

    public UserPermissionResponse getRoleDefaults(String role) {
        String dashboard = ROLE_TO_DASHBOARD.get(role);

        if (dashboard == null) {
            throw new RuntimeException("No dashboard mapping for role: " + role);
        }

        List<String> sections = DASHBOARD_SECTIONS.get(dashboard);
        List<PermissionRow> permissions = sections.stream()
                .map(section -> getDefaultPermission(role, section))
                .collect(Collectors.toList());

        return UserPermissionResponse.builder()
                .userId(0L)
                .userName("Default")
                .role(role)
                .dashboard(dashboard)
                .permissions(permissions)
                .build();
    }
}
