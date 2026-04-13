package dev.ongolebulls.controller.support;

import dev.ongolebulls.dto.support.*;
import dev.ongolebulls.model.User;
import dev.ongolebulls.service.support.SupportService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/support")
@RequiredArgsConstructor
@Slf4j
public class SupportController {

    private final SupportService supportService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) {
        try {
            User currentUser = supportService.getCurrentUser(auth);
            SupportStatsResponse stats = supportService.getStats(currentUser.getId());
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching support stats", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch stats: " + e.getMessage()));
        }
    }

    @GetMapping("/tickets")
    public ResponseEntity<?> getTickets(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String priority,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        try {
            List<TicketResponse> tickets = supportService.getTickets(status, priority, category, search);
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            log.error("Error fetching tickets", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch tickets: " + e.getMessage()));
        }
    }

    @GetMapping("/tickets/mine")
    public ResponseEntity<?> getMyTickets(Authentication auth) {
        try {
            User currentUser = supportService.getCurrentUser(auth);
            List<TicketResponse> tickets = supportService.getMyTickets(currentUser.getId());
            return ResponseEntity.ok(tickets);
        } catch (Exception e) {
            log.error("Error fetching my tickets", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch my tickets: " + e.getMessage()));
        }
    }

    @GetMapping("/tickets/{id}")
    public ResponseEntity<?> getTicketDetail(@PathVariable Long id) {
        try {
            TicketDetailResponse detail = supportService.getTicketDetail(id);
            return ResponseEntity.ok(detail);
        } catch (Exception e) {
            log.error("Error fetching ticket detail for id: {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch ticket detail: " + e.getMessage()));
        }
    }

    @PostMapping("/tickets/{id}/reply")
    public ResponseEntity<?> addReply(
            @PathVariable Long id,
            @RequestBody TicketReplyRequest request,
            Authentication auth) {
        try {
            User currentUser = supportService.getCurrentUser(auth);
            TicketReplyResponse reply = supportService.addReply(
                    id, request.getMessage(), request.isInternal(), currentUser.getId());
            return ResponseEntity.ok(reply);
        } catch (Exception e) {
            log.error("Error adding reply to ticket id: {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to add reply: " + e.getMessage()));
        }
    }

    @PatchMapping("/tickets/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Authentication auth) {
        try {
            User currentUser = supportService.getCurrentUser(auth);
            String newStatus = body.get("status");
            if (newStatus == null || newStatus.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Status is required"));
            }
            TicketResponse ticket = supportService.updateStatus(id, newStatus, currentUser.getId());
            return ResponseEntity.ok(ticket);
        } catch (IllegalArgumentException e) {
            log.error("Invalid status value for ticket id: {}", id, e);
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid status value: " + e.getMessage()));
        } catch (Exception e) {
            log.error("Error updating status for ticket id: {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to update status: " + e.getMessage()));
        }
    }

    @PatchMapping("/tickets/{id}/assign")
    public ResponseEntity<?> assignTicket(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        try {
            String assignedToStr = body.get("assignedTo");
            if (assignedToStr == null || assignedToStr.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "assignedTo is required"));
            }
            Long assignedTo = Long.parseLong(assignedToStr);
            TicketResponse ticket = supportService.assignTicket(id, assignedTo);
            return ResponseEntity.ok(ticket);
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "assignedTo must be a valid user ID"));
        } catch (Exception e) {
            log.error("Error assigning ticket id: {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to assign ticket: " + e.getMessage()));
        }
    }

    @PatchMapping("/tickets/{id}/escalate")
    public ResponseEntity<?> escalateTicket(@PathVariable Long id) {
        try {
            TicketResponse ticket = supportService.escalateTicket(id);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            log.error("Error escalating ticket id: {}", id, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to escalate ticket: " + e.getMessage()));
        }
    }

    @GetMapping("/escalations")
    public ResponseEntity<?> getEscalations() {
        try {
            List<EscalationResponse> escalations = supportService.getEscalations();
            return ResponseEntity.ok(escalations);
        } catch (Exception e) {
            log.error("Error fetching escalations", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Failed to fetch escalations: " + e.getMessage()));
        }
    }
}
