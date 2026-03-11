package dev.ongolebulls.controller;

import dev.ongolebulls.dto.FundExploreDto;
import dev.ongolebulls.model.Fund;
import dev.ongolebulls.repository.FundRepository;
import dev.ongolebulls.repository.FundSuggestionRepo;
import dev.ongolebulls.model.FundSuggestion;
import dev.ongolebulls.model.RiskProfile;
import dev.ongolebulls.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/explore")
public class ExploreFundsController {

    private final FundRepository fundRepository;
    private final FundSuggestionRepo fundSuggestionRepo;
    private final UserRepository userRepository;

    public ExploreFundsController(
            FundRepository fundRepository,
            FundSuggestionRepo fundSuggestionRepo,
            UserRepository userRepository) {
        this.fundRepository = fundRepository;
        this.fundSuggestionRepo = fundSuggestionRepo;
        this.userRepository = userRepository;
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

    @GetMapping("/funds/{userId}")
    public ResponseEntity<List<FundExploreDto>> getFunds(
            @PathVariable Long userId,
            @RequestParam(required = false) String goal,
            @RequestParam(required = false) String risk,
            @RequestParam(required = false) String horizon,
            @RequestParam(required = false) String assetType) {
        try {
            List<String> risks = risk != null ? Collections.singletonList(risk) : null;
            List<String> horizons = horizon != null ? Collections.singletonList(horizon) : null;
            List<String> goals = goal != null ? Collections.singletonList(goal) : null;
            List<String> assets = assetType != null ? Collections.singletonList(assetType) : null;

            List<Fund> funds = fundRepository.filterFunds(risks, horizons, goals, assets);
            
            // If no funds found, get suggestions based on user risk profile
            if (funds.isEmpty()) {
                RiskProfile.RiskCategory userRisk = getUserRiskCategory(userId);
                List<FundSuggestion> suggestions = fundSuggestionRepo.findTop6BySuitedForOrderByOneYearReturnPercentDesc(userRisk);
                return ResponseEntity.ok(convertSuggestionsToDto(suggestions));
            }

            return ResponseEntity.ok(convertFundsToDto(funds));
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @GetMapping("/goals/{userId}")
    public ResponseEntity<Map<String, List<FundExploreDto>>> getFundsByGoals(@PathVariable Long userId) {
        try {
            Map<String, List<FundExploreDto>> result = new HashMap<>();
            
            String[] goals = {"WEALTH", "TAX_SAVING", "SHORT_TERM", "RETIREMENT"};
            for (String goal : goals) {
                List<Fund> funds = fundRepository.filterFunds(null, null, Collections.singletonList(goal), null);
                result.put(goal, convertFundsToDto(funds));
            }
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyMap());
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

    private List<FundExploreDto> convertFundsToDto(List<Fund> funds) {
        return funds.stream().map(fund -> {
            FundExploreDto dto = new FundExploreDto();
            setField(dto, "id", fund.getId());
            setField(dto, "name", fund.getName());
            setField(dto, "type", fund.getType());
            setField(dto, "returnsRegular", fund.getReturnsRegular());
            setField(dto, "returnsDirect", fund.getReturnsDirect());
            setField(dto, "nav", fund.getNav());
            setField(dto, "navChange", fund.getNavChange());
            setField(dto, "risk", fund.getRisk());
            setField(dto, "horizon", fund.getHorizon());
            setField(dto, "goal", fund.getGoal());
            setField(dto, "assetType", fund.getAssetType());
            setField(dto, "fundAge", fund.getFundAge());
            setField(dto, "isPopular", Math.random() > 0.7); // Random popular flag
            setField(dto, "tagline", generateTagline(fund.getGoal()));
            return dto;
        }).collect(Collectors.toList());
    }

    private List<FundExploreDto> convertSuggestionsToDto(List<FundSuggestion> suggestions) {
        return suggestions.stream().map(suggestion -> {
            FundExploreDto dto = new FundExploreDto();
            setField(dto, "id", suggestion.getId());
            setField(dto, "name", suggestion.getFundName());
            setField(dto, "returnsRegular", suggestion.getOneYearReturnPercent() != null ? suggestion.getOneYearReturnPercent().doubleValue() : 0.0);
            setField(dto, "risk", mapRiskCategory(suggestion.getSuitedFor()));
            setField(dto, "tagline", suggestion.getTagline());
            setField(dto, "isPopular", true);
            return dto;
        }).collect(Collectors.toList());
    }

    private String mapRiskCategory(RiskProfile.RiskCategory category) {
        if (category == null) return "MEDIUM";
        switch (category) {
            case CONSERVATIVE: return "LOW";
            case MODERATE: return "MEDIUM";
            case AGGRESSIVE: return "HIGH";
            default: return "MEDIUM";
        }
    }

    private String generateTagline(String goal) {
        if (goal == null) return "Build wealth systematically";
        switch (goal.toUpperCase()) {
            case "WEALTH": return "Grow your wealth over time";
            case "TAX_SAVING": return "Save tax while building wealth";
            case "SHORT_TERM": return "Short-term wealth creation";
            case "RETIREMENT": return "Secure your retirement";
            default: return "Build wealth systematically";
        }
    }

    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore
        }
    }
}


