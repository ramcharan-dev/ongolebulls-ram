package dev.ongolebulls.dto.finance;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CommissionRuleRequest {
    private String amcName;
    private String fundCategory;
    private BigDecimal trailPercent;
    private BigDecimal upfrontPercent;
    private String effectiveFrom;
    private String effectiveTo;
}
