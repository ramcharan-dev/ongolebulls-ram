package dev.ongolebulls.dto.finance;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PayoutResponse {
    private Long id;
    private Long partnerId;
    private String partnerName;
    private String period;
    private BigDecimal grossAmount;
    private BigDecimal gst;
    private BigDecimal tds;
    private BigDecimal netAmount;
    private String status;
    private LocalDate payoutDate;
    private Long releasedBy;
    private String releasedByName;
    private String disputeReason;
    private LocalDateTime createdAt;
}
