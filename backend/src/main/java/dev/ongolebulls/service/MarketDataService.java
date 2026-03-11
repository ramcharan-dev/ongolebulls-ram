package dev.ongolebulls.service;

import dev.ongolebulls.model.Fund;
import dev.ongolebulls.repository.FundRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Service to fetch and update market data (NAV, indices) from external APIs
 * Supports AMFI (mutual fund NAV), BSE, and NSE data sources
 */
@Service
public class MarketDataService {

    @Autowired
    private FundRepository fundRepository;

    private final RestTemplate restTemplate;
    private static final String AMFI_NAV_URL = "https://www.amfiindia.com/spages/NAVAll.txt";
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("dd-MMM-yyyy");

    public MarketDataService() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * Fetches NAV data from AMFI and updates Fund records
     * AMFI publishes NAV data daily after market close (~6 PM IST)
     */
    public int updateNAVFromAMFI() {
        try {
            System.out.println("🔄 Fetching NAV data from AMFI...");
            
            String navData = restTemplate.getForObject(AMFI_NAV_URL, String.class);

            if (navData == null || navData.isEmpty()) {
                System.err.println("❌ No data received from AMFI");
                return 0;
            }

            Map<String, NAVRecord> navMap = parseAMFIData(navData);
            int updatedCount = updateFundsWithNAV(navMap);
            
            System.out.println("✅ Updated " + updatedCount + " funds with latest NAV");
            return updatedCount;
            
        } catch (Exception e) {
            System.err.println("❌ Error fetching AMFI data: " + e.getMessage());
            e.printStackTrace();
            return 0;
        }
    }

    /**
     * Parses AMFI NAV data format:
     * Scheme Code;ISIN Div Payout/ ISIN Growth;ISIN Div Reinvestment;Scheme Name;Net Asset Value;Date
     */
    private Map<String, NAVRecord> parseAMFIData(String data) {
        Map<String, NAVRecord> navMap = new HashMap<>();
        String[] lines = data.split("\n");
        
        boolean inDataSection = false;
        Pattern dataLinePattern = Pattern.compile("^\\d+;.*;.*;.*;\\d+\\.\\d+;\\d{2}-[A-Z]{3}-\\d{4}$");
        
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            
            // Skip header lines, start parsing after "Scheme Code" header
            if (line.contains("Scheme Code") && line.contains("Net Asset Value")) {
                inDataSection = true;
                continue;
            }
            
            if (inDataSection && dataLinePattern.matcher(line).matches()) {
                try {
                    String[] parts = line.split(";");
                    if (parts.length >= 6) {
                        String schemeCode = parts[0].trim();
                        String schemeName = parts[3].trim();
                        double nav = Double.parseDouble(parts[4].trim());
                        String dateStr = parts[5].trim();
                        
                        navMap.put(schemeName.toLowerCase(), new NAVRecord(schemeCode, schemeName, nav, dateStr));
                    }
                } catch (Exception e) {
                    // Skip malformed lines
                    continue;
                }
            }
        }
        
        return navMap;
    }

    /**
     * Updates Fund records with latest NAV values
     * Matches funds by name (case-insensitive)
     */
    private int updateFundsWithNAV(Map<String, NAVRecord> navMap) {
        List<Fund> allFunds = fundRepository.findAll();
        int updatedCount = 0;
        
        for (Fund fund : allFunds) {
            String fundName = fund.getName();
            if (fundName == null) continue;
            
            NAVRecord navRecord = navMap.get(fundName.toLowerCase());
            if (navRecord != null) {
                double oldNAV = fund.getNav() != null ? fund.getNav() : 0.0;
                double newNAV = navRecord.nav;
                
                // Update NAV
                fund.setNav(newNAV);
                
                // Calculate NAV change percentage
                if (oldNAV > 0) {
                    double changePercent = ((newNAV - oldNAV) / oldNAV) * 100;
                    fund.setNavChange(BigDecimal.valueOf(changePercent)
                            .setScale(2, RoundingMode.HALF_UP).doubleValue());
                } else {
                    fund.setNavChange(0.0);
                }
                
                fundRepository.save(fund);
                updatedCount++;
            }
        }
        
        return updatedCount;
    }

    /**
     * Fetches Nifty 50 and Sensex indices from NSE/BSE
     * Note: This is a placeholder - you'll need to use actual NSE/BSE API or third-party service
     */
    public Map<String, IndexData> fetchMarketIndices() {
        Map<String, IndexData> indices = new HashMap<>();
        
        try {
            // TODO: Replace with actual NSE/BSE API calls
            // Example using NSE API (requires proper authentication):
            // String niftyData = restTemplate.getForObject("https://www.nseindia.com/api/equity-stockIndices?index=NIFTY%2050", String.class);
            
            // For now, return placeholder data
            // In production, use:
            // - NSE API: https://www.nseindia.com/api/equity-stockIndices
            // - BSE API: https://api.bseindia.com/BseIndiaAPI/api/StockReachGraph/w
            // - Or third-party: Alpha Vantage, Yahoo Finance, etc.
            
            indices.put("NIFTY", new IndexData(24500.0, 0.45));
            indices.put("SENSEX", new IndexData(80200.0, 0.38));
            
        } catch (Exception e) {
            System.err.println("❌ Error fetching market indices: " + e.getMessage());
        }
        
        return indices;
    }

    /**
     * Updates portfolio current values based on latest NAV
     * This should be called after NAV update
     */
    public void updatePortfolioValues() {
        // This will be implemented in PortfolioService
        // Recalculate currentValue for all PortfolioPosition records
        System.out.println("📊 Portfolio values will be updated by PortfolioService");
    }

    // Inner class for NAV record
    private static class NAVRecord {
        String schemeCode;
        String schemeName;
        double nav;
        String date;

        NAVRecord(String schemeCode, String schemeName, double nav, String date) {
            this.schemeCode = schemeCode;
            this.schemeName = schemeName;
            this.nav = nav;
            this.date = date;
        }
    }

    // Inner class for index data
    public static class IndexData {
        public double value;
        public double changePercent;

        public IndexData(double value, double changePercent) {
            this.value = value;
            this.changePercent = changePercent;
        }
    }
}
