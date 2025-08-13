package dev.ongolebulls.service;

import dev.ongolebulls.model.ClientMetrics;
import dev.ongolebulls.repository.ClientMetricsRepository;
import dev.ongolebulls.service.ClientMetricsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ClientMetricsServiceImpl implements ClientMetricsService {

    @Autowired
    private ClientMetricsRepository repository;

    @Override
    public ClientMetrics getMetricsByUsername(String username) {
        return repository.findByUsername(username).orElse(null);
    }
}
