package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PortfolioAssetDto {
    private Long id;
    private String schemeName;
    private String assetClass;
    private BigDecimal investedAmount;
    private BigDecimal currentValue;
    private BigDecimal returns;
    private Double returnsPercentage;
    private String status; // ACTIVE, CLOSED
    private String category; // MUTUAL_FUNDS, STOCKS, SIP, FIXED_INCOME, OTHERS
}


