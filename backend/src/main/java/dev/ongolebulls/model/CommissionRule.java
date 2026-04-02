package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "commission_rules")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CommissionRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "amc_name", nullable = false)
    private String amcName;

    @Enumerated(EnumType.STRING)
    @Column(name = "fund_category", nullable = false)
    private FundCategory fundCategory;

    @Column(name = "trail_percent", precision = 5, scale = 2)
    private BigDecimal trailPercent;

    @Column(name = "upfront_percent", precision = 5, scale = 2)
    private BigDecimal upfrontPercent;

    @Column(name = "effective_from", nullable = false)
    private LocalDate effectiveFrom;

    @Column(name = "effective_to")
    private LocalDate effectiveTo;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "created_by")
    private Long createdBy;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public enum FundCategory {
        EQUITY, DEBT, HYBRID, LIQUID
    }
}
