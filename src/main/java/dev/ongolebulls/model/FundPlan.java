package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fund_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FundPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_id", nullable = false)
    private Fund fund;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanType planType; // REGULAR or DIRECT

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private OptionType optionType; // GROWTH or DIVIDEND

    @Column(precision = 10, scale = 4)
    private BigDecimal nav; // Net Asset Value

    @Column(precision = 10, scale = 4)
    private BigDecimal navChange; // NAV change percentage

    @Column(precision = 10, scale = 2)
    private BigDecimal oneYearReturn;

    @Column(precision = 10, scale = 2)
    private BigDecimal threeYearReturn;

    @Column(precision = 10, scale = 2)
    private BigDecimal fiveYearReturn;

    @Column(precision = 10, scale = 2)
    private BigDecimal sinceInceptionReturn;

    private LocalDate navDate; // Last NAV update date

    private BigDecimal expenseRatio; // Expense ratio percentage

    private BigDecimal minimumInvestment; // Minimum investment amount

    private BigDecimal minimumSipAmount; // Minimum SIP amount

    @Column(columnDefinition = "TEXT")
    private String amfiCode; // AMFI code for this plan

    public enum PlanType {
        REGULAR, DIRECT
    }

    public enum OptionType {
        GROWTH, DIVIDEND
    }
}

