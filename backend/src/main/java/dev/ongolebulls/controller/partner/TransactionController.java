package dev.ongolebulls.controller.partner;

import dev.ongolebulls.dto.partner.TransactionRequest;
import dev.ongolebulls.model.User;
import dev.ongolebulls.service.partner.PartnerService;
import dev.ongolebulls.service.partner.TransactionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/partner/transactions")
@RequiredArgsConstructor
@Slf4j
public class TransactionController {

    private final PartnerService partnerService;
    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<?> createTransaction(Authentication auth, @RequestBody TransactionRequest request) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(transactionService.createTransaction(partner, request));
        } catch (Exception e) {
            log.error("Error creating transaction: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getTransactions(
            Authentication auth,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {
        try {
            User partner = partnerService.getCurrentPartner(auth);
            return ResponseEntity.ok(transactionService.getTransactions(partner.getId(), type, status));
        } catch (Exception e) {
            log.error("Error fetching transactions: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
