package dev.ongolebulls.controller.bse;

import dev.ongolebulls.service.bse.BseTokenManager;
import dev.ongolebulls.service.bse.BseV2Service;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/bse")
@RequiredArgsConstructor
@Slf4j
public class BseController {

    private final BseV2Service bseService;
    private final BseTokenManager tokenManager;

    @GetMapping("/status/{transactionId}")
    public ResponseEntity<?> getStatus(@PathVariable String transactionId) {
        return ResponseEntity.ok(bseService.getStatus(transactionId));
    }

    @PostMapping("/login")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> triggerLogin() {
        try {
            tokenManager.fetchNewToken();
            return ResponseEntity.ok(Map.of(
                "message", "BSE login successful",
                "success", true
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "message", "BSE login failed",
                "error", e.getMessage(),
                "success", false
            ));
        }
    }

    @PostMapping("/schemes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> fetchSchemes(
            @RequestParam(defaultValue = "0") int start,
            @RequestParam(defaultValue = "100") int length,
            @RequestParam(required = false) String search,
            Authentication auth) {
        String txId = bseService.fetchSchemeList(start, length, search, null);
        return ResponseEntity.accepted().body(Map.of(
            "transactionId", txId,
            "message", "Scheme list fetch initiated",
            "pollUrl", "/api/bse/status/" + txId
        ));
    }

    @PostMapping("/nav")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> fetchNav(
            @RequestParam(defaultValue = "0") int start,
            @RequestParam(defaultValue = "100") int length,
            @RequestParam(required = false) String schemeCode,
            Authentication auth) {
        String txId = bseService.fetchNavList(start, length, schemeCode, null);
        return ResponseEntity.accepted().body(Map.of(
            "transactionId", txId,
            "message", "NAV fetch initiated",
            "pollUrl", "/api/bse/status/" + txId
        ));
    }

    @GetMapping("/transactions")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getBseTransactions(
            @RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(bseService.getRecentTransactions(limit));
    }
}
