package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FundRecommendationDto {
    private String recommendationType; // GOAL_BASED, RISK_BASED, POPULAR, TOP_PERFORMERS
    private String title;
    private String description;
    private List<RecommendedFundDto> funds;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecommendedFundDto {
        private Long fundId;
        private String fundName;
        private String amcName;
        private String type;
        private String risk;
        private BigDecimal fundScore;
        private Integer starRating;
        private BigDecimal oneYearReturn;
        private BigDecimal nav;
        private String tagline;
        private String recommendationReason; // Why this fund is recommended
        private Boolean isRecommended;
        private Boolean isPopular;
    }
}

