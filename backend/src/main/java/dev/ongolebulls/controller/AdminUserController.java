package dev.ongolebulls.controller;

import dev.ongolebulls.dto.CreateUserRequest;
import dev.ongolebulls.dto.UserSummaryResponse;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.LocationService;
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
    private final LocationService locationService;

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

        // RM-specific validation: location is required and must exist in the master.
        boolean isRm = "RELATIONSHIP_MANAGER".equals(req.getRole());
        if (isRm) {
            if (req.getAssignedState() == null || req.getAssignedState().isBlank()) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "assignedState is required for Relationship Manager"));
            }
            if (!locationService.isValidState(req.getAssignedState())) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "Invalid assignedState: " + req.getAssignedState()));
            }
            // assignedDistrict is optional — blank means state-level RM.
            if (req.getAssignedDistrict() != null && !req.getAssignedDistrict().isBlank()
                    && !locationService.isValidStateAndDistrict(req.getAssignedState(), req.getAssignedDistrict())) {
                return ResponseEntity.badRequest().body(
                        Map.of("error", "District '" + req.getAssignedDistrict() +
                                "' does not belong to state '" + req.getAssignedState() + "'"));
            }
        }

        // Check duplicate email
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
        }

        try {
            Role role = Role.valueOf(req.getRole());

            User.UserBuilder builder = User.builder()
                    .fullName(req.getName())
                    .email(req.getEmail())
                    // Unique placeholder — mobile column has a UNIQUE constraint so
                    // we can't reuse "0000000000" for every internal user.
                    .mobileNumber("00" + String.valueOf(System.currentTimeMillis()).substring(5))
                    .passwordHash(passwordEncoder.encode(req.getPassword()))
                    .role(role)
                    .isActivated(true)
                    .enabled(true)
                    .termsAccepted(true)
                    .declarationAccepted(true);

            if (isRm) {
                builder.assignedState(req.getAssignedState().trim());
                if (req.getAssignedDistrict() != null && !req.getAssignedDistrict().isBlank()) {
                    builder.assignedDistrict(req.getAssignedDistrict().trim());
                }
                // City is a free-text field (no master table). Case-insensitive
                // matching happens at lookup time in RmAssignmentService.
                if (req.getAssignedCity() != null && !req.getAssignedCity().isBlank()) {
                    builder.assignedCity(req.getAssignedCity().trim());
                }
            }

            User saved = userRepository.save(builder.build());

            log.info("Internal user created: email={}, role={}, assignedState={}, assignedDistrict={}, assignedCity={}",
                    req.getEmail(), role, saved.getAssignedState(), saved.getAssignedDistrict(), saved.getAssignedCity());

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
                .map(this::toSummary)
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
                    return ResponseEntity.ok(toSummary(saved));
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

    /**
     * PATCH /api/admin/users/{id}/rm-location — Update an RM's service area.
     * Body: { "assignedState": "...", "assignedDistrict": "...", "assignedCity": "..." }
     * assignedDistrict and assignedCity are optional. Passing an empty string
     * clears the field.
     */
    @PatchMapping("/{id}/rm-location")
    public ResponseEntity<?> updateRmLocation(@PathVariable Long id,
                                              @RequestBody Map<String, String> body) {
        String state = body.get("assignedState");
        String district = body.get("assignedDistrict");
        String city = body.get("assignedCity");

        if (state == null || state.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "assignedState is required"));
        }
        if (!locationService.isValidState(state)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid assignedState: " + state));
        }
        if (district != null && !district.isBlank()
                && !locationService.isValidStateAndDistrict(state, district)) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "District '" + district + "' does not belong to state '" + state + "'"));
        }

        return userRepository.findById(id)
                .map(user -> {
                    if (user.getRole() != Role.RELATIONSHIP_MANAGER) {
                        return ResponseEntity.badRequest().body(
                                (Object) Map.of("error", "User is not a Relationship Manager"));
                    }
                    user.setAssignedState(state.trim());
                    user.setAssignedDistrict(district != null && !district.isBlank() ? district.trim() : null);
                    user.setAssignedCity(city != null && !city.isBlank() ? city.trim() : null);
                    User saved = userRepository.save(user);
                    log.info("RM {} location updated to state={}, district={}, city={}",
                            id, saved.getAssignedState(), saved.getAssignedDistrict(), saved.getAssignedCity());
                    return ResponseEntity.ok((Object) toSummary(saved));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private UserSummaryResponse toSummary(User u) {
        return UserSummaryResponse.builder()
                .id(u.getId())
                .name(u.getFullName())
                .email(u.getEmail())
                .role(u.getRole().name())
                .isActivated(u.isActivated())
                .createdAt(u.getCreatedAt())
                .assignedState(u.getAssignedState())
                .assignedDistrict(u.getAssignedDistrict())
                .assignedCity(u.getAssignedCity())
                .build();
    }
}
