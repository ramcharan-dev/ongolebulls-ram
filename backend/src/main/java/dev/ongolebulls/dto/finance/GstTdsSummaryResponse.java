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
public class GstTdsSummaryResponse {
    private String period;
    private BigDecimal totalGst;
    private BigDecimal totalTds;
    private List<PartnerTaxEntry> gstEntries;
    private List<PartnerTaxEntry> tdsEntries;
}
