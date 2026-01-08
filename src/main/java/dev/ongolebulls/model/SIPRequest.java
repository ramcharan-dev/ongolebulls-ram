package dev.ongolebulls.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Entity
@Table(name = "sip_requests")
@Data @NoArgsConstructor @AllArgsConstructor
public class SIPRequest {

        @Id @GeneratedValue
        private Long id;
        private Long userId;
        private String fundName;
        private Double amount;
        private String frequency; // MONTHLY, QUARTERLY, WEEKLY
        private LocalDate startDate;
        private LocalDate nextSIPDate;
        private String status = "ACTIVE"; // ACTIVE, PAUSED, STOPPED, COMPLETED
        private Boolean isPerpetual = true; // true = perpetual, false = fixed tenure
        private Integer tenureMonths; // Required if isPerpetual = false
        private Double stepUpAmount; // Step-up amount (optional)
        private Integer stepUpFrequencyMonths; // Step-up every N months (optional)
        private String mandateStatus = "PENDING"; // PENDING, REGISTERED, ACTIVE, FAILED, CANCELLED
        private String mandateId; // E-mandate ID from bank
        private Long goalId; // Linked goal ID (optional)
        private String goalName; // Goal name for quick reference
        private LocalDate lastStepUpDate; // Last step-up date
        private Integer totalInstallments = 0; // Total installments executed
        private Integer missedInstallments = 0; // Missed installments count
        private LocalDate pausedDate; // Date when paused
        private LocalDate stoppedDate; // Date when stopped
    }

