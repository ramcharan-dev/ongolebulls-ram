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
public class CommissionRuleResponse {
    private Long id;
    private String amcName;
    private String fundCategory;
    private BigDecimal trailPercent;
    private BigDecimal upfrontPercent;
    private LocalDate effectiveFrom;
    private LocalDate effectiveTo;
    private boolean isActive;
    private Long createdBy;
    private LocalDateTime createdAt;
}
