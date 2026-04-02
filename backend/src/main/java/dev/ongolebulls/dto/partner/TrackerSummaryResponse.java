package dev.ongolebulls.dto.partner;

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
public class TrackerSummaryResponse {
    private List<TrackerHoldingResponse> holdings;
    private BigDecimal totalValue;
    private long folioCount;
    private long amcCount;
}
