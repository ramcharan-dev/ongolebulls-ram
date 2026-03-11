package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioSummaryDto {
    private BigDecimal totalPortfolioValue;
    private BigDecimal totalInvestedAmount;
    private BigDecimal totalReturns;
    private Double returnsPercentage;
    private BigDecimal daysGainLoss;
    private Integer activeSipsCount;
    private LocalDateTime lastUpdated;
    private String investorId;
    private String investorName;
}


