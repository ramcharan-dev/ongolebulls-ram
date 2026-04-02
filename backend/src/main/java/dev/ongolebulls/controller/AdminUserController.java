package dev.ongolebulls.controller;

import dev.ongolebulls.dto.CreateUserRequest;
import dev.ongolebulls.dto.UserSummaryResponse;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@Slf4j
public class AdminUserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    private static final Set<Role> EXCLUDED_ROLES = Set.of(
            Role.USER, Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER
    );

    private static final Set<String> ALLOWED_INTERNAL_ROLES = Set.of(
            "RELATIONSHIP_MANAGER", "OPERATIONS", "COMPLIANCE", "FINANCE", "SUPPORT", "ADMIN"
    );

    /**
     * POST /api/admin/users — Create an internal user
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest req) {
        // Validate role
        if (req.getRole() == null || req.getRole().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Role is required"));
        }

        if ("INDIVIDUAL_PARTNER".equals(req.getRole()) || "NON_INDIVIDUAL_PARTNER".equals(req.getRole())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Partners must self-register through the partner registration page"));
        }

        if (!ALLOWED_INTERNAL_ROLES.contains(req.getRole())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid role. Allowed: RELATIONSHIP_MANAGER, OPERATIONS, COMPLIANCE, FINANCE, SUPPORT, ADMIN"));
        }

        // Validate required fields
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (req.getName() == null || req.getName().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Name is required"));
        }
        if (req.getPassword() == null || req.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters"));
        }

        // Check duplicate email
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        try {
            Role role = Role.valueOf(req.getRole());

            User user = User.builder()
                    .fullName(req.getName())
                    .email(req.getEmail())
                    .mobileNumber("0000000000") // placeholder for internal users
                    .passwordHash(passwordEncoder.encode(req.getPassword()))
                    .role(role)
                    .isActivated(true)
                    .enabled(true)
                    .termsAccepted(true)
                    .declarationAccepted(true)
                    .build();

            User saved = userRepository.save(user);

            log.info("Internal user created: email={}, role={}", req.getEmail(), role);

            return ResponseEntity.ok(Map.of(
                    "message", "User created successfully",
                    "userId", saved.getId()
            ));
        } catch (Exception ex) {
            log.error("Failed to create user: {}", ex.getMessage(), ex);
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to create user: " + ex.getMessage()));
        }
    }

    /**
     * GET /api/admin/users — List internal users (excludes partners and regular users)
     */
    @GetMapping
    public ResponseEntity<List<UserSummaryResponse>> listInternalUsers() {
        List<User> users = userRepository.findByRoleNotIn(EXCLUDED_ROLES);

        List<UserSummaryResponse> response = users.stream()
                .map(u -> UserSummaryResponse.builder()
                        .id(u.getId())
                        .name(u.getFullName())
                        .email(u.getEmail())
                        .role(u.getRole().name())
                        .isActivated(u.isActivated())
                        .createdAt(u.getCreatedAt())
                        .build())
                .toList();

        return ResponseEntity.ok(response);
    }

    /**
     * PATCH /api/admin/users/{id}/status — Toggle activation status
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    user.setActivated(!user.isActivated());
                    User saved = userRepository.save(user);

                    log.info("User {} activation toggled to {}", id, saved.isActivated());

                    return ResponseEntity.ok(UserSummaryResponse.builder()
                            .id(saved.getId())
                            .name(saved.getFullName())
                            .email(saved.getEmail())
                            .role(saved.getRole().name())
                            .isActivated(saved.isActivated())
                            .createdAt(saved.getCreatedAt())
                            .build());
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * POST /api/admin/users/{id}/reset-password — Reset a user's password
     */
    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newPassword = body.get("newPassword");
        if (newPassword == null || newPassword.length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters"));
        }

        return userRepository.findById(id)
                .map(user -> {
                    user.setPasswordHash(passwordEncoder.encode(newPassword));
                    userRepository.save(user);
                    log.info("Password reset for user {}", id);
                    return ResponseEntity.ok(Map.of("message", "Password reset successfully"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
