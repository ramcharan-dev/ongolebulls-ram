package dev.ongolebulls.dto.finance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReconciliationResponse {
    private String period;
    private BigDecimal totalGross;
    private BigDecimal totalGst;
    private BigDecimal totalTds;
    private BigDecimal totalNetReleased;
    private BigDecimal pendingRelease;
    private List<PayoutResponse> partnerBreakdown;
}
