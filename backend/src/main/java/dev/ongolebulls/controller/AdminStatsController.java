package dev.ongolebulls.controller;

import dev.ongolebulls.dto.AdminStatsResponse;
import dev.ongolebulls.dto.UserSummaryResponse;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final UserRepository userRepository;

    private static final Set<Role> PARTNER_ROLES = Set.of(
            Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER
    );

    private static final Set<Role> EXCLUDED_FROM_INTERNAL = Set.of(
            Role.USER, Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER
    );

    @GetMapping
    public ResponseEntity<AdminStatsResponse> getStats() {
        long totalPartners = userRepository.countByRoleIn(PARTNER_ROLES);
        long activePartners = userRepository.countByRoleInAndIsActivated(PARTNER_ROLES, true);
        long pendingActivation = userRepository.countByRoleInAndIsActivated(PARTNER_ROLES, false);
        long totalClients = userRepository.countByRole(Role.USER);

        List<UserSummaryResponse> recentPartners = userRepository
                .findTop5ByRoleInOrderByCreatedAtDesc(PARTNER_ROLES)
                .stream()
                .map(this::toSummary)
                .toList();

        List<UserSummaryResponse> recentInternalUsers = userRepository
                .findTop5ByRoleNotInOrderByCreatedAtDesc(Set.of(Role.USER, Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER))
                .stream()
                .map(this::toSummary)
                .toList();

        return ResponseEntity.ok(AdminStatsResponse.builder()
                .totalPartners(totalPartners)
                .activePartners(activePartners)
                .pendingActivation(pendingActivation)
                .totalClients(totalClients)
                .recentPartners(recentPartners)
                .recentInternalUsers(recentInternalUsers)
                .build());
    }

    private UserSummaryResponse toSummary(User u) {
        return UserSummaryResponse.builder()
                .id(u.getId())
                .name(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .isActivated(u.isActivated())
                .createdAt(u.getCreatedAt())
                .build();
    }
}
