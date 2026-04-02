package dev.ongolebulls.controller;

import dev.ongolebulls.dto.PartnerSummaryResponse;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/partners")
@RequiredArgsConstructor
@Slf4j
public class AdminPartnerController {

    private final UserRepository userRepository;

    private static final Set<Role> PARTNER_ROLES = Set.of(
            Role.INDIVIDUAL_PARTNER, Role.NON_INDIVIDUAL_PARTNER
    );

    @GetMapping
    public ResponseEntity<List<PartnerSummaryResponse>> listPartners(
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
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
                .map(this::toPartnerSummary)
                .toList();

        return ResponseEntity.ok(result);
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
                    return ResponseEntity.ok(toPartnerSummary(saved));
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
                    return ResponseEntity.ok(toPartnerSummary(saved));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    private PartnerSummaryResponse toPartnerSummary(User u) {
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
                .build();
    }
}
