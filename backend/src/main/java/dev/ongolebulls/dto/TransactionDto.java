package dev.ongolebulls.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionDto {
    private Long id;
    private String transactionId;
    private LocalDateTime transactionDate;
    private String type; // BUY, SELL, SIP, DIVIDEND, etc.
    private String schemeName;
    private String schemeCode;
    private BigDecimal amount;
    private BigDecimal units;
    private BigDecimal nav;
    private String status; // COMPLETED, PENDING, FAILED
    private String transactionMode; // UPI, NEFT, IMPS, etc.
}