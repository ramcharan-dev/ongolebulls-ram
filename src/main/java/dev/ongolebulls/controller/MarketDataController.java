package dev.ongolebulls.controller;

import dev.ongolebulls.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * REST API endpoints for market data operations
 * Allows manual refresh of NAV and market indices
 */
@RestController
@RequestMapping("/api/market-data")
public class MarketDataController {

    @Autowired
    private MarketDataService marketDataService;

    /**
     * Manually trigger NAV update from AMFI
     * GET /api/market-data/update-nav
     */
    @GetMapping("/update-nav")
    public ResponseEntity<Map<String, Object>> updateNAV() {
        Map<String, Object> response = new HashMap<>();
        try {
            int updatedCount = marketDataService.updateNAVFromAMFI();
            response.put("success", true);
            response.put("message", "NAV data updated successfully");
            response.put("fundsUpdated", updatedCount);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Error updating NAV: " + e.getMessage());
            return ResponseEntity.status(500).body(response);
        }
    }

    /**
     * Get current market indices (Nifty, Sensex)
     * GET /api/market-data/indices
     */
    @GetMapping("/indices")
    public ResponseEntity<Map<String, MarketDataService.IndexData>> getMarketIndices() {
        try {
            Map<String, MarketDataService.IndexData> indices = marketDataService.fetchMarketIndices();
            return ResponseEntity.ok(indices);
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    /**
     * Health check for market data service
     * GET /api/market-data/health
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> health = new HashMap<>();
        health.put("status", "UP");
        health.put("service", "MarketDataService");
        return ResponseEntity.ok(health);
    }
}
