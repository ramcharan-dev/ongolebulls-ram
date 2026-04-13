package dev.ongolebulls.dto.finance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FinanceStatsResponse {
    private long totalPayoutsPending;
    private long totalPayoutsReleased;
    private BigDecimal pendingAmount;
    private BigDecimal releasedThisMonth;
    private long activeCommissionRules;
    private long disputedPayouts;
}
