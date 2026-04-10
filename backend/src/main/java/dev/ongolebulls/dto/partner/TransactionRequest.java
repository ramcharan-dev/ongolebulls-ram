package dev.ongolebulls.dto.partner;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionRequest {
    private Long clientId;
    private String type;
    private String schemeName;
    private BigDecimal amount;
    private String notes;
}
