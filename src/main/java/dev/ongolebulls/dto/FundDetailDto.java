package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FundDetailDto {
    private Long id;
    private String name;
    private String amcName;
    private Long amcId;
    private String type;
    private String risk;
    private String horizon;
    private String goal;
    private String assetType;
    private Integer fundAge;
    private BigDecimal aum;
    private BigDecimal fundSize;
    private String description;
    private String investmentObjective;
    private String fundManager;
    private LocalDate launchDate;
    private BigDecimal fundScore;
    private Integer starRating;
    private Boolean isPopular;
    private Boolean isRecommended;
    private String tagline;

    // Plan details
    private List<PlanDetailDto> plans;

    // Performance metrics
    private PerformanceMetricsDto performance;

    // Risk metrics
    private RiskMetricsDto riskMetrics;

    // Historical NAV data
    private List<NavHistoryDto> navHistory;

    // Comparison with category average
    private ComparisonDto comparison;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PlanDetailDto {
        private Long planId;
        private String planType; // REGULAR or DIRECT
        private String optionType; // GROWTH or DIVIDEND
        private BigDecimal nav;
        private BigDecimal navChange;
        private BigDecimal oneYearReturn;
        private BigDecimal threeYearReturn;
        private BigDecimal fiveYearReturn;
        private BigDecimal sinceInceptionReturn;
        private LocalDate navDate;
        private BigDecimal expenseRatio;
        private BigDecimal minimumInvestment;
        private BigDecimal minimumSipAmount;
        private String amfiCode;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PerformanceMetricsDto {
        private BigDecimal oneYearReturn;
        private BigDecimal threeYearReturn;
        private BigDecimal fiveYearReturn;
        private BigDecimal sinceInceptionReturn;
        private BigDecimal volatility;
        private BigDecimal sharpeRatio;
        private BigDecimal alpha;
        private BigDecimal beta;
        private BigDecimal informationRatio;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RiskMetricsDto {
        private String riskLevel;
        private BigDecimal standardDeviation;
        private BigDecimal downsideDeviation;
        private BigDecimal maxDrawdown;
        private BigDecimal var; // Value at Risk
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NavHistoryDto {
        private LocalDate date;
        private BigDecimal nav;
        private BigDecimal change;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComparisonDto {
        private BigDecimal fundReturn;
        private BigDecimal categoryAverage;
        private BigDecimal benchmarkReturn;
        private String benchmarkName;
    }
}

