package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SipDetailDto {
    private Long id;
    private String fundName;
    private BigDecimal monthlyAmount;
    private LocalDate startDate;
    private LocalDate nextSIPDate;
    private Boolean active;
    private Integer monthsCompleted;
    private BigDecimal totalInvested;
    private BigDecimal currentValue;
    private Double returnsPercentage;
    private BigDecimal projectedValue; // Projected value at maturity
}


