package dev.ongolebulls.controller.compliance;

import dev.ongolebulls.dto.compliance.*;
import dev.ongolebulls.model.User;
import dev.ongolebulls.service.compliance.ComplianceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/compliance")
@RequiredArgsConstructor
@Slf4j
public class ComplianceController {

    private final ComplianceService complianceService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        try {
            ComplianceStatsResponse stats = complianceService.getStats();
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching compliance stats", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<?> getAuditLogs(
            @RequestParam(required = false) String entityType,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to) {
        try {
            List<AuditLogResponse> logs = complianceService.getAuditLogs(entityType, search, from, to);
            return ResponseEntity.ok(logs);
        } catch (Exception e) {
            log.error("Error fetching audit logs", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/flags")
    public ResponseEntity<?> getFlags(@RequestParam(required = false) String status) {
        try {
            List<ComplianceFlagResponse> flags = complianceService.getFlags(status);
            return ResponseEntity.ok(flags);
        } catch (Exception e) {
            log.error("Error fetching compliance flags", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/flags")
    public ResponseEntity<?> raiseFlag(@RequestBody RaiseFlagRequest request, Authentication auth) {
        try {
            User currentUser = complianceService.getCurrentUser(auth);
            ComplianceFlagResponse response = complianceService.raiseFlag(request, currentUser.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error raising compliance flag", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/flags/{id}/resolve")
    public ResponseEntity<?> resolveFlag(
            @PathVariable Long id,
            @RequestBody ResolveFlagRequest request,
            Authentication auth) {
        try {
            User currentUser = complianceService.getCurrentUser(auth);
            ComplianceFlagResponse response = complianceService.resolveFlag(id, request.getNotes(), currentUser.getId());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            log.error("Error resolving compliance flag", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/partners/risk-summary")
    public ResponseEntity<?> getRiskSummary() {
        try {
            List<PartnerRiskResponse> summary = complianceService.getRiskSummary();
            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            log.error("Error fetching partner risk summary", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/disclosures")
    public ResponseEntity<?> getDisclosures() {
        try {
            List<DisclosureResponse> disclosures = complianceService.getDisclosures();
            return ResponseEntity.ok(disclosures);
        } catch (Exception e) {
            log.error("Error fetching disclosures", e);
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}
