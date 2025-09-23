package dev.ongolebulls.controller;

import dev.ongolebulls.dto.DashboardPayload;
import dev.ongolebulls.service.DashboardService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
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
