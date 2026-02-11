package dev.ongolebulls.scheduler;

import dev.ongolebulls.service.MarketDataService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * Scheduled tasks to update market data (NAV, indices) automatically
 * 
 * Schedule:
 * - NAV Update: Daily at 6:30 PM IST (after market close)
 * - Market Indices: Every 30 seconds during market hours (9:15 AM - 3:30 PM IST)
 */
@Component
public class MarketDataScheduler {

    @Autowired
    private MarketDataService marketDataService;

    /**
     * Updates NAV data from AMFI daily after market close
     * Runs Monday-Friday at 6:30 PM IST
     * Cron format: second minute hour day month weekday
     * IST is UTC+5:30, so 6:30 PM IST = 1:00 PM UTC
     */
    @Scheduled(cron = "0 0 13 * * MON-FRI", zone = "Asia/Kolkata")
    public void updateNAVDaily() {
        System.out.println("⏰ Scheduled NAV update started at " + 
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        
        try {
            int updatedCount = marketDataService.updateNAVFromAMFI();
            System.out.println("✅ NAV update completed. Updated " + updatedCount + " funds.");
        } catch (Exception e) {
            System.err.println("❌ Error in scheduled NAV update: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Updates market indices (Nifty, Sensex) every 30 seconds during market hours
     * Market hours: 9:15 AM - 3:30 PM IST (Monday-Friday)
     * Note: This runs every 30 seconds but only updates during market hours
     */
    @Scheduled(fixedRate = 30000) // Every 30 seconds
    public void updateMarketIndices() {
        // Check if it's a trading day and market hours
        LocalDateTime now = LocalDateTime.now();
        int hour = now.getHour();
        int dayOfWeek = now.getDayOfWeek().getValue(); // 1=Monday, 7=Sunday
        
        // Market hours: 9:15 AM (9) to 3:30 PM (15) IST, Monday-Friday
        if (dayOfWeek >= 1 && dayOfWeek <= 5 && hour >= 9 && hour < 16) {
            try {
                var indices = marketDataService.fetchMarketIndices();
                // Store indices in cache or database for frontend to fetch
                // For now, just log
                System.out.println("📈 Market indices updated: " + indices);
            } catch (Exception e) {
                System.err.println("❌ Error updating market indices: " + e.getMessage());
            }
        }
    }

    /**
     * Manual trigger endpoint can be added to MarketDataController
     * for testing or manual refresh
     */
}
