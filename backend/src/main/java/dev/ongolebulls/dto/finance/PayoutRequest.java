package dev.ongolebulls.dto.finance;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class PayoutRequest {
    private Long partnerId;
    private String partnerName;
    private String period;
    private BigDecimal grossAmount;
    private BigDecimal gstPercent;
    private BigDecimal tdsPercent;
}
