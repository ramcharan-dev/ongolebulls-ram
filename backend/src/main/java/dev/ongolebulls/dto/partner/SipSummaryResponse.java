package dev.ongolebulls.dto.partner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SipSummaryResponse {
    private Long id;
    private String clientName;
    private Long clientId;
    private String fundName;
    private BigDecimal amount;
    private String frequency;
    private String startDate;
    private String nextDueDate;
    private String status;
}
