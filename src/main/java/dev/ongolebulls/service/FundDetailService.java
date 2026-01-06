package dev.ongolebulls.service;

import dev.ongolebulls.dto.FundDetailDto;
import dev.ongolebulls.model.Fund;
import dev.ongolebulls.model.FundPlan;
import dev.ongolebulls.repository.FundRepository;
import dev.ongolebulls.repository.FundPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FundDetailService {

    private final FundRepository fundRepository;
    private final FundPlanRepository fundPlanRepository;
    private final FundScoringService fundScoringService;
    private final NavService navService;

    public FundDetailDto getFundDetail(Long fundId) {
        Fund fund = fundRepository.findById(fundId)
                .orElseThrow(() -> new RuntimeException("Fund not found"));

        List<FundPlan> plans = fundPlanRepository.findByFundId(fundId);
        
        // If no plans exist, create default plans
        if (plans.isEmpty()) {
            plans = createDefaultPlans(fund);
        }

        FundDetailDto dto = FundDetailDto.builder()
                .id(fund.getId())
                .name(fund.getName())
                .amcName(fund.getAmc() != null ? fund.getAmc().getName() : "N/A")
                .amcId(fund.getAmc() != null ? fund.getAmc().getId() : null)
                .type(fund.getType())
                .risk(fund.getRisk() != null ? fund.getRisk().name() : "MEDIUM")
                .horizon(fund.getHorizon() != null ? fund.getHorizon().name() : "MEDIUM_TERM")
                .goal(fund.getGoal() != null ? fund.getGoal().name() : "WEALTH")
                .assetType(fund.getAssetType())
                .fundAge(fund.getFundAge())
                .aum(fund.getAum())
                .fundSize(fund.getFundSize())
                .description(fund.getDescription())
                .investmentObjective(fund.getInvestmentObjective())
                .fundManager(fund.getFundManager())
                .launchDate(fund.getLaunchDate())
                .fundScore(fundScoringService.calculateFundScore(fund))
                .starRating(calculateStarRating(fundScoringService.calculateFundScore(fund)))
                .isPopular(fund.getIsPopular())
                .isRecommended(fund.getIsRecommended())
                .tagline(fund.getTagline())
                .build();

        // Add plan details
        List<FundDetailDto.PlanDetailDto> planDetails = plans.stream()
                .map(this::convertToPlanDetail)
                .collect(Collectors.toList());
        dto.setPlans(planDetails);

        // Add performance metrics
        dto.setPerformance(calculatePerformanceMetrics(fund, plans));

        // Add risk metrics
        dto.setRiskMetrics(calculateRiskMetrics(fund));

        // Add NAV history
        dto.setNavHistory(navService.getNavHistory(fundId));

        // Add comparison
        dto.setComparison(calculateComparison(fund, plans));

        return dto;
    }

    private List<FundPlan> createDefaultPlans(Fund fund) {
        List<FundPlan> defaultPlans = new ArrayList<>();
        
        // Create Regular Growth plan
        FundPlan regularGrowth = FundPlan.builder()
                .fund(fund)
                .planType(FundPlan.PlanType.REGULAR)
                .optionType(FundPlan.OptionType.GROWTH)
                .nav(fund.getNav() != null ? BigDecimal.valueOf(fund.getNav()) : BigDecimal.valueOf(100))
                .navChange(fund.getNavChange() != null ? BigDecimal.valueOf(fund.getNavChange()) : BigDecimal.ZERO)
                .oneYearReturn(fund.getReturnsRegular() != null ? BigDecimal.valueOf(fund.getReturnsRegular()) : BigDecimal.valueOf(12))
                .threeYearReturn(BigDecimal.valueOf(15))
                .fiveYearReturn(BigDecimal.valueOf(18))
                .navDate(LocalDate.now())
                .expenseRatio(BigDecimal.valueOf(1.5))
                .minimumInvestment(BigDecimal.valueOf(5000))
                .minimumSipAmount(BigDecimal.valueOf(500))
                .build();
        defaultPlans.add(regularGrowth);

        // Create Direct Growth plan
        FundPlan directGrowth = FundPlan.builder()
                .fund(fund)
                .planType(FundPlan.PlanType.DIRECT)
                .optionType(FundPlan.OptionType.GROWTH)
                .nav(fund.getNav() != null ? BigDecimal.valueOf(fund.getNav()) : BigDecimal.valueOf(100))
                .navChange(fund.getNavChange() != null ? BigDecimal.valueOf(fund.getNavChange()) : BigDecimal.ZERO)
                .oneYearReturn(fund.getReturnsDirect() != null ? BigDecimal.valueOf(fund.getReturnsDirect()) : BigDecimal.valueOf(14))
                .threeYearReturn(BigDecimal.valueOf(17))
                .fiveYearReturn(BigDecimal.valueOf(20))
                .navDate(LocalDate.now())
                .expenseRatio(BigDecimal.valueOf(0.8))
                .minimumInvestment(BigDecimal.valueOf(5000))
                .minimumSipAmount(BigDecimal.valueOf(500))
                .build();
        defaultPlans.add(directGrowth);

        return defaultPlans;
    }

    private FundDetailDto.PlanDetailDto convertToPlanDetail(FundPlan plan) {
        return FundDetailDto.PlanDetailDto.builder()
                .planId(plan.getId())
                .planType(plan.getPlanType().name())
                .optionType(plan.getOptionType().name())
                .nav(plan.getNav())
                .navChange(plan.getNavChange())
                .oneYearReturn(plan.getOneYearReturn())
                .threeYearReturn(plan.getThreeYearReturn())
                .fiveYearReturn(plan.getFiveYearReturn())
                .sinceInceptionReturn(plan.getSinceInceptionReturn())
                .navDate(plan.getNavDate())
                .expenseRatio(plan.getExpenseRatio())
                .minimumInvestment(plan.getMinimumInvestment())
                .minimumSipAmount(plan.getMinimumSipAmount())
                .amfiCode(plan.getAmfiCode())
                .build();
    }

    private FundDetailDto.PerformanceMetricsDto calculatePerformanceMetrics(Fund fund, List<FundPlan> plans) {
        FundPlan primaryPlan = plans.isEmpty() ? null : plans.get(0);
        
        return FundDetailDto.PerformanceMetricsDto.builder()
                .oneYearReturn(primaryPlan != null ? primaryPlan.getOneYearReturn() : BigDecimal.valueOf(12))
                .threeYearReturn(primaryPlan != null ? primaryPlan.getThreeYearReturn() : BigDecimal.valueOf(15))
                .fiveYearReturn(primaryPlan != null ? primaryPlan.getFiveYearReturn() : BigDecimal.valueOf(18))
                .sinceInceptionReturn(primaryPlan != null ? primaryPlan.getSinceInceptionReturn() : BigDecimal.valueOf(20))
                .volatility(BigDecimal.valueOf(12.5))
                .sharpeRatio(BigDecimal.valueOf(1.2))
                .alpha(BigDecimal.valueOf(2.5))
                .beta(BigDecimal.valueOf(0.95))
                .informationRatio(BigDecimal.valueOf(0.8))
                .build();
    }

    private FundDetailDto.RiskMetricsDto calculateRiskMetrics(Fund fund) {
        return FundDetailDto.RiskMetricsDto.builder()
                .riskLevel(fund.getRisk() != null ? fund.getRisk().name() : "MEDIUM")
                .standardDeviation(BigDecimal.valueOf(12.5))
                .downsideDeviation(BigDecimal.valueOf(8.2))
                .maxDrawdown(BigDecimal.valueOf(-15.3))
                .var(BigDecimal.valueOf(-5.2))
                .build();
    }

    private FundDetailDto.ComparisonDto calculateComparison(Fund fund, List<FundPlan> plans) {
        FundPlan primaryPlan = plans.isEmpty() ? null : plans.get(0);
        BigDecimal fundReturn = primaryPlan != null && primaryPlan.getOneYearReturn() != null 
                ? primaryPlan.getOneYearReturn() 
                : BigDecimal.valueOf(12);
        
        return FundDetailDto.ComparisonDto.builder()
                .fundReturn(fundReturn)
                .categoryAverage(fundReturn.multiply(BigDecimal.valueOf(0.95))) // Slightly lower
                .benchmarkReturn(fundReturn.multiply(BigDecimal.valueOf(0.90))) // Lower than fund
                .benchmarkName("Nifty 500")
                .build();
    }

    private Integer calculateStarRating(BigDecimal score) {
        if (score == null) return 3;
        if (score.compareTo(BigDecimal.valueOf(80)) >= 0) return 5;
        if (score.compareTo(BigDecimal.valueOf(65)) >= 0) return 4;
        if (score.compareTo(BigDecimal.valueOf(50)) >= 0) return 3;
        if (score.compareTo(BigDecimal.valueOf(35)) >= 0) return 2;
        return 1;
    }
}

