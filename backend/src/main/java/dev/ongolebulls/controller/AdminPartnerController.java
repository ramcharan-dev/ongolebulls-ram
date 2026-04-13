package dev.ongolebulls.controller;

import dev.ongolebulls.dto.PartnerSummaryResponse;
import dev.ongolebulls.dto.admin.ArnRequestResponse;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.RmAssignmentService;
import dev.ongolebulls.service.partner.PartnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/partners")
@RequiredArgsConstructor
@Slf4j
public class AdminPartnerController {

    private final UserRepository userRepository;
    private final PartnerService partnerService;
    private final RmAssignmentService rmAssignmentService;

    private static final Set<Role> PARTNER_ROLES = Set.of(
            Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER
    );

    @GetMapping
    public ResponseEntity<List<PartnerSummaryResponse>> listPartners(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String state,
            @RequestParam(required = false) String district,
            @RequestParam(required = false) Long rmId
    ) {
        List<User> partners;

        if (type != null && !type.isBlank()) {
            try {
                Role role = Role.valueOf(type);
                partners = userRepository.findByRole(role);
            } catch (IllegalArgumentException e) {
                partners = userRepository.findByRoleIn(PARTNER_ROLES);
            }
        } else {
            partners = userRepository.findByRoleIn(PARTNER_ROLES);
        }

        // Build an RM id -> name lookup once, so every row in the response
        // can show the assigned RM's display name without N+1 queries.
        Map<Long, String> rmNameById = new HashMap<>();
        for (User rm : userRepository.findByRole(Role.RELATIONSHIP_MANAGER)) {
            rmNameById.put(rm.getId(), rm.getFullName() != null ? rm.getFullName() : rm.getEmail());
        }

        List<PartnerSummaryResponse> result = partners.stream()
                .filter(p -> {
                    if ("active".equalsIgnoreCase(status)) return p.isActivated();
                    if ("pending".equalsIgnoreCase(status)) return !p.isActivated();
                    return true;
                })
                .filter(p -> {
                    if (search == null || search.isBlank()) return true;
                    String q = search.toLowerCase();
                    String name = p.getFullName() != null ? p.getFullName().toLowerCase() : "";
                    String email = p.getEmail() != null ? p.getEmail().toLowerCase() : "";
                    String arn = p.getArn() != null ? p.getArn().toLowerCase() : "";
                    return name.contains(q) || email.contains(q) || arn.contains(q);
                })
                .filter(p -> state == null || state.isBlank()
                        || (p.getState() != null && p.getState().equalsIgnoreCase(state)))
                .filter(p -> district == null || district.isBlank()
                        || (p.getDistrict() != null && p.getDistrict().equalsIgnoreCase(district)))
                .filter(p -> rmId == null || (p.getAssignedRmId() != null && p.getAssignedRmId().equals(rmId)))
                .map(p -> toPartnerSummary(p, rmNameById))
                .toList();

        return ResponseEntity.ok(result);
    }

    /**
     * PATCH /api/admin/partners/{id}/assign-rm
     * Body: { "rmId": 42 }  (pass null/omit to clear)
     * or    { "rmId": null }
     * Manually overrides the auto-assigned RM for a partner.
     */
    @PatchMapping("/{id}/assign-rm")
    public ResponseEntity<?> assignRm(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Object rmIdObj = body.get("rmId");
        Long newRmId;
        if (rmIdObj == null) {
            newRmId = null;
        } else if (rmIdObj instanceof Number) {
            newRmId = ((Number) rmIdObj).longValue();
        } else {
            try {
                newRmId = Long.valueOf(rmIdObj.toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "rmId must be numeric or null"));
            }
        }

        // Validate that the target is actually an RM, if an id was provided.
        if (newRmId != null) {
            User rm = userRepository.findById(newRmId).orElse(null);
            if (rm == null || rm.getRole() != Role.RELATIONSHIP_MANAGER) {
                return ResponseEntity.badRequest().body(Map.of("error", "Target user is not a Relationship Manager"));
            }
        }

