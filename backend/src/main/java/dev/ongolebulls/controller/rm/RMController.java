package dev.ongolebulls.controller.rm;

import dev.ongolebulls.dto.rm.TaskRequest;
import dev.ongolebulls.model.User;
import dev.ongolebulls.service.rm.RMService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/rm")
@RequiredArgsConstructor
@Slf4j
public class RMController {

    private final RMService rmService;

    @GetMapping("/stats")
    public ResponseEntity<?> getStats(Authentication auth) {
        try {
            User rm = rmService.getCurrentRM(auth);
            return ResponseEntity.ok(rmService.getStats(rm.getId()));
        } catch (Exception e) {
            log.error("Error fetching RM stats: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/partners")
    public ResponseEntity<?> getPartners(
            Authentication auth,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String type) {
        try {
            User rm = rmService.getCurrentRM(auth);
            return ResponseEntity.ok(rmService.getPartners(rm.getId(), search, status, type));
        } catch (Exception e) {
            log.error("Error fetching partners: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/performance")
    public ResponseEntity<?> getPerformance(Authentication auth) {
        try {
            User rm = rmService.getCurrentRM(auth);
            return ResponseEntity.ok(rmService.getPerformance(rm.getId()));
        } catch (Exception e) {
            log.error("Error fetching performance: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/tasks")
    public ResponseEntity<?> getTasks(Authentication auth) {
        try {
            User rm = rmService.getCurrentRM(auth);
            return ResponseEntity.ok(rmService.getTasks(rm.getId()));
        } catch (Exception e) {
            log.error("Error fetching tasks: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/tasks")
    public ResponseEntity<?> createTask(Authentication auth, @RequestBody TaskRequest request) {
        try {
            User rm = rmService.getCurrentRM(auth);
            return ResponseEntity.ok(rmService.createTask(rm.getId(), request));
        } catch (Exception e) {
            log.error("Error creating task: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/tasks/{id}/complete")
    public ResponseEntity<?> completeTask(Authentication auth, @PathVariable Long id) {
        try {
            User rm = rmService.getCurrentRM(auth);
            return ResponseEntity.ok(rmService.completeTask(rm.getId(), id));
        } catch (Exception e) {
            log.error("Error completing task: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/tasks/{id}/reopen")
    public ResponseEntity<?> reopenTask(Authentication auth, @PathVariable Long id) {
        try {
            User rm = rmService.getCurrentRM(auth);
            return ResponseEntity.ok(rmService.reopenTask(rm.getId(), id));
        } catch (Exception e) {
            log.error("Error reopening task: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/tasks/{id}")
    public ResponseEntity<?> deleteTask(Authentication auth, @PathVariable Long id) {
        try {
            User rm = rmService.getCurrentRM(auth);
            rmService.deleteTask(rm.getId(), id);
            return ResponseEntity.ok(Map.of("message", "Task deleted"));
        } catch (Exception e) {
            log.error("Error deleting task: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
