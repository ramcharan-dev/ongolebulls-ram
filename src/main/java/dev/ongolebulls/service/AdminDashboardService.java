package dev.ongolebulls.service;



import dev.ongolebulls.dto.AdminDashboardDTO;
import dev.ongolebulls.model.RMPerformance;

import java.util.List;
import java.util.Map;

public interface AdminDashboardService {

    Map<String, Object> getKpi();

    AdminDashboardDTO.ChartData getSipChart();

    AdminDashboardDTO.ChartData getRiskChart();

    AdminDashboardDTO.ChartData getGoalChart();

    List<RMPerformance> getLeaderboard();

    List<Map<String, String>> getAlerts();
}
