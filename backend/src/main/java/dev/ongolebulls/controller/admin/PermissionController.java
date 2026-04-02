package dev.ongolebulls.controller.admin;

import dev.ongolebulls.dto.admin.UserPermissionRequest;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.admin.PermissionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/permissions")
@RequiredArgsConstructor
@Slf4j
public class PermissionController {

    private final PermissionService permissionService;
    private final UserRepository userRepository;

    @GetMapping("/roles")
    public ResponseEntity<?> getRoleUsers() {
        try {
            return ResponseEntity.ok(permissionService.getRoleUsers());
        } catch (Exception e) {
            log.error("Error fetching role users", e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/users/{userId}")
    public ResponseEntity<?> getUserPermissions(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(permissionService.getUserPermissions(userId));
        } catch (Exception e) {
            log.error("Error fetching permissions for userId={}", userId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/users/{userId}")
    public ResponseEntity<?> updateUserPermissions(
            @PathVariable Long userId,
            @RequestBody UserPermissionRequest request,
            Authentication auth) {
        try {
            User admin = userRepository.findByEmail(auth.getName())
                    .orElseThrow(() -> new RuntimeException("Admin not found"));
            return ResponseEntity.ok(permissionService.updateUserPermissions(userId, request, admin.getId()));
        } catch (Exception e) {
            log.error("Error updating permissions for userId={}", userId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/defaults/{role}")
    public ResponseEntity<?> getRoleDefaults(@PathVariable String role) {
        try {
            return ResponseEntity.ok(permissionService.getRoleDefaults(role));
        } catch (Exception e) {
            log.error("Error fetching defaults for role={}", role, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
