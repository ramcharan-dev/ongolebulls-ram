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
public class PartnerTaxEntry {
    private String partnerName;
    private String pan;
    private String period;
    private BigDecimal grossAmount;
    private BigDecimal rate;
    private BigDecimal amount;
    private String status;
}
