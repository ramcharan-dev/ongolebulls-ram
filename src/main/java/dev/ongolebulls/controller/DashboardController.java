package dev.ongolebulls.controller;

import dev.ongolebulls.dto.DashboardPayload;
import dev.ongolebulls.model.User;
import dev.ongolebulls.service.DashboardService;
import dev.ongolebulls.service.UserService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
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
    public DashboardPayload get(@PathVariable Long userId) {
        return dashboardService.load(userId);
    }


    // New endpoint for asset allocation
    @GetMapping("/{userId}/asset-allocation")
    public List<Map<String, Object>> getAssetAllocation(@PathVariable Long userId) {
        return dashboardService.getAssetAllocation(userId);
    }


}
