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
public class TrackerHoldingResponse {
    private Long id;
    private String clientName;
    private Long clientId;
    private String amcName;
    private String fundName;
    private String folioNumber;
    private BigDecimal units;
    private BigDecimal nav;
    private BigDecimal currentValue;
    private LocalDateTime uploadDate;
}
