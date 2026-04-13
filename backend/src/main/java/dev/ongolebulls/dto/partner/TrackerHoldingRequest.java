package dev.ongolebulls.dto.partner;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TrackerHoldingRequest {
    private String clientName;
    private Long clientId;
    private String amcName;
    private String fundName;
    private String folioNumber;
    private BigDecimal units;
    private BigDecimal nav;
    private BigDecimal currentValue;
}
