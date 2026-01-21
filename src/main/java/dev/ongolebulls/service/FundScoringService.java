package dev.ongolebulls.service;

import dev.ongolebulls.model.Fund;
import dev.ongolebulls.model.FundPlan;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
public class FundScoringService {

    public BigDecimal calculateFundScore(Fund fund) {
        if (fund == null) return BigDecimal.ZERO;

        BigDecimal score = BigDecimal.ZERO;
        int factors = 0;

        // Factor 1: Returns (40% weight)
        BigDecimal returnsScore = calculateReturnsScore(fund);
        if (returnsScore.compareTo(BigDecimal.ZERO) > 0) {
            score = score.add(returnsScore.multiply(BigDecimal.valueOf(0.4)));
            factors++;
        }

        // Factor 2: Fund Age & Stability (20% weight)
        BigDecimal stabilityScore = calculateStabilityScore(fund);
        if (stabilityScore.compareTo(BigDecimal.ZERO) > 0) {
            score = score.add(stabilityScore.multiply(BigDecimal.valueOf(0.2)));
            factors++;
        }

        // Factor 3: AUM & Fund Size (15% weight)
        BigDecimal sizeScore = calculateSizeScore(fund);
        if (sizeScore.compareTo(BigDecimal.ZERO) > 0) {
            score = score.add(sizeScore.multiply(BigDecimal.valueOf(0.15)));
            factors++;
        }

        // Factor 4: Risk-Adjusted Returns (15% weight)
        BigDecimal riskAdjustedScore = calculateRiskAdjustedScore(fund);
        if (riskAdjustedScore.compareTo(BigDecimal.ZERO) > 0) {
            score = score.add(riskAdjustedScore.multiply(BigDecimal.valueOf(0.15)));
            factors++;
        }

        // Factor 5: Popularity & Recommendations (10% weight)
        BigDecimal popularityScore = calculatePopularityScore(fund);
        if (popularityScore.compareTo(BigDecimal.ZERO) > 0) {
            score = score.add(popularityScore.multiply(BigDecimal.valueOf(0.1)));
            factors++;
        }

        // Normalize if factors were used
        if (factors > 0) {
            return score.setScale(2, RoundingMode.HALF_UP);
        }

        // Default score based on available data
        return BigDecimal.valueOf(50).setScale(2, RoundingMode.HALF_UP);
    }

    private BigDecimal calculateReturnsScore(Fund fund) {
        BigDecimal oneYearReturn = getOneYearReturn(fund);
        BigDecimal threeYearReturn = getThreeYearReturn(fund);
        BigDecimal fiveYearReturn = getFiveYearReturn(fund);

        BigDecimal score = BigDecimal.ZERO;

        // One year return (30% weight)
        if (oneYearReturn != null && oneYearReturn.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal normalized = oneYearReturn.min(BigDecimal.valueOf(50)); // Cap at 50%
            score = score.add(normalized.multiply(BigDecimal.valueOf(0.3)));
        }

        // Three year return (40% weight)
        if (threeYearReturn != null && threeYearReturn.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal normalized = threeYearReturn.min(BigDecimal.valueOf(40)); // Cap at 40%
            score = score.add(normalized.multiply(BigDecimal.valueOf(0.4)));
        }

        // Five year return (30% weight)
        if (fiveYearReturn != null && fiveYearReturn.compareTo(BigDecimal.valueOf(0)) > 0) {
            BigDecimal normalized = fiveYearReturn.min(BigDecimal.valueOf(35)); // Cap at 35%
            score = score.add(normalized.multiply(BigDecimal.valueOf(0.3)));
        }

        return score.min(BigDecimal.valueOf(100));
    }

