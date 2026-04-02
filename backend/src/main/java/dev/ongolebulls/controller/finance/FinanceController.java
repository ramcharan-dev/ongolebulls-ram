package dev.ongolebulls.controller.finance;

import dev.ongolebulls.dto.finance.CommissionRuleRequest;
import dev.ongolebulls.dto.finance.PayoutRequest;
import dev.ongolebulls.model.User;
import dev.ongolebulls.service.finance.FinanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/finance")
@RequiredArgsConstructor
@Slf4j
public class FinanceController {

    private final FinanceService financeService;

    // ── Stats ───────────────────────────────────────────────────────────

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(financeService.getStats());
        } catch (Exception e) {
            log.error("Error fetching finance stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Payouts ─────────────────────────────────────────────────────────

    @GetMapping("/payouts")
    public ResponseEntity<?> getPayouts(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String period,
            @RequestParam(required = false) String search) {
        try {
            return ResponseEntity.ok(financeService.getPayouts(status, period, search));
        } catch (Exception e) {
            log.error("Error fetching payouts: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/payouts")
    public ResponseEntity<?> createPayout(@RequestBody PayoutRequest request, Authentication auth) {
        try {
            User user = financeService.getCurrentUser(auth);
            return ResponseEntity.ok(financeService.createPayout(request, user.getId()));
        } catch (Exception e) {
            log.error("Error creating payout: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/payouts/{id}/release")
    public ResponseEntity<?> releasePayout(@PathVariable Long id, Authentication auth) {
        try {
            User user = financeService.getCurrentUser(auth);
            return ResponseEntity.ok(financeService.releasePayout(id, user.getId()));
        } catch (Exception e) {
            log.error("Error releasing payout: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/payouts/{id}/dispute")
    public ResponseEntity<?> disputePayout(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String reason = body.getOrDefault("reason", "No reason provided");
            return ResponseEntity.ok(financeService.disputePayout(id, reason));
        } catch (Exception e) {
            log.error("Error disputing payout: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Commission Rules ────────────────────────────────────────────────

    @GetMapping("/commission-rules")
    public ResponseEntity<?> getCommissionRules() {
        try {
            return ResponseEntity.ok(financeService.getCommissionRules());
        } catch (Exception e) {
            log.error("Error fetching commission rules: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/commission-rules")
    public ResponseEntity<?> createCommissionRule(@RequestBody CommissionRuleRequest request, Authentication auth) {
        try {
            User user = financeService.getCurrentUser(auth);
            return ResponseEntity.ok(financeService.createCommissionRule(request, user.getId()));
        } catch (Exception e) {
            log.error("Error creating commission rule: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/commission-rules/{id}")
    public ResponseEntity<?> updateCommissionRule(@PathVariable Long id, @RequestBody CommissionRuleRequest request) {
        try {
            return ResponseEntity.ok(financeService.updateCommissionRule(id, request));
        } catch (Exception e) {
            log.error("Error updating commission rule: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/commission-rules/{id}/deactivate")
    public ResponseEntity<?> deactivateCommissionRule(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(financeService.deactivateCommissionRule(id));
        } catch (Exception e) {
            log.error("Error deactivating commission rule: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Reconciliation ──────────────────────────────────────────────────

    @GetMapping("/reconciliation")
    public ResponseEntity<?> getReconciliation(@RequestParam(required = false) String period) {
        try {
            if (period == null || period.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Period parameter is required"));
            }
            return ResponseEntity.ok(financeService.getReconciliation(period));
        } catch (Exception e) {
            log.error("Error fetching reconciliation: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── GST / TDS Summary ───────────────────────────────────────────────

    @GetMapping("/gst-tds-summary")
    public ResponseEntity<?> getGstTdsSummary(@RequestParam(required = false) String period) {
        try {
            if (period == null || period.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Period parameter is required"));
            }
            return ResponseEntity.ok(financeService.getGstTdsSummary(period));
        } catch (Exception e) {
            log.error("Error fetching GST/TDS summary: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // ── Partners ────────────────────────────────────────────────────────

    @GetMapping("/partners")
    public ResponseEntity<?> getPartners() {
        try {
            return ResponseEntity.ok(financeService.getPartners());
        } catch (Exception e) {
            log.error("Error fetching partners: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
