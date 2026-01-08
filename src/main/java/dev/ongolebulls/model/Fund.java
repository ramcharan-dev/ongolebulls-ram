package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "funds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "amc_id")
    private AMC amc;

    @Column(nullable = false)
    private String type; // Equity, Debt, Hybrid, etc.

    @Enumerated(EnumType.STRING)
    private RiskLevel risk; // LOW, MEDIUM, HIGH

    @Enumerated(EnumType.STRING)
    private InvestmentHorizon horizon; // SHORT_TERM, MEDIUM_TERM, LONG_TERM

    @Enumerated(EnumType.STRING)
    private InvestmentGoal goal; // WEALTH, TAX_SAVING, RETIREMENT, SHORT_TERM

    @Column(nullable = false)
    private String assetType; // Mutual Fund, Equity, Debt, etc.

    private Integer fundAge; // Fund age in years

    @Column(precision = 10, scale = 2)
    private BigDecimal aum; // Assets Under Management

    @Column(precision = 10, scale = 2)
    private BigDecimal fundSize; // Fund size in crores

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String investmentObjective;

    @Column(columnDefinition = "TEXT")
    private String fundManager;

    private LocalDate launchDate;

    @Column(precision = 5, scale = 2)
    private BigDecimal fundScore; // Overall fund score (0-100)

    private Integer starRating; // 1-5 star rating

    private Boolean isPopular; // Popular fund flag

    private Boolean isRecommended; // Recommended fund flag

    @Column(columnDefinition = "TEXT")
    private String tagline;

    @OneToMany(mappedBy = "fund", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<FundPlan> plans;

    // Legacy fields for backward compatibility
    @Deprecated
    private Double returnsRegular;

    @Deprecated
    private Double returnsDirect;

    @Deprecated
    private Double nav;

    @Deprecated
    private Double navChange;

    public enum RiskLevel {
        LOW, MEDIUM, HIGH
    }

    public enum InvestmentHorizon {
        SHORT_TERM, MEDIUM_TERM, LONG_TERM
    }

    public enum InvestmentGoal {
        WEALTH, TAX_SAVING, RETIREMENT, SHORT_TERM, EDUCATION, HOUSE, VACATION
    }
}
