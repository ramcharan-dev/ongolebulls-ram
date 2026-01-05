package dev.ongolebulls.service;

import dev.ongolebulls.dto.FundDetailDto;
import dev.ongolebulls.model.Fund;
import dev.ongolebulls.repository.FundRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class NavService {

    private final FundRepository fundRepository;
    private final Random random = new Random();

    /**
     * Mock AMFI NAV data service
     * In production, this would fetch from AMFI API or database
     */
    public List<FundDetailDto.NavHistoryDto> getNavHistory(Long fundId) {
        Fund fund = fundRepository.findById(fundId)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        BigDecimal baseNav = fund.getNav() != null 
                ? BigDecimal.valueOf(fund.getNav()) 
                : BigDecimal.valueOf(100);

        List<FundDetailDto.NavHistoryDto> history = new ArrayList<>();
        LocalDate today = LocalDate.now();

        // Generate last 30 days of NAV data
        for (int i = 29; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            
            // Simulate NAV fluctuations
            double changePercent = (random.nextDouble() - 0.5) * 2; // -1% to +1%
            BigDecimal nav = baseNav.multiply(BigDecimal.valueOf(1 + changePercent / 100))
                    .setScale(4, RoundingMode.HALF_UP);
            
            BigDecimal change = baseNav.multiply(BigDecimal.valueOf(changePercent / 100))
                    .setScale(4, RoundingMode.HALF_UP);

            history.add(FundDetailDto.NavHistoryDto.builder()
                    .date(date)
                    .nav(nav)
                    .change(change)
                    .build());
        }

        return history;
    }

    /**
     * Get latest NAV for a fund plan
     */
    public BigDecimal getLatestNav(Long fundId) {
        Fund fund = fundRepository.findById(fundId)
                .orElseThrow(() -> new RuntimeException("Fund not found"));
        
        return fund.getNav() != null 
                ? BigDecimal.valueOf(fund.getNav()) 
                : BigDecimal.valueOf(100);
    }

    /**
     * Update NAV from AMFI data (mock implementation)
     */
    public void updateNavFromAmfi(Long fundId) {
        // In production, this would:
        // 1. Fetch NAV from AMFI API
        // 2. Update fund and fund plans with latest NAV
        // 3. Store historical NAV data
    }
}

