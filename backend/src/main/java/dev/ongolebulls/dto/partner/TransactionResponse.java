package dev.ongolebulls.dto.partner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionResponse {
    private Long id;
    private Long clientId;
    private String clientName;
    private String type;
    private String schemeName;
    private BigDecimal amount;
    private String status;
    private String notes;
    private LocalDateTime createdAt;
}