    private BigDecimal calculateStabilityScore(Fund fund) {
        BigDecimal score = BigDecimal.valueOf(50); // Base score

        // Fund age bonus
        if (fund.getFundAge() != null) {
            if (fund.getFundAge() >= 10) {
                score = score.add(BigDecimal.valueOf(30));
            } else if (fund.getFundAge() >= 5) {
                score = score.add(BigDecimal.valueOf(20));
            } else if (fund.getFundAge() >= 3) {
                score = score.add(BigDecimal.valueOf(10));
            }
        }

        return score.min(BigDecimal.valueOf(100));
    }

    private BigDecimal calculateSizeScore(Fund fund) {
        BigDecimal score = BigDecimal.valueOf(50); // Base score

        if (fund.getAum() != null) {
            // AUM in crores
            if (fund.getAum().compareTo(BigDecimal.valueOf(10000)) >= 0) {
                score = score.add(BigDecimal.valueOf(30));
            } else if (fund.getAum().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                score = score.add(BigDecimal.valueOf(20));
            } else if (fund.getAum().compareTo(BigDecimal.valueOf(1000)) >= 0) {
                score = score.add(BigDecimal.valueOf(10));
            }
        } else if (fund.getFundSize() != null) {
            if (fund.getFundSize().compareTo(BigDecimal.valueOf(10000)) >= 0) {
                score = score.add(BigDecimal.valueOf(30));
            } else if (fund.getFundSize().compareTo(BigDecimal.valueOf(5000)) >= 0) {
                score = score.add(BigDecimal.valueOf(20));
            } else if (fund.getFundSize().compareTo(BigDecimal.valueOf(1000)) >= 0) {
                score = score.add(BigDecimal.valueOf(10));
            }
        }

        return score.min(BigDecimal.valueOf(100));
    }

    private BigDecimal calculateRiskAdjustedScore(Fund fund) {
        BigDecimal score = BigDecimal.valueOf(50); // Base score

        // Lower risk gets higher score
        if (fund.getRisk() != null) {
            switch (fund.getRisk()) {
                case LOW:
                    score = score.add(BigDecimal.valueOf(30));
                    break;
                case MEDIUM:
                    score = score.add(BigDecimal.valueOf(20));
                    break;
                case HIGH:
                    score = score.add(BigDecimal.valueOf(10));
                    break;
            }
        }

        return score.min(BigDecimal.valueOf(100));
    }

    private BigDecimal calculatePopularityScore(Fund fund) {
        BigDecimal score = BigDecimal.valueOf(50); // Base score

        if (Boolean.TRUE.equals(fund.getIsPopular())) {
            score = score.add(BigDecimal.valueOf(30));
        }

        if (Boolean.TRUE.equals(fund.getIsRecommended())) {
            score = score.add(BigDecimal.valueOf(20));
        }

        return score.min(BigDecimal.valueOf(100));
    }

    private BigDecimal getOneYearReturn(Fund fund) {
        if (fund.getPlans() != null && !fund.getPlans().isEmpty()) {
            FundPlan plan = fund.getPlans().get(0);
            if (plan.getOneYearReturn() != null) {
                return plan.getOneYearReturn();
            }
        }
        if (fund.getReturnsDirect() != null) {
            return BigDecimal.valueOf(fund.getReturnsDirect());
        }
        if (fund.getReturnsRegular() != null) {
            return BigDecimal.valueOf(fund.getReturnsRegular());
        }
        return null;
    }

    private BigDecimal getThreeYearReturn(Fund fund) {
        if (fund.getPlans() != null && !fund.getPlans().isEmpty()) {
            FundPlan plan = fund.getPlans().get(0);
            if (plan.getThreeYearReturn() != null) {
                return plan.getThreeYearReturn();
            }
        }
        return null;
    }

    private BigDecimal getFiveYearReturn(Fund fund) {
        if (fund.getPlans() != null && !fund.getPlans().isEmpty()) {
            FundPlan plan = fund.getPlans().get(0);
            if (plan.getFiveYearReturn() != null) {
                return plan.getFiveYearReturn();
            }
        }
        return null;
    }
}

