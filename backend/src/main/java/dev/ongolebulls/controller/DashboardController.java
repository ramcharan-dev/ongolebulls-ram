package dev.ongolebulls.controller;

import dev.ongolebulls.dto.*;
import dev.ongolebulls.service.DashboardService;
import dev.ongolebulls.service.UserService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserService userService;

    public DashboardController(DashboardService dashboardService, UserService userService) {
        this.dashboardService = dashboardService;
        this.userService = userService;
    }


    @GetMapping("/{userId}")
    public ResponseEntity<DashboardPayload> get(@PathVariable Long userId) {

        DashboardPayload payload = dashboardService.load(userId);

        if (payload == null) {
            payload = new DashboardPayload(); // 👈 NEVER return empty response
        }

        return ResponseEntity.ok(payload);
    }

    @GetMapping("/{userId}/asset-allocation")
    public List<Map<String, Object>> getAssetAllocation(@PathVariable Long userId) {
        return dashboardService.getAssetAllocation(userId);
    }

    @GetMapping("/{userId}/profile")
    public ResponseEntity<UserProfileDto> getUserProfile(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getUserProfile(userId));
    }

    @PutMapping("/{userId}/profile")
    public ResponseEntity<UserProfileDto> updateUserProfile(
            @PathVariable Long userId,
            @Valid @RequestBody UserProfileUpdateDto profileUpdateDto) {
        return ResponseEntity.ok(dashboardService.updateUserProfile(userId, profileUpdateDto));
    }

    @GetMapping("/{userId}/transactions")
    public ResponseEntity<Page<TransactionDto>> getTransactions(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(dashboardService.getUserTransactions(userId, page, size));
    }

    @GetMapping("/{userId}/metrics")
    public ResponseEntity<DashboardMetricsDto> getDashboardMetrics(@PathVariable Long userId) {
        return ResponseEntity.ok(dashboardService.getDashboardMetrics(userId));
    }

    @GetMapping("/{userId}/recent-activity")
    public ResponseEntity<List<ActivityDto>> getRecentActivity(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentActivity(userId, limit));
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody ChangePasswordDto changePasswordDto) {
        dashboardService.changePassword(userId, changePasswordDto);
        return ResponseEntity.ok().build();
    }
}