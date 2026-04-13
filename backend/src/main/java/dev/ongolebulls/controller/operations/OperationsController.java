package dev.ongolebulls.controller.operations;

import dev.ongolebulls.model.User;
import dev.ongolebulls.service.operations.OperationsService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/operations")
@RequiredArgsConstructor
@Slf4j
public class OperationsController {

    private final OperationsService operationsService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            return ResponseEntity.ok(operationsService.getStats());
        } catch (Exception e) {
            log.error("Error fetching operations stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/partners/pending")
    public ResponseEntity<?> getPendingPartners() {
        try {
            return ResponseEntity.ok(operationsService.getPendingPartners());
        } catch (Exception e) {
            log.error("Error fetching pending partners: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/partners/all")
    public ResponseEntity<?> getAllPartners(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        try {
            return ResponseEntity.ok(operationsService.getAllPartners(search, status, type));
        } catch (Exception e) {
            log.error("Error fetching partners: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/partners/{id}/activate")
    public ResponseEntity<?> activatePartner(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(operationsService.activatePartner(id));
        } catch (Exception e) {
            log.error("Error activating partner: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/partners/{id}/reject")
    public ResponseEntity<?> rejectPartner(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(operationsService.rejectPartner(id, body.get("rejectionReason")));
        } catch (Exception e) {
            log.error("Error rejecting partner: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/clients/kyc-queue")
    public ResponseEntity<?> getKycQueue(@RequestParam(required = false) String stage) {
        try {
            return ResponseEntity.ok(operationsService.getKycQueue(stage));
        } catch (Exception e) {
            log.error("Error fetching KYC queue: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/clients/{id}/lifecycle")
    public ResponseEntity<?> updateClientLifecycle(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            return ResponseEntity.ok(operationsService.updateClientLifecycle(id, body.get("stage")));
        } catch (Exception e) {
            log.error("Error updating client lifecycle: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/documents/pending")
    public ResponseEntity<?> getPendingDocuments() {
        try {
            return ResponseEntity.ok(operationsService.getPendingDocuments());
        } catch (Exception e) {
            log.error("Error fetching documents: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/documents/{id}/review")
    public ResponseEntity<?> markDocumentReviewed(
            Authentication auth,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            User opsUser = operationsService.getCurrentOpsUser(auth);
            return ResponseEntity.ok(operationsService.markDocumentReviewed(id, opsUser.getId(), body.get("status")));
        } catch (Exception e) {
            log.error("Error reviewing document: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
