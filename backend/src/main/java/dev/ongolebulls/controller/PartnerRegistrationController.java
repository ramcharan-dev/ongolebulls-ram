package dev.ongolebulls.controller;

import dev.ongolebulls.dto.PartnerRegistrationRequest;
import dev.ongolebulls.model.ReferralClick;
import dev.ongolebulls.model.Role;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.ReferralClickRepository;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.LocationService;
import dev.ongolebulls.service.RmAssignmentService;
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
    private final LocationService locationService;
    private final RmAssignmentService rmAssignmentService;

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

        // Validate location — state + district must exist in the master, city is free-text.
        if (req.getState() == null || req.getState().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "State is required"));
        }
        if (req.getDistrict() == null || req.getDistrict().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "District is required"));
        }
        if (req.getCity() == null || req.getCity().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "City is required"));
        }
        if (!locationService.isValidState(req.getState())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Invalid state: " + req.getState()));
        }
        if (!locationService.isValidStateAndDistrict(req.getState(), req.getDistrict())) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "District '" + req.getDistrict() +
                            "' does not belong to state '" + req.getState() + "'"));
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
                    // Partner location
                    .state(req.getState().trim())
                    .district(req.getDistrict().trim())
                    .city(req.getCity().trim())
                    .referredBy(ref != null && userRepository.findById(ref)
                            .filter(u -> u.getRole() == Role.INDIVIDUAL_PARTNER || u.getRole() == Role.NON_INDIVIDUAL_PARTNER)
                            .isPresent() ? ref : null)
                    .build();

            // Auto-assign an RM based on the partner's location (state + district).
            // Sets user.assignedRmId in-place; null if no RM covers that area.
            Long assignedRmId = rmAssignmentService.autoAssignRm(user);

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

            log.info("Partner registered: email={}, role={}, state={}, district={}, assignedRmId={}",
                    req.getEmail(), role, req.getState(), req.getDistrict(), assignedRmId);

            Map<String, Object> response = new java.util.HashMap<>();
            response.put("message", "Registration successful. Awaiting activation.");
            response.put("email", req.getEmail());
            response.put("assignedRmId", assignedRmId); // null if no RM matched
            return ResponseEntity.ok(response);

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
