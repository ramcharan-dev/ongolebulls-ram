package dev.ongolebulls.dto.partner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerStatsResponse {
    private long totalClients;
    private long activeInvestors;
    private long pendingKyc;
    private long monthlySips;
    private long totalTransactions;
    private BigDecimal totalTransactionAmount;
    private BigDecimal totalRevenue;
    private Map<String, Long> lifecycleDistribution;
}
