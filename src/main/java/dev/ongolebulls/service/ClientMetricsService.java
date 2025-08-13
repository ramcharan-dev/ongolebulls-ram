package dev.ongolebulls.service;


import dev.ongolebulls.model.ClientMetrics;

public interface ClientMetricsService {
    ClientMetrics getMetricsByUsername(String username);
}
