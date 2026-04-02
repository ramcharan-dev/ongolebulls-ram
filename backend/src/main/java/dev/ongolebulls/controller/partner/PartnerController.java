package dev.ongolebulls.controller.partner;

import dev.ongolebulls.dto.partner.AddClientRequest;
import dev.ongolebulls.dto.partner.ReferralResponse;
import dev.ongolebulls.dto.partner.TrackerHoldingRequest;
import dev.ongolebulls.model.ReferralClick;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.ReferralClickRepository;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.partner.PartnerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/partner")
@RequiredArgsConstructor
@Slf4j
public class PartnerController {

    private final PartnerService partnerService;
    private final ReferralClickRepository referralClickRepository;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getProfile(Authentication auth) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.getProfile(partner));
        } catch (Exception e) {
            log.error("Error fetching partner profile: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.getStats(partner.getId()));
        } catch (Exception e) {
            log.error("Error fetching partner stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/profile")
    public ResponseEntity<?> updateProfile(Authentication auth, @RequestBody Map<String, String> updates) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.updateProfile(partner, updates));
        } catch (Exception e) {
            log.error("Error updating profile: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/bank-details")
    public ResponseEntity<?> updateBankDetails(Authentication auth, @RequestBody Map<String, String> body) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.updateBankDetails(
                    partner,
                    body.get("partnerBankAccount"),
                    body.get("partnerIfsc"),
                    body.get("partnerBankName")
            ));
        } catch (Exception e) {
            log.error("Error updating bank details: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/agreement")
    public ResponseEntity<?> acceptAgreement(Authentication auth) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.acceptAgreement(partner));
        } catch (Exception e) {
            log.error("Error accepting agreement: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/clients")
    public ResponseEntity<?> addClient(Authentication auth, @RequestBody AddClientRequest request) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.addClient(partner, request));
        } catch (RuntimeException e) {
            if (e.getMessage().contains("not activated")) {
                return ResponseEntity.status(403).body(Map.of("error", e.getMessage()));
            }
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/clients")
    public ResponseEntity<?> getClients(
            Authentication auth,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String stage) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.getClients(partner.getId(), stage, search));
        } catch (Exception e) {
            log.error("Error fetching clients: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/clients/{clientId}/lifecycle")
    public ResponseEntity<?> updateClientLifecycle(
            Authentication auth,
            @PathVariable Long clientId,
            @RequestBody Map<String, String> body) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.updateClientLifecycle(partner, clientId, body.get("stage")));
        } catch (Exception e) {
            log.error("Error updating client lifecycle: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/sips")
    public ResponseEntity<?> getSips(Authentication auth, @RequestParam(required = false) String status) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.getSips(partner.getId(), status));
        } catch (Exception e) {
            log.error("Error fetching SIPs: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/tracker/upload")
    public ResponseEntity<?> uploadCas(Authentication auth, @RequestParam("file") MultipartFile file) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.uploadCasFile(partner, file));
        } catch (Exception e) {
            log.error("Error uploading CAS: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/tracker/holdings")
    public ResponseEntity<?> addHoldings(Authentication auth, @RequestBody List<TrackerHoldingRequest> holdings) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.addHoldings(partner.getId(), holdings));
        } catch (Exception e) {
            log.error("Error adding holdings: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tracker/holdings")
    public ResponseEntity<?> getHoldings(Authentication auth) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.getHoldings(partner.getId()));
        } catch (Exception e) {
            log.error("Error fetching holdings: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tracker/cob-opportunities")
    public ResponseEntity<?> getCobOpportunities(Authentication auth) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(partnerService.getCobOpportunities(partner.getId()));
        } catch (Exception e) {
            log.error("Error fetching COB opportunities: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/referrals")
    public ResponseEntity<?> getReferrals(Authentication auth) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            List<ReferralClick> clicks = referralClickRepository.findByReferrerIdOrderByClickedAtDesc(partner.getId());
            List<ReferralResponse> responses = clicks.stream().map(c -> {
                String status = null;
                if (c.getRegisteredUserId() != null) {
                    status = userRepository.findById(c.getRegisteredUserId())
                            .map(u -> u.isActivated() ? "Active" : "Pending")
                            .orElse("Unknown");
                }
                return ReferralResponse.builder()
                        .id(c.getId())
                        .referralType(c.getReferralType())
                        .clickedAt(c.getClickedAt())
                        .converted(Boolean.TRUE.equals(c.getConverted()))
                        .registeredUserName(c.getRegisteredUserName())
                        .registeredAt(c.getRegisteredAt())
                        .registeredUserId(c.getRegisteredUserId())
                        .partnerStatus(status)
                        .build();
            }).toList();
            return ResponseEntity.ok(responses);
        } catch (Exception e) {
            log.error("Error fetching referrals: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
