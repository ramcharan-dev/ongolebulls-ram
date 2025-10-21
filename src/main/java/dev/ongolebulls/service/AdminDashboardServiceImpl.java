package dev.ongolebulls.service;


import dev.ongolebulls.dto.AdminDashboardDTO;
import dev.ongolebulls.model.RMPerformance;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    @Override
    public Map<String, Object> getKpi() {
        Map<String, Object> kpi = new HashMap<>();
        kpi.put("totalClients", 1580);
        kpi.put("activeInvestments", 1120);
        kpi.put("monthlySips", 875);
        kpi.put("riskProfilesCompleted", 1050);
        kpi.put("rmConversionRate", 78.4);
        return kpi;
    }

    @Override
    public AdminDashboardDTO.ChartData getSipChart() {
        return new AdminDashboardDTO.ChartData(
                List.of("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"),
                List.of(40, 45, 50, 60, 55, 48, 52, 58, 62, 65, 70, 72),
                List.of(38, 43, 49, 58, 52, 46, 50, 55, 60, 62, 67, 70)
        );
    }

    @Override
    public AdminDashboardDTO.ChartData getRiskChart() {
        return new AdminDashboardDTO.ChartData(
                List.of("Conservative", "Moderate", "Aggressive"),
                List.of(35, 50, 15)
        );
    }

    @Override
    public AdminDashboardDTO.ChartData getGoalChart() {
        return new AdminDashboardDTO.ChartData(
                List.of("Child Education", "Retirement", "House", "Emergency", "Vacation"),
                List.of(28, 34, 22, 10, 6)
        );
    }

    @Override
    public List<RMPerformance> getLeaderboard() {
        return List.of(
                new RMPerformance("RM Ananya", 12500000),
                new RMPerformance("RM Karthik", 11400000),
                new RMPerformance("RM Neha", 9800000),
                new RMPerformance("RM Rohan", 9200000),
                new RMPerformance("RM Farhan", 8800000)
        );
    }

    @Override
    public List<Map<String, String>> getAlerts() {
        return List.of(
                Map.of("title", "Incomplete KYC", "detail", "11 customers pending Aadhaar verification"),
                Map.of("title", "Missed SIPs", "detail", "7 SIPs missed in last 3 days"),
                Map.of("title", "Expiring Goals", "detail", "5 goals approaching target date"),
                Map.of("title", "Dormant Clients", "detail", "13 inactive for 90+ days")
        );
    }
}
