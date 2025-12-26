package dev.ongolebulls.dto;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class DashboardMetricsDto {
    private BigDecimal totalInvestment;
    private BigDecimal currentValue;
    private BigDecimal totalGainLoss;
    private BigDecimal xirr;
    private BigDecimal todayGainLoss;
    private BigDecimal totalGainLossPercentage;
    private BigDecimal availableBalance;
    private BigDecimal sipAmount;
    private String nextSipDate;
    private int activeSips;
    private int portfolioSize;
}