package dev.ongolebulls.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public class SipSummary {
    public int activeCount;
    public BigDecimal totalMonthly;
    public LocalDate nextSIPDate;
    public int missedCount;
}
