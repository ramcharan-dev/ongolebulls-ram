package dev.ongolebulls.service;

import dev.ongolebulls.dto.FundRecommendationDto;
import dev.ongolebulls.model.Fund;
import dev.ongolebulls.model.RiskProfile;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.FundRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FundRecommendationService {

    private final FundRepository fundRepository;
    private final UserRepository userRepository;
    private final FundScoringService fundScoringService;

    public List<FundRecommendationDto> getRecommendations(Long userId) {
        List<FundRecommendationDto> recommendations = new ArrayList<>();

        // Get user risk profile
        RiskProfile.RiskCategory userRisk = getUserRiskCategory(userId);

        // Goal-based recommendations
        recommendations.add(getGoalBasedRecommendations(userId));

        // Risk-based recommendations
        recommendations.add(getRiskBasedRecommendations(userId, userRisk));

        // Popular funds
        recommendations.add(getPopularFunds());

        // Top performers
        recommendations.add(getTopPerformers());

        return recommendations;
    }

    private FundRecommendationDto getGoalBasedRecommendations(Long userId) {
        List<Fund> allFunds = fundRepository.findAll();
        
        // Get funds for common goals
        Map<String, List<Fund>> fundsByGoal = allFunds.stream()
                .filter(f -> f.getGoal() != null)
                .collect(Collectors.groupingBy(f -> f.getGoal().name()));

        // Select top funds for each goal
        List<FundRecommendationDto.RecommendedFundDto> recommendedFunds = new ArrayList<>();
        
        for (Map.Entry<String, List<Fund>> entry : fundsByGoal.entrySet()) {
            List<Fund> goalFunds = entry.getValue();
            goalFunds.sort((a, b) -> {
                BigDecimal scoreA = fundScoringService.calculateFundScore(a);
                BigDecimal scoreB = fundScoringService.calculateFundScore(b);
                return scoreB.compareTo(scoreA);
            });
            
            // Take top 2-3 funds per goal
            goalFunds.stream().limit(3).forEach(fund -> {
                recommendedFunds.add(convertToRecommendedFund(fund, 
                    "Recommended for " + entry.getKey().replace("_", " ").toLowerCase() + " goals"));
            });
        }

        // If no goal-based funds, add fallback
        if (recommendedFunds.isEmpty()) {
            recommendedFunds.addAll(getFallbackRecommendations());
        }

        return FundRecommendationDto.builder()
                .recommendationType("GOAL_BASED")
                .title("Goal-Based Recommendations")
                .description("Funds tailored to your financial goals")
                .funds(recommendedFunds.stream().limit(6).collect(Collectors.toList()))
                .build();
    }

    private FundRecommendationDto getRiskBasedRecommendations(Long userId, RiskProfile.RiskCategory userRisk) {
        List<Fund> allFunds = fundRepository.findAll();
        
        // Map risk category to fund risk level
        Fund.RiskLevel targetRisk = mapRiskCategoryToRiskLevel(userRisk);
        
        List<Fund> riskMatchedFunds = allFunds.stream()
                .filter(f -> f.getRisk() == targetRisk || 
                           (userRisk == RiskProfile.RiskCategory.CONSERVATIVE && f.getRisk() == Fund.RiskLevel.LOW) ||
                           (userRisk == RiskProfile.RiskCategory.MODERATE && 
                            (f.getRisk() == Fund.RiskLevel.LOW || f.getRisk() == Fund.RiskLevel.MEDIUM)) ||
                           (userRisk == RiskProfile.RiskCategory.AGGRESSIVE))
                .collect(Collectors.toList());

        // Score and sort
        riskMatchedFunds.sort((a, b) -> {
            BigDecimal scoreA = fundScoringService.calculateFundScore(a);
            BigDecimal scoreB = fundScoringService.calculateFundScore(b);
            return scoreB.compareTo(scoreA);
        });

        List<FundRecommendationDto.RecommendedFundDto> recommendedFunds = riskMatchedFunds.stream()
                .limit(6)
                .map(fund -> convertToRecommendedFund(fund, 
                    "Matches your " + userRisk.name().toLowerCase() + " risk profile"))
                .collect(Collectors.toList());

        // Fallback if empty
        if (recommendedFunds.isEmpty()) {
            recommendedFunds.addAll(getFallbackRecommendations());
        }

        return FundRecommendationDto.builder()
                .recommendationType("RISK_BASED")
                .title("Risk-Based Recommendations")
                .description("Funds aligned with your risk profile")
                .funds(recommendedFunds)
                .build();
    }

    private FundRecommendationDto getPopularFunds() {
        List<Fund> allFunds = fundRepository.findAll();
        
        List<FundRecommendationDto.RecommendedFundDto> popularFunds = allFunds.stream()
                .filter(f -> f.getIsPopular() != null && f.getIsPopular())
                .sorted((a, b) -> {
                    BigDecimal scoreA = fundScoringService.calculateFundScore(a);
                    BigDecimal scoreB = fundScoringService.calculateFundScore(b);
                    return scoreB.compareTo(scoreA);
                })
                .limit(6)
                .map(fund -> convertToRecommendedFund(fund, "Popular choice among investors"))
                .collect(Collectors.toList());

        // Fallback
        if (popularFunds.isEmpty()) {
            popularFunds.addAll(getFallbackRecommendations());
        }

        return FundRecommendationDto.builder()
                .recommendationType("POPULAR")
                .title("Popular Funds")
                .description("Most chosen funds by investors")
                .funds(popularFunds)
                .build();
    }

    private FundRecommendationDto getTopPerformers() {
        List<Fund> allFunds = fundRepository.findAll();
        
        List<FundRecommendationDto.RecommendedFundDto> topPerformers;
        
        if (!allFunds.isEmpty()) {
            topPerformers = allFunds.stream()
                    .sorted((a, b) -> {
                        BigDecimal scoreA = fundScoringService.calculateFundScore(a);
                        BigDecimal scoreB = fundScoringService.calculateFundScore(b);
                        return scoreB.compareTo(scoreA);
                    })
                    .limit(6)
                    .map(fund -> convertToRecommendedFund(fund, "Top performer with high returns"))
                    .collect(Collectors.toList());
        } else {
            // Use mock recommendations if no funds in database
            topPerformers = createMockRecommendations();
        }

        return FundRecommendationDto.builder()
                .recommendationType("TOP_PERFORMERS")
                .title("Top Performers")
                .description("Best performing funds")
                .funds(topPerformers)
                .build();
    }

    private FundRecommendationDto.RecommendedFundDto convertToRecommendedFund(Fund fund, String reason) {
        BigDecimal score = fundScoringService.calculateFundScore(fund);
        
        return FundRecommendationDto.RecommendedFundDto.builder()
                .fundId(fund.getId())
                .fundName(fund.getName())
                .amcName(fund.getAmc() != null ? fund.getAmc().getName() : "N/A")
                .type(fund.getType())
                .risk(fund.getRisk() != null ? fund.getRisk().name() : "MEDIUM")
                .fundScore(score)
                .starRating(calculateStarRating(score))
                .oneYearReturn(getOneYearReturn(fund))
                .nav(getNav(fund))
                .tagline(fund.getTagline() != null ? fund.getTagline() : "Build wealth systematically")
                .recommendationReason(reason)
                .isRecommended(fund.getIsRecommended() != null && fund.getIsRecommended())
                .isPopular(fund.getIsPopular() != null && fund.getIsPopular())
                .build();
    }

    private List<FundRecommendationDto.RecommendedFundDto> getFallbackRecommendations() {
        List<Fund> allFunds = fundRepository.findAll();
        
        // If database has funds, use them
        if (!allFunds.isEmpty()) {
            return allFunds.stream()
                    .limit(6)
                    .map(fund -> convertToRecommendedFund(fund, "Recommended for you"))
                    .collect(Collectors.toList());
        }
        
        // If no funds in database, create mock recommendations
        return createMockRecommendations();
    }
    
    private List<FundRecommendationDto.RecommendedFundDto> createMockRecommendations() {
        List<FundRecommendationDto.RecommendedFundDto> mockFunds = new ArrayList<>();
        
        // Create 6 mock fund recommendations
        String[] fundNames = {
            "HDFC Equity Fund - Direct Growth",
            "ICICI Prudential Bluechip Fund - Direct Growth",
            "SBI Large & Midcap Fund - Direct Growth",
            "Axis Long Term Equity Fund - Direct Growth",
            "Kotak Standard Multicap Fund - Direct Growth",
            "Aditya Birla Sun Life Frontline Equity Fund - Direct Growth"
        };
        
        String[] amcNames = {
            "HDFC Asset Management Company Limited",
            "ICICI Prudential Asset Management Company Limited",
            "SBI Funds Management Private Limited",
            "Axis Asset Management Co. Ltd.",
            "Kotak Mahindra Asset Management Company Limited",
            "Aditya Birla Sun Life AMC Limited"
        };
        
        double[] returns = {18.5, 16.2, 17.8, 19.1, 15.9, 16.7};
        String[] risks = {"HIGH", "MEDIUM", "HIGH", "HIGH", "MEDIUM", "MEDIUM"};
        BigDecimal[] scores = {
            BigDecimal.valueOf(85),
            BigDecimal.valueOf(78),
            BigDecimal.valueOf(82),
            BigDecimal.valueOf(88),
            BigDecimal.valueOf(75),
            BigDecimal.valueOf(80)
        };
        Integer[] ratings = {5, 4, 5, 5, 4, 4};
        String[] taglines = {
            "Long-term wealth creation through equity",
            "Invest in India's leading companies",
            "Balance of large and mid-cap opportunities",
            "Tax-saving with long-term growth",
            "Diversified equity portfolio",
            "Frontline equity opportunities"
        };
        
        for (int i = 0; i < fundNames.length; i++) {
            FundRecommendationDto.RecommendedFundDto fund = FundRecommendationDto.RecommendedFundDto.builder()
                    .fundId((long) (i + 1))
                    .fundName(fundNames[i])
                    .amcName(amcNames[i])
                    .type("Equity")
                    .risk(risks[i])
                    .fundScore(scores[i])
                    .starRating(ratings[i])
                    .oneYearReturn(BigDecimal.valueOf(returns[i]))
                    .nav(BigDecimal.valueOf(100 + (i * 5)))
                    .tagline(taglines[i])
                    .recommendationReason("Top performing fund with consistent returns")
                    .isRecommended(true)
                    .isPopular(i < 3) // First 3 are popular
                    .build();
            mockFunds.add(fund);
        }
        
        return mockFunds;
    }

    private Fund.RiskLevel mapRiskCategoryToRiskLevel(RiskProfile.RiskCategory category) {
        if (category == null) return Fund.RiskLevel.MEDIUM;
        switch (category) {
            case CONSERVATIVE: return Fund.RiskLevel.LOW;
            case MODERATE: return Fund.RiskLevel.MEDIUM;
            case AGGRESSIVE: return Fund.RiskLevel.HIGH;
            default: return Fund.RiskLevel.MEDIUM;
        }
    }

    private RiskProfile.RiskCategory getUserRiskCategory(Long userId) {
        try {
            return userRepository.findById(userId)
                    .map(user -> {
                        Object investorAccount = getField(user, "investorAccount");
                        if (investorAccount != null) {
                            Object riskCategory = getField(investorAccount, "riskCategory");
                            if (riskCategory instanceof RiskProfile.RiskCategory) {
                                return (RiskProfile.RiskCategory) riskCategory;
                            }
                        }
                        return RiskProfile.RiskCategory.MODERATE;
                    })
                    .orElse(RiskProfile.RiskCategory.MODERATE);
        } catch (Exception e) {
            return RiskProfile.RiskCategory.MODERATE;
        }
    }

    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }

    private Integer calculateStarRating(BigDecimal score) {
        if (score == null) return 3;
        if (score.compareTo(BigDecimal.valueOf(80)) >= 0) return 5;
        if (score.compareTo(BigDecimal.valueOf(65)) >= 0) return 4;
        if (score.compareTo(BigDecimal.valueOf(50)) >= 0) return 3;
        if (score.compareTo(BigDecimal.valueOf(35)) >= 0) return 2;
        return 1;
    }

    private BigDecimal getOneYearReturn(Fund fund) {
        // Try to get from plans first, then fallback to legacy fields
        if (fund.getPlans() != null && !fund.getPlans().isEmpty()) {
            return fund.getPlans().get(0).getOneYearReturn();
        }
        if (fund.getReturnsDirect() != null) {
            return BigDecimal.valueOf(fund.getReturnsDirect());
        }
        if (fund.getReturnsRegular() != null) {
            return BigDecimal.valueOf(fund.getReturnsRegular());
        }
        return BigDecimal.ZERO;
    }

    private BigDecimal getNav(Fund fund) {
        if (fund.getPlans() != null && !fund.getPlans().isEmpty()) {
            return fund.getPlans().get(0).getNav();
        }
        if (fund.getNav() != null) {
            return BigDecimal.valueOf(fund.getNav());
        }
        return BigDecimal.ZERO;
    }
}

