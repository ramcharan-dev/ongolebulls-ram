package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "sip_installments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SIPInstallment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private Long sipId; // Reference to SIPRequest.id
    private Long userId;
    private String fundName;
    private BigDecimal amount; // Investment amount
    private BigDecimal nav; // NAV at time of investment
    private BigDecimal units; // Units allotted
    private LocalDate installmentDate; // Scheduled date
    private LocalDate executedDate; // Actual execution date
    private String status; // EXECUTED, PENDING, FAILED, MISSED
    private String failureReason; // If status is FAILED
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}

