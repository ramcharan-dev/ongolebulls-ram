package dev.ongolebulls.controller;

import dev.ongolebulls.dto.PartnerRegistrationRequest;
import dev.ongolebulls.model.ReferralClick;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.ReferralClickRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class PartnerRegistrationController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ReferralClickRepository referralClickRepository;

    @PostMapping("/register/partner")
    public ResponseEntity<?> registerPartner(
            @RequestBody PartnerRegistrationRequest req,
            @RequestParam(required = false) Long ref) {

        // Validate partnerType
        if (req.getPartnerType() == null ||
                (!req.getPartnerType().equals("INDIVIDUAL_PARTNER") &&
                 !req.getPartnerType().equals("NON_INDIVIDUAL_PARTNER"))) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "partnerType must be INDIVIDUAL_PARTNER or NON_INDIVIDUAL_PARTNER"));
        }

        // Validate required fields
        if (req.getEmail() == null || req.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        if (req.getPassword() == null || req.getPassword().length() < 8) {
            return ResponseEntity.badRequest().body(Map.of("error", "Password must be at least 8 characters"));
        }
        if (req.getMobile() == null || !req.getMobile().matches("^[0-9]{10}$")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Mobile must be exactly 10 digits"));
        }

        // Check for duplicate email
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "An account with this email already exists"));
        }

        // Check for duplicate mobile
        if (userRepository.findByMobileNumber(req.getMobile()).isPresent()) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "An account with this mobile number already exists"));
        }

        try {
            Role role = Role.valueOf(req.getPartnerType());

            User user = User.builder()
                    .email(req.getEmail())
                    .mobileNumber(req.getMobile())
                    .passwordHash(passwordEncoder.encode(req.getPassword()))
                    .fullName(req.getFullName())
                    .role(role)
                    .isActivated(false)
                    .enabled(true)
                    .termsAccepted(true)
                    .declarationAccepted(true)
                    // Partner-specific fields
                    .firmName(req.getFirmName())
                    .authorizedPerson(req.getAuthorizedPerson())
                    .pan(req.getPan())
                    .arn(req.getArn())
                    .euin(req.getEuin())
                    .euinHolderName(req.getEuinHolderName())
                    .partnerBankAccount(req.getBankAccount())
                    .partnerIfsc(req.getIfsc())
                    .partnerBankName(req.getBankName())
                    .referredBy(ref != null && userRepository.findById(ref)
                            .filter(u -> u.getRole() == Role.INDIVIDUAL_PARTNER || u.getRole() == Role.NON_INDIVIDUAL_PARTNER)
                            .isPresent() ? ref : null)
                    .build();

            userRepository.save(user);

            // Track referral if ref param is valid
            if (ref != null && user.getReferredBy() != null) {
                String referrerName = userRepository.findById(ref)
                        .map(u -> u.getFullName() != null ? u.getFullName() : u.getFirmName())
                        .orElse("Unknown");
                ReferralClick click = ReferralClick.builder()
                        .referrerId(ref)
                        .referrerName(referrerName)
                        .referralType(req.getPartnerType())
                        .converted(true)
                        .registeredUserId(user.getId())
                        .registeredUserName(req.getFullName() != null ? req.getFullName() : req.getFirmName())
                        .registeredAt(java.time.LocalDateTime.now())
                        .build();
                referralClickRepository.save(click);
                log.info("Referral recorded: referrer={}, newUser={}", ref, user.getEmail());
            }

            log.info("Partner registered: email={}, role={}", req.getEmail(), role);

            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful. Awaiting activation.",
                    "email", req.getEmail()
            ));

        } catch (Exception ex) {
            log.error("Partner registration failed: {}", ex.getMessage(), ex);
            return ResponseEntity.badRequest().body(Map.of("error", "Registration failed: " + ex.getMessage()));
        }
    }

    @GetMapping("/referrer-info")
    public ResponseEntity<?> getReferrerInfo(@RequestParam Long ref) {
        return userRepository.findById(ref)
                .filter(u -> u.getRole() == Role.INDIVIDUAL_PARTNER || u.getRole() == Role.NON_INDIVIDUAL_PARTNER)
                .map(u -> ResponseEntity.ok(Map.of(
                        "referrerName", u.getFullName() != null ? u.getFullName() : u.getFirmName(),
                        "referrerType", u.getRole().name()
                )))
                .orElse(ResponseEntity.notFound().build());
    }
}