        return userRepository.findById(id)
                .map(partner -> {
                    if (!PARTNER_ROLES.contains(partner.getRole())) {
                        return ResponseEntity.badRequest().body((Object) Map.of("error", "User is not a partner"));
                    }
                    partner.setAssignedRmId(newRmId);
                    User saved = userRepository.save(partner);
                    log.info("Partner {} RM manually overridden to rmId={}", id, newRmId);

                    Map<Long, String> rmNameById = new HashMap<>();
                    if (newRmId != null) {
                        userRepository.findById(newRmId).ifPresent(rm ->
                                rmNameById.put(rm.getId(),
                                        rm.getFullName() != null ? rm.getFullName() : rm.getEmail()));
                    }
                    return ResponseEntity.ok((Object) toPartnerSummary(saved, rmNameById));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/activate")
    public ResponseEntity<?> activatePartner(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (!PARTNER_ROLES.contains(user.getRole())) {
                        return ResponseEntity.badRequest().body(Map.of("error", "User is not a partner"));
                    }
                    user.setActivated(true);
                    User saved = userRepository.save(user);
                    log.info("Partner {} activated", id);
                    return ResponseEntity.ok(toPartnerSummary(saved, lookupRmName(saved.getAssignedRmId())));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/deactivate")
    public ResponseEntity<?> deactivatePartner(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(user -> {
                    if (!PARTNER_ROLES.contains(user.getRole())) {
                        return ResponseEntity.badRequest().body(Map.of("error", "User is not a partner"));
                    }
                    user.setActivated(false);
                    User saved = userRepository.save(user);
                    log.info("Partner {} deactivated", id);
                    return ResponseEntity.ok(toPartnerSummary(saved, lookupRmName(saved.getAssignedRmId())));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private Map<Long, String> lookupRmName(Long rmId) {
        Map<Long, String> m = new HashMap<>();
        if (rmId != null) {
            userRepository.findById(rmId).ifPresent(rm ->
                    m.put(rm.getId(), rm.getFullName() != null ? rm.getFullName() : rm.getEmail()));
        }
        return m;
    }

    @GetMapping("/arn-requests")
    public ResponseEntity<List<ArnRequestResponse>> getArnRequests(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        return ResponseEntity.ok(partnerService.getArnRequests(status, search));
    }

    @PatchMapping("/arn-requests/{userId}/approve")
    public ResponseEntity<?> approveArn(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(partnerService.approveArn(userId));
        } catch (Exception e) {
            log.error("Error approving ARN for user {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/arn-requests/{userId}/reject")
    public ResponseEntity<?> rejectArn(@PathVariable Long userId, @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "No reason provided");
            return ResponseEntity.ok(partnerService.rejectArn(userId, reason));
        } catch (Exception e) {
            log.error("Error rejecting ARN for user {}: {}", userId, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private PartnerSummaryResponse toPartnerSummary(User u, Map<Long, String> rmNameById) {
        String rmName = null;
        if (u.getAssignedRmId() != null && rmNameById != null) {
            rmName = rmNameById.get(u.getAssignedRmId());
        }
        return PartnerSummaryResponse.builder()
                .id(u.getId())
                .fullName(u.getFullName())
                .firmName(u.getFirmName())
                .email(u.getEmail())
                .mobileNumber(u.getMobileNumber())
                .partnerType(u.getRole().name())
                .arn(u.getArn())
                .pan(u.getPan())
                .euin(u.getEuin())
                .partnerBankAccount(u.getPartnerBankAccount())
                .partnerIfsc(u.getPartnerIfsc())
                .partnerBankName(u.getPartnerBankName())
                .isActivated(u.isActivated())
                .createdAt(u.getCreatedAt())
                .state(u.getState())
                .district(u.getDistrict())
                .city(u.getCity())
                .assignedRmId(u.getAssignedRmId())
                .assignedRmName(rmName)
                .build();
    }
}
