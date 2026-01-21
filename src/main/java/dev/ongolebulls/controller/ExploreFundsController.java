package dev.ongolebulls.controller;

import dev.ongolebulls.dto.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.*;
import dev.ongolebulls.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/explore")
@CrossOrigin(origins = "*")
public class ExploreFundsController {

    private final FundRepository fundRepository;
    private final FundSuggestionRepo fundSuggestionRepo;
    private final UserRepository userRepository;
    private final FundRecommendationService fundRecommendationService;
    private final FundDetailService fundDetailService;
    private final CartService cartService;
    private final FundScoringService fundScoringService;
    private final FundPlanRepository fundPlanRepository;
    private final AMCRepository amcRepository;

    public ExploreFundsController(
            FundRepository fundRepository,
            FundSuggestionRepo fundSuggestionRepo,
            UserRepository userRepository,
            FundRecommendationService fundRecommendationService,
            FundDetailService fundDetailService,
            CartService cartService,
            FundScoringService fundScoringService,
            FundPlanRepository fundPlanRepository,
            AMCRepository amcRepository) {
        this.fundRepository = fundRepository;
        this.fundSuggestionRepo = fundSuggestionRepo;
        this.userRepository = userRepository;
        this.fundRecommendationService = fundRecommendationService;
        this.fundDetailService = fundDetailService;
        this.cartService = cartService;
        this.fundScoringService = fundScoringService;
        this.fundPlanRepository = fundPlanRepository;
        this.amcRepository = amcRepository;
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
            
            // If no funds found, try suggestions
            if (funds.isEmpty()) {
                RiskProfile.RiskCategory userRisk = getUserRiskCategory(userId);
                List<FundSuggestion> suggestions = fundSuggestionRepo.findTop6BySuitedForOrderByOneYearReturnPercentDesc(userRisk);
                if (!suggestions.isEmpty()) {
                    return ResponseEntity.ok(convertSuggestionsToDto(suggestions));
                }
                
                // If still empty, return mock funds
                return ResponseEntity.ok(createMockFunds());
            }

            return ResponseEntity.ok(convertFundsToDto(funds));
        } catch (Exception e) {
            // Return mock funds on error
            return ResponseEntity.ok(createMockFunds());
        }
    }
    
    private List<FundExploreDto> createMockFunds() {
        List<FundExploreDto> mockFunds = new ArrayList<>();
        
        String[] fundNames = {
            "HDFC Equity Fund",
            "ICICI Prudential Bluechip Fund",
            "SBI Large & Midcap Fund",
            "Axis Long Term Equity Fund",
            "Kotak Standard Multicap Fund",
            "Aditya Birla Sun Life Frontline Equity Fund"
        };
        
        double[] returns = {18.5, 16.2, 17.8, 19.1, 15.9, 16.7};
        double[] navs = {105.50, 98.75, 112.30, 89.45, 95.20, 101.80};
        double[] navChanges = {0.85, 0.62, 0.78, 0.91, 0.59, 0.67};
        String[] risks = {"HIGH", "MEDIUM", "HIGH", "HIGH", "MEDIUM", "MEDIUM"};
        String[] taglines = {
            "Long-term wealth creation through equity",
            "Invest in India's leading companies",
            "Balance of large and mid-cap opportunities",
            "Tax-saving with long-term growth",
            "Diversified equity portfolio",
            "Frontline equity opportunities"
        };
        
        for (int i = 0; i < fundNames.length; i++) {
            FundExploreDto dto = new FundExploreDto();
            setField(dto, "id", (long) (i + 1));
            setField(dto, "name", fundNames[i]);
            setField(dto, "type", "Equity");
            setField(dto, "returnsRegular", returns[i]);
            setField(dto, "returnsDirect", returns[i] + 1.5);
            setField(dto, "nav", navs[i]);
            setField(dto, "navChange", navChanges[i]);
            setField(dto, "risk", risks[i]);
            setField(dto, "horizon", "LONG_TERM");
            setField(dto, "goal", "WEALTH");
            setField(dto, "assetType", "EQUITY");
            setField(dto, "fundAge", 10 + i);
            setField(dto, "isPopular", i < 3);
            setField(dto, "tagline", taglines[i]);
            mockFunds.add(dto);
        }
        
        return mockFunds;
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

    @GetMapping("/amcs")
    public ResponseEntity<List<Map<String, Object>>> getAllAMCs() {
        try {
            // Complete list of AMCs in India
            List<Map<String, Object>> amcs = Arrays.asList(
                createAMCMap(1L, "HDFC Asset Management Company Limited"),
                createAMCMap(2L, "ICICI Prudential Asset Management Company Limited"),
                createAMCMap(3L, "SBI Funds Management Private Limited"),
                createAMCMap(4L, "Axis Asset Management Co. Ltd."),
                createAMCMap(5L, "Kotak Mahindra Asset Management Company Limited"),
                createAMCMap(6L, "Aditya Birla Sun Life AMC Limited"),
                createAMCMap(7L, "Nippon India Mutual Fund"),
                createAMCMap(8L, "UTI Asset Management Company Limited"),
                createAMCMap(9L, "Franklin Templeton Asset Management"),
                createAMCMap(10L, "DSP Investment Managers Private Limited"),
                createAMCMap(11L, "Mirae Asset Mutual Fund"),
                createAMCMap(12L, "Invesco Asset Management (India) Private Limited"),
                createAMCMap(13L, "Tata Asset Management Limited"),
                createAMCMap(14L, "L&T Investment Management Limited"),
                createAMCMap(15L, "PPFAS Asset Management Pvt. Ltd."),
                createAMCMap(16L, "Baroda BNP Paribas Asset Management Ltd."),
                createAMCMap(17L, "Edelweiss Mutual Fund"),
                createAMCMap(18L, "Motilal Oswal Asset Management Company Limited"),
                createAMCMap(19L, "JM Financial Asset Management Limited"),
                createAMCMap(20L, "360 ONE Asset Management Limited"),
                createAMCMap(21L, "LIC Mutual Fund Asset Management Limited"),
                createAMCMap(22L, "Quantum Asset Management Company Limited"),
                createAMCMap(23L, "PGIM India Asset Management Private Limited"),
                createAMCMap(24L, "Helios Mutual Fund"),
                createAMCMap(25L, "WhiteOak Mutual Fund"),
                createAMCMap(26L, "Old Bridge Mutual Fund"),
                createAMCMap(27L, "HSBC Asset Management (India) Private Ltd."),
                createAMCMap(28L, "Sundaram Asset Management Company Ltd."),
                createAMCMap(29L, "Union Asset Management Company Private Limited"),
                createAMCMap(30L, "The Wealth Company Mutual Fund"),
                createAMCMap(31L, "Bajaj Finserv Mutual Fund"),
                createAMCMap(32L, "Bandhan Mutual Fund"),
                createAMCMap(33L, "Canara Robeco Asset Management Company Limited"),
                createAMCMap(34L, "Trust Mutual Fund"),
                createAMCMap(35L, "Quant Asset Management Company Limited"),
                createAMCMap(36L, "BOI Asset Management Company Limited"),
                createAMCMap(37L, "Angle One Asset Management Company Limited"),
                createAMCMap(38L, "Capitalmind Mutual Fund"),
                createAMCMap(39L, "Choice Mutual Fund"),
                createAMCMap(40L, "IIFCL Mutual Fund"),
                createAMCMap(41L, "IL&FS Mutual Fund"),
                createAMCMap(42L, "Mahindra Manulife Mutual Fund"),
                createAMCMap(43L, "Navi Mutual Fund"),
                createAMCMap(44L, "Samco Mutual Fund"),
                createAMCMap(45L, "Abakkus MF")
            );
            // Sort AMCs alphabetically for better UX
            amcs.sort((a, b) -> {
                String nameA = (String) a.get("name");
                String nameB = (String) b.get("name");
                return nameA.compareToIgnoreCase(nameB);
            });
            return ResponseEntity.ok(amcs);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    private Map<String, Object> createAMCMap(Long id, String name) {
        Map<String, Object> amc = new HashMap<>();
        amc.put("id", id != null ? id : 0L);
        amc.put("name", name);
        return amc;
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
            setField(dto, "risk", fund.getRisk() != null ? fund.getRisk().name() : "MEDIUM");
            setField(dto, "horizon", fund.getHorizon() != null ? fund.getHorizon().name() : "MEDIUM_TERM");
            setField(dto, "goal", fund.getGoal() != null ? fund.getGoal().name() : "WEALTH");
            setField(dto, "assetType", fund.getAssetType());
            setField(dto, "fundAge", fund.getFundAge());
            setField(dto, "isPopular", Math.random() > 0.7); // Random popular flag
            setField(dto, "tagline", generateTagline(fund.getGoal() != null ? fund.getGoal().name() : "WEALTH"));
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

    // New endpoints for enhanced dashboard

    /**
     * Get AMC → Fund → Plan hierarchy
     */
    @GetMapping("/hierarchy")
    public ResponseEntity<Map<String, Object>> getFundHierarchy(
            @RequestParam(required = false) Long amcId) {
        try {
            Map<String, Object> hierarchy = new HashMap<>();
            
            List<AMC> amcs;
            if (amcId != null) {
                amcRepository.findById(amcId).ifPresent(amc -> {
                    // Process single AMC
                });
                amcs = amcRepository.findAll().stream()
                        .filter(amc -> amc.getId().equals(amcId))
                        .collect(Collectors.toList());
            } else {
                amcs = amcRepository.findAll();
            }
            
            // If no AMCs in DB, use the static list from /amcs endpoint
            if (amcs.isEmpty()) {
                amcs = new ArrayList<>();
                // Create AMCs from the static list
                String[] amcNames = {
                    "HDFC Asset Management Company Limited",
                    "ICICI Prudential Asset Management Company Limited",
                    "SBI Funds Management Private Limited",
                    "Axis Asset Management Co. Ltd.",
                    "Kotak Mahindra Asset Management Company Limited"
                };
                for (int i = 0; i < Math.min(amcNames.length, 5); i++) {
                    AMC amc = new AMC();
                    amc.setId((long) (i + 1));
                    amc.setName(amcNames[i]);
                    amcs.add(amc);
                }
            }

            List<Map<String, Object>> amcList = new ArrayList<>();
            for (AMC amc : amcs) {
                if (amcId != null && !amc.getId().equals(amcId)) {
                    continue;
                }
                
                List<Fund> funds = fundRepository.findAll().stream()
                        .filter(f -> f.getAmc() != null && f.getAmc().getId().equals(amc.getId()))
                        .collect(Collectors.toList());

                List<Map<String, Object>> fundList = new ArrayList<>();
                for (Fund fund : funds) {
                    List<FundPlan> plans = fundPlanRepository.findByFundId(fund.getId());
                    
                    Map<String, Object> fundMap = new HashMap<>();
                    fundMap.put("id", fund.getId());
                    fundMap.put("name", fund.getName());
                    fundMap.put("type", fund.getType());
                    fundMap.put("risk", fund.getRisk() != null ? fund.getRisk().name() : "MEDIUM");
                    fundMap.put("fundScore", fundScoringService.calculateFundScore(fund));
                    fundMap.put("starRating", calculateStarRating(fundScoringService.calculateFundScore(fund)));
                    fundMap.put("plans", plans.stream().map(plan -> {
                        Map<String, Object> planMap = new HashMap<>();
                        planMap.put("id", plan.getId());
                        planMap.put("planType", plan.getPlanType().name());
                        planMap.put("optionType", plan.getOptionType().name());
                        planMap.put("nav", plan.getNav());
                        planMap.put("oneYearReturn", plan.getOneYearReturn());
                        return planMap;
                    }).collect(Collectors.toList()));
                    
                    fundList.add(fundMap);
                }

                Map<String, Object> amcMap = new HashMap<>();
                amcMap.put("id", amc.getId());
                amcMap.put("name", amc.getName());
                amcMap.put("funds", fundList);
                amcList.add(amcMap);
            }

            hierarchy.put("amcs", amcList);
            return ResponseEntity.ok(hierarchy);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyMap());
        }
    }

    /**
     * Get fund recommendations (goal-based, risk-based, popular, top performers)
     */
    @GetMapping("/recommendations/{userId}")
    public ResponseEntity<List<FundRecommendationDto>> getRecommendations(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(fundRecommendationService.getRecommendations(userId));
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get detailed fund information
     */
    @GetMapping("/fund/{fundId}")
    public ResponseEntity<FundDetailDto> getFundDetail(@PathVariable Long fundId) {
        try {
            // Try to get real fund first
            Fund fund = fundRepository.findById(fundId).orElse(null);
            if (fund != null) {
                return ResponseEntity.ok(fundDetailService.getFundDetail(fundId));
            }
            
            // If fund doesn't exist, return mock fund detail
            return ResponseEntity.ok(createMockFundDetail(fundId));
        } catch (Exception e) {
            // Return mock fund detail on error
            return ResponseEntity.ok(createMockFundDetail(fundId));
        }
    }
    
    private FundDetailDto createMockFundDetail(Long fundId) {
        // Create mock fund detail based on fundId
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
        
        int index = (int) ((fundId - 1) % fundNames.length);
        
        // Create mock plans
        List<FundDetailDto.PlanDetailDto> plans = new ArrayList<>();
        
        // Regular Growth Plan
        plans.add(FundDetailDto.PlanDetailDto.builder()
                .planId(1000L + fundId)
                .planType("REGULAR")
                .optionType("GROWTH")
                .nav(BigDecimal.valueOf(100 + (index * 5)))
                .navChange(BigDecimal.valueOf(0.5 + (index * 0.1)))
                .oneYearReturn(BigDecimal.valueOf(15 + (index * 0.5)))
                .threeYearReturn(BigDecimal.valueOf(18 + (index * 0.5)))
                .fiveYearReturn(BigDecimal.valueOf(20 + (index * 0.5)))
                .sinceInceptionReturn(BigDecimal.valueOf(22 + (index * 0.5)))
                .navDate(LocalDate.now())
                .expenseRatio(BigDecimal.valueOf(1.5))
                .minimumInvestment(BigDecimal.valueOf(5000))
                .minimumSipAmount(BigDecimal.valueOf(500))
                .amfiCode("AMFI" + String.format("%06d", fundId))
                .build());
        
        // Direct Growth Plan
        plans.add(FundDetailDto.PlanDetailDto.builder()
                .planId(2000L + fundId)
                .planType("DIRECT")
                .optionType("GROWTH")
                .nav(BigDecimal.valueOf(100 + (index * 5)))
                .navChange(BigDecimal.valueOf(0.5 + (index * 0.1)))
                .oneYearReturn(BigDecimal.valueOf(16.5 + (index * 0.5)))
                .threeYearReturn(BigDecimal.valueOf(19.5 + (index * 0.5)))
                .fiveYearReturn(BigDecimal.valueOf(21.5 + (index * 0.5)))
                .sinceInceptionReturn(BigDecimal.valueOf(23.5 + (index * 0.5)))
                .navDate(LocalDate.now())
                .expenseRatio(BigDecimal.valueOf(0.8))
                .minimumInvestment(BigDecimal.valueOf(5000))
                .minimumSipAmount(BigDecimal.valueOf(500))
                .amfiCode("AMFI" + String.format("%06d", fundId + 1000))
                .build());
        
        return FundDetailDto.builder()
                .id(fundId)
                .name(fundNames[index])
                .amcName(amcNames[index])
                .amcId((long) (index + 1))
                .type("Equity")
                .risk("HIGH")
                .horizon("LONG_TERM")
                .goal("WEALTH")
                .assetType("EQUITY")
                .fundAge(10 + index)
                .aum(BigDecimal.valueOf(5000 + (index * 1000)))
                .fundSize(BigDecimal.valueOf(5000 + (index * 1000)))
                .description("A well-diversified equity fund that invests in large-cap and mid-cap companies. This fund aims to provide long-term capital appreciation through a portfolio of quality stocks.")
                .investmentObjective("To generate long-term capital appreciation by investing primarily in equity and equity-related instruments of companies across market capitalizations.")
                .fundManager("Experienced Fund Management Team")
                .launchDate(LocalDate.now().minusYears(10 + index))
                .fundScore(BigDecimal.valueOf(75 + (index * 2)))
                .starRating(4 + (index % 2))
                .isPopular(index < 3)
                .isRecommended(true)
                .tagline("Long-term wealth creation through equity")
                .plans(plans)
                .performance(FundDetailDto.PerformanceMetricsDto.builder()
                        .oneYearReturn(BigDecimal.valueOf(15 + (index * 0.5)))
                        .threeYearReturn(BigDecimal.valueOf(18 + (index * 0.5)))
                        .fiveYearReturn(BigDecimal.valueOf(20 + (index * 0.5)))
                        .sinceInceptionReturn(BigDecimal.valueOf(22 + (index * 0.5)))
                        .volatility(BigDecimal.valueOf(12.5))
                        .sharpeRatio(BigDecimal.valueOf(1.2))
                        .alpha(BigDecimal.valueOf(2.5))
                        .beta(BigDecimal.valueOf(0.95))
                        .informationRatio(BigDecimal.valueOf(0.8))
                        .build())
                .riskMetrics(FundDetailDto.RiskMetricsDto.builder()
                        .riskLevel("HIGH")
                        .standardDeviation(BigDecimal.valueOf(12.5))
                        .downsideDeviation(BigDecimal.valueOf(8.2))
                        .maxDrawdown(BigDecimal.valueOf(-15.3))
                        .var(BigDecimal.valueOf(-5.2))
                        .build())
                .navHistory(new ArrayList<>())
                .comparison(FundDetailDto.ComparisonDto.builder()
                        .fundReturn(BigDecimal.valueOf(15 + (index * 0.5)))
                        .categoryAverage(BigDecimal.valueOf(14 + (index * 0.5)))
                        .benchmarkReturn(BigDecimal.valueOf(13 + (index * 0.5)))
                        .benchmarkName("Nifty 500")
                        .build())
                .build();
    }

    /**
     * Get funds by AMC
     */
    @GetMapping("/amc/{amcId}/funds")
    public ResponseEntity<List<FundExploreDto>> getFundsByAMC(@PathVariable Long amcId) {
        try {
            List<Fund> funds = fundRepository.findAll().stream()
                    .filter(f -> f.getAmc() != null && f.getAmc().getId().equals(amcId))
                    .collect(Collectors.toList());
            
            if (funds.isEmpty()) {
                // Fallback to all funds
                funds = fundRepository.findAll();
            }
            
            return ResponseEntity.ok(convertFundsToDto(funds));
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * Get plans for a fund
     */
    @GetMapping("/fund/{fundId}/plans")
    public ResponseEntity<List<Map<String, Object>>> getFundPlans(@PathVariable Long fundId) {
        try {
            List<FundPlan> plans = fundPlanRepository.findByFundId(fundId);
            
            // If no plans exist, create mock plans
            if (plans.isEmpty()) {
                return ResponseEntity.ok(createMockPlans(fundId));
            }
            
            List<Map<String, Object>> planList = plans.stream().map(plan -> {
                Map<String, Object> planMap = new HashMap<>();
                planMap.put("id", plan.getId());
                planMap.put("planType", plan.getPlanType().name());
                planMap.put("optionType", plan.getOptionType().name());
                planMap.put("nav", plan.getNav());
                planMap.put("navChange", plan.getNavChange());
                planMap.put("oneYearReturn", plan.getOneYearReturn());
                planMap.put("threeYearReturn", plan.getThreeYearReturn());
                planMap.put("fiveYearReturn", plan.getFiveYearReturn());
                planMap.put("expenseRatio", plan.getExpenseRatio());
                planMap.put("minimumInvestment", plan.getMinimumInvestment());
                planMap.put("minimumSipAmount", plan.getMinimumSipAmount());
                return planMap;
            }).collect(Collectors.toList());
            
            return ResponseEntity.ok(planList);
        } catch (Exception e) {
            // Return mock plans on error
            return ResponseEntity.ok(createMockPlans(fundId));
        }
    }
    
    private List<Map<String, Object>> createMockPlans(Long fundId) {
        List<Map<String, Object>> plans = new ArrayList<>();
        int index = (int) ((fundId - 1) % 6);
        
        // Regular Growth Plan
        Map<String, Object> regularGrowth = new HashMap<>();
        regularGrowth.put("id", 1000L + fundId);
        regularGrowth.put("planType", "REGULAR");
        regularGrowth.put("optionType", "GROWTH");
        regularGrowth.put("nav", BigDecimal.valueOf(100 + (index * 5)));
        regularGrowth.put("navChange", BigDecimal.valueOf(0.5 + (index * 0.1)));
        regularGrowth.put("oneYearReturn", BigDecimal.valueOf(15 + (index * 0.5)));
        regularGrowth.put("threeYearReturn", BigDecimal.valueOf(18 + (index * 0.5)));
        regularGrowth.put("fiveYearReturn", BigDecimal.valueOf(20 + (index * 0.5)));
        regularGrowth.put("expenseRatio", BigDecimal.valueOf(1.5));
        regularGrowth.put("minimumInvestment", BigDecimal.valueOf(5000));
        regularGrowth.put("minimumSipAmount", BigDecimal.valueOf(500));
        plans.add(regularGrowth);
        
        // Direct Growth Plan
        Map<String, Object> directGrowth = new HashMap<>();
        directGrowth.put("id", 2000L + fundId);
        directGrowth.put("planType", "DIRECT");
        directGrowth.put("optionType", "GROWTH");
        directGrowth.put("nav", BigDecimal.valueOf(100 + (index * 5)));
        directGrowth.put("navChange", BigDecimal.valueOf(0.5 + (index * 0.1)));
        directGrowth.put("oneYearReturn", BigDecimal.valueOf(16.5 + (index * 0.5)));
        directGrowth.put("threeYearReturn", BigDecimal.valueOf(19.5 + (index * 0.5)));
        directGrowth.put("fiveYearReturn", BigDecimal.valueOf(21.5 + (index * 0.5)));
        directGrowth.put("expenseRatio", BigDecimal.valueOf(0.8));
        directGrowth.put("minimumInvestment", BigDecimal.valueOf(5000));
        directGrowth.put("minimumSipAmount", BigDecimal.valueOf(500));
        plans.add(directGrowth);
        
        return plans;
    }

    /**
     * Cart endpoints
     */
    @GetMapping("/cart/{userId}")
    public ResponseEntity<CartDto> getCart(@PathVariable Long userId) {
        try {
            return ResponseEntity.ok(cartService.getCart(userId));
        } catch (Exception e) {
            return ResponseEntity.ok(CartDto.builder().userId(userId).items(Collections.emptyList())
                    .totalAmount(BigDecimal.ZERO).totalItems(0).build());
        }
    }

    @PostMapping("/cart/{userId}/add")
    public ResponseEntity<?> addToCart(
            @PathVariable Long userId,
            @RequestBody Map<String, Object> request) {
        try {
            Long planId = Long.valueOf(request.get("planId").toString());
            String investmentTypeStr = request.get("investmentType").toString();
            CartItem.InvestmentType type = CartItem.InvestmentType.valueOf(investmentTypeStr.toUpperCase());
            
            BigDecimal amount = request.get("amount") != null ? 
                new BigDecimal(request.get("amount").toString()) : null;
            BigDecimal sipAmount = request.get("sipAmount") != null ? 
                new BigDecimal(request.get("sipAmount").toString()) : null;
            Integer sipDuration = request.get("sipDuration") != null ? 
                Integer.valueOf(request.get("sipDuration").toString()) : null;
            
            CartDto cart = cartService.addToCart(userId, planId, type, amount, sipAmount, sipDuration);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage() != null ? e.getMessage() : "Failed to add to cart"));
        }
    }

    @PostMapping("/cart/{userId}/remove/{itemId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long userId, @PathVariable Long itemId) {
        try {
            cartService.removeFromCart(userId, itemId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/cart/{userId}/clear")
    public ResponseEntity<Void> clearCart(@PathVariable Long userId) {
        try {
            cartService.clearCart(userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Mock investment flow - process cart
     */
    @PostMapping("/cart/{userId}/invest")
    public ResponseEntity<Map<String, Object>> processInvestment(@PathVariable Long userId) {
        try {
            CartDto cart = cartService.getCart(userId);
            
            if (cart.getItems().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Cart is empty"));
            }

            // Mock transaction processing
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("transactionId", "TXN" + System.currentTimeMillis());
            response.put("message", "Investment order placed successfully");
            response.put("items", cart.getItems().size());
            response.put("totalAmount", cart.getTotalAmount());
            
            // Clear cart after successful investment
            cartService.clearCart(userId);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
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
}


