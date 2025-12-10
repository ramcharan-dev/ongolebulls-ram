package dev.ongolebulls.controller;

import dev.ongolebulls.dto.AdminDashboardDTO;
import dev.ongolebulls.model.Client;
import dev.ongolebulls.model.RMPerformance;
import dev.ongolebulls.service.AdminDashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api") // Instead of /api/admin/dashboard

@CrossOrigin(origins = "*") // Allow cross-origin requests
public class AdminDashboardController {

    private final AdminDashboardService service;

    public AdminDashboardController(AdminDashboardService service) {
        this.service = service;
    }

    @GetMapping("/kpi")
    public ResponseEntity<Map<String, Object>> getKpi() {
        Map<String, Object> kpi = service.getKpi();
        return ResponseEntity.ok(kpi);
    }

    @GetMapping("/charts/sip")
    public ResponseEntity<AdminDashboardDTO.ChartData> getSipChart() {
        return ResponseEntity.ok(service.getSipChart());
    }

    @GetMapping("/charts/risk")
    public ResponseEntity<AdminDashboardDTO.ChartData> getRiskChart() {
        return ResponseEntity.ok(service.getRiskChart());
    }

    @GetMapping("/charts/goals")
    public ResponseEntity<AdminDashboardDTO.ChartData> getGoalChart() {
        return ResponseEntity.ok(service.getGoalChart());
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<RMPerformance>> getLeaderboard() {
        return ResponseEntity.ok(service.getLeaderboard());
    }

    @GetMapping("/alerts")
    public ResponseEntity<List<Map<String, String>>> getAlerts() {
        return ResponseEntity.ok(service.getAlerts());
    }

    // Report endpoints
    @GetMapping("/reports/rm")
    public ResponseEntity<String> generateRmReport(@RequestParam(defaultValue = "pdf") String format) {
        return ResponseEntity.ok("RM report generated in format: " + format);
    }

    @GetMapping("/reports/compliance")
    public ResponseEntity<String> getComplianceSummary(@RequestParam(defaultValue = "month") String period) {
        return ResponseEntity.ok("Compliance summary for period: " + period);
    }

//    @GetMapping("/clients")
//    public ResponseEntity<List<Client>> getClients() {
//        return ResponseEntity.ok(service.getAllClients());
//    }

}
