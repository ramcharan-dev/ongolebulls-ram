package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class SipSummaryDto {

    private Integer activeCount = 0;
    private Double totalMonthly = 0.0;
    private String nextSIPDate = null;
    private Integer missedCount = 0;
}
