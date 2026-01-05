package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

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
    private String status; // ACTIVE, PAUSED, STOPPED, COMPLETED
    private String frequency; // MONTHLY, QUARTERLY, WEEKLY
    private Boolean isPerpetual;
    private Integer tenureMonths;
    private Double stepUpAmount;
    private Integer stepUpFrequencyMonths;
    private LocalDate lastStepUpDate;
    private String mandateStatus; // PENDING, REGISTERED, ACTIVE, FAILED, CANCELLED
    private String mandateId;
    private Long goalId;
    private String goalName;
    private Integer monthsCompleted;
    private Integer totalInstallments;
    private Integer missedInstallments;
    private BigDecimal totalInvested;
    private BigDecimal currentValue;
    private Double returnsPercentage;
    private Double xirr; // Extended Internal Rate of Return
    private BigDecimal projectedValue;
    private List<SipInstallmentDto> recentInstallments; // Last 5-10 installments
    private LocalDate pausedDate;
    private LocalDate stoppedDate;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SipInstallmentDto {
        private Long id;
        private BigDecimal amount;
        private BigDecimal nav;
        private BigDecimal units;
        private LocalDate installmentDate;
        private LocalDate executedDate;
        private String status;
        private String failureReason;
    }
}


