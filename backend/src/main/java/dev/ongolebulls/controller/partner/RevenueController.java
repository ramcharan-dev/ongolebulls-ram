package dev.ongolebulls.controller.partner;

import dev.ongolebulls.model.User;
import dev.ongolebulls.service.partner.PartnerService;
import dev.ongolebulls.service.partner.RevenueService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/partner/revenue")
@RequiredArgsConstructor
@Slf4j
public class RevenueController {

    private final PartnerService partnerService;
    private final RevenueService revenueService;

    @GetMapping
    public ResponseEntity<?> getRevenue(Authentication auth) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(revenueService.getRevenue(partner.getId()));
        } catch (Exception e) {
            log.error("Error fetching revenue: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
