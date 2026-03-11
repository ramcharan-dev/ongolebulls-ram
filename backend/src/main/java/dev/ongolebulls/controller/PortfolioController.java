package dev.ongolebulls.controller;

import dev.ongolebulls.dto.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/portfolio")
public class PortfolioController {

    private final PortfolioPositionRepo portfolioRepo;
    private final SipPlanRepo sipPlanRepo;
    private final InvestmentTransactionRepo transactionRepo;
    private final UserRepository userRepo;
    private final InvestorAccountRepo investorAccountRepo;

    public PortfolioController(
            PortfolioPositionRepo portfolioRepo,
            SipPlanRepo sipPlanRepo,
            InvestmentTransactionRepo transactionRepo,
            UserRepository userRepo,
            InvestorAccountRepo investorAccountRepo) {
        this.portfolioRepo = portfolioRepo;
        this.sipPlanRepo = sipPlanRepo;
        this.transactionRepo = transactionRepo;
        this.userRepo = userRepo;
        this.investorAccountRepo = investorAccountRepo;
    }

    // Helper method using reflection
    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }

    // Helper method to set field using reflection
    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore if field doesn't exist or can't be set
        }
    }

    private Long getInvestorIdFromUserId(Long userId) {
        try {
            return userRepo.findById(userId)
                    .map(user -> {
                        Object investorAccount = getField(user, "investorAccount");
                        if (investorAccount != null) {
                            Object id = getField(investorAccount, "id");
                            return id != null ? (Long) id : null;
                        }
                        return null;
                    })
                    .orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/summary/{userId}")
    public ResponseEntity<PortfolioSummaryDto> getPortfolioSummary(@PathVariable Long userId) {
        try {
            Long investorId = getInvestorIdFromUserId(userId);
            if (investorId == null) {
                return ResponseEntity.ok(createEmptySummary(userId));
            }

            List<PortfolioPosition> positions = portfolioRepo.findByInvestor_Id(investorId);
            List<SipPlan> activeSips = sipPlanRepo.findByInvestor_IdAndActiveTrue(investorId);

            BigDecimal totalInvested = positions.stream()
                    .map(PortfolioPosition::getInvestedAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalCurrent = positions.stream()
                    .map(PortfolioPosition::getCurrentValue)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal totalReturns = totalCurrent.subtract(totalInvested);
            Double returnsPercentage = totalInvested.compareTo(BigDecimal.ZERO) > 0
                    ? totalReturns.divide(totalInvested, 4, RoundingMode.HALF_UP)
                            .multiply(BigDecimal.valueOf(100)).doubleValue()
                    : 0.0;

            // Days gain/loss (simplified - can be enhanced with historical data)
            BigDecimal daysGainLoss = BigDecimal.ZERO; // TODO: Calculate from previous day

            // Get user and investor account info
            String investorName = "";
            String investorIdStr = "";
            LocalDateTime lastUpdated = LocalDateTime.now();
            
            try {
                User user = userRepo.findById(userId).orElse(null);
                if (user != null) {
                    Object name = getField(user, "fullName");
                    investorName = name != null ? name.toString() : "";
                    
                    // Get investor account ID (not user ID) for proper investor ID generation
                    Object investorAccount = getField(user, "investorAccount");
                    if (investorAccount != null) {
                        Object investorAccountId = getField(investorAccount, "id");
                        if (investorAccountId != null && investorAccountId instanceof Long) {
                            // Generate investor ID from investor account ID (e.g., INV000001, INV000002)
                            investorIdStr = "INV" + String.format("%06d", (Long) investorAccountId);
                        } else {
                            // Fallback to user ID if investor account ID not available
                            investorIdStr = "INV" + String.format("%06d", userId);
                        }
                    } else {
                        // Fallback to user ID if no investor account
                        investorIdStr = "INV" + String.format("%06d", userId);
                    }
                    
                    // Get last updated from the most recent transaction
                    // Use current time as default, but try to get from latest transaction if available
                    try {
                        // Get all transactions for this investor and find the latest
                        Page<InvestmentTransaction> txnsPage = transactionRepo
                            .findByInvestorId(investorId, PageRequest.of(0, 1));
                        if (txnsPage != null && txnsPage.hasContent()) {
                            InvestmentTransaction latestTxn = txnsPage.getContent().get(0);
                            Object txnDate = getField(latestTxn, "transactionDate");
                            if (txnDate != null && txnDate instanceof LocalDateTime) {
                                lastUpdated = (LocalDateTime) txnDate;
                            }
                        }
                    } catch (Exception e) {
                        // Use current time if transaction date not available
                        // This ensures lastUpdated is always set dynamically
                    }
                } else {
                    // Fallback if user not found
                    investorIdStr = "INV" + String.format("%06d", userId);
                }
            } catch (Exception e) {
                // Fallback if error
                investorIdStr = "INV" + String.format("%06d", userId);
            }

            PortfolioSummaryDto summary = new PortfolioSummaryDto();
            setField(summary, "totalPortfolioValue", totalCurrent);
            setField(summary, "totalInvestedAmount", totalInvested);
            setField(summary, "totalReturns", totalReturns);
            setField(summary, "returnsPercentage", returnsPercentage);
            setField(summary, "daysGainLoss", daysGainLoss);
            setField(summary, "activeSipsCount", activeSips != null ? activeSips.size() : 0);
            setField(summary, "lastUpdated", lastUpdated);
            setField(summary, "investorId", investorIdStr);
            setField(summary, "investorName", investorName);

            return ResponseEntity.ok(summary);
        } catch (Exception e) {
            return ResponseEntity.ok(createEmptySummary(userId));
        }
    }

    @GetMapping("/assets/{userId}")
    public ResponseEntity<List<PortfolioAssetDto>> getPortfolioAssets(
            @PathVariable Long userId,
            @RequestParam(required = false) String category) {
        try {
            Long investorId = getInvestorIdFromUserId(userId);
            if (investorId == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<PortfolioPosition> positions = portfolioRepo.findByInvestor_Id(investorId);
            List<SipPlan> sips = sipPlanRepo.findByInvestor_IdAndActiveTrue(investorId);

            List<PortfolioAssetDto> assets = new ArrayList<>();

            // Convert positions to assets
            for (PortfolioPosition pos : positions) {
                String assetClass = pos.getAssetClass() != null ? pos.getAssetClass().name() : "OTHERS";
                String cat = mapAssetClassToCategory(assetClass);
                
                if (category == null || category.equals("ALL") || category.equals(cat)) {
                    BigDecimal invested = pos.getInvestedAmount() != null ? pos.getInvestedAmount() : BigDecimal.ZERO;
                    BigDecimal current = pos.getCurrentValue() != null ? pos.getCurrentValue() : BigDecimal.ZERO;
                    BigDecimal returns = current.subtract(invested);
                    Double returnsPct = invested.compareTo(BigDecimal.ZERO) > 0
                            ? returns.divide(invested, 4, RoundingMode.HALF_UP)
                                    .multiply(BigDecimal.valueOf(100)).doubleValue()
                            : 0.0;

                    PortfolioAssetDto asset = new PortfolioAssetDto();
                    setField(asset, "id", pos.getId());
                    setField(asset, "schemeName", pos.getFundName());
                    setField(asset, "assetClass", assetClass);
                    setField(asset, "investedAmount", invested);
                    setField(asset, "currentValue", current);
                    setField(asset, "returns", returns);
                    setField(asset, "returnsPercentage", returnsPct);
                    setField(asset, "status", "ACTIVE");
                    setField(asset, "category", cat);
                    assets.add(asset);
                }
            }

            // Add SIPs as separate assets if category matches
            if (category == null || category.equals("ALL") || category.equals("SIP")) {
                for (SipPlan sip : sips) {
                    String fundName = sip.getFundName() != null ? sip.getFundName() : "SIP Fund";
                    BigDecimal monthlyAmount = sip.getMonthlyAmount() != null ? sip.getMonthlyAmount() : BigDecimal.ZERO;
                    // Estimate invested as 12 months * monthly amount (simplified)
                    BigDecimal estimatedInvested = monthlyAmount.multiply(BigDecimal.valueOf(12));
                    BigDecimal estimatedCurrent = estimatedInvested.multiply(BigDecimal.valueOf(1.1)); // 10% return estimate

                    PortfolioAssetDto asset = new PortfolioAssetDto();
                    setField(asset, "id", sip.getId() != null ? sip.getId() : 0L);
                    setField(asset, "schemeName", fundName + " (SIP)");
                    setField(asset, "assetClass", "EQUITY");
                    setField(asset, "investedAmount", estimatedInvested);
                    setField(asset, "currentValue", estimatedCurrent);
                    setField(asset, "returns", estimatedCurrent.subtract(estimatedInvested));
                    setField(asset, "returnsPercentage", 10.0);
                    setField(asset, "status", "ACTIVE");
                    setField(asset, "category", "SIP");
                    assets.add(asset);
                }
            }

            return ResponseEntity.ok(assets);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @GetMapping("/performance/{userId}")
    public ResponseEntity<List<PortfolioPerformanceDto>> getPortfolioPerformance(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "12") int months) {
        try {
            Long investorId = getInvestorIdFromUserId(userId);
            if (investorId == null) {
                return ResponseEntity.ok(createEmptyPerformance(months));
            }

            List<PortfolioPosition> positions = portfolioRepo.findByInvestor_Id(investorId);
            BigDecimal currentTotal = positions.stream()
                    .map(PortfolioPosition::getCurrentValue)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Generate historical data (simplified - in production, use actual historical NAVs)
            List<PortfolioPerformanceDto> performance = new ArrayList<>();
            LocalDate today = LocalDate.now();
            
            for (int i = months; i >= 0; i--) {
                LocalDate date = today.minusMonths(i);
                // Simulate growth (in production, fetch actual historical values)
                double growthFactor = 1.0 + (months - i) * 0.01; // 1% growth per month
                BigDecimal value = currentTotal.divide(BigDecimal.valueOf(growthFactor), 2, RoundingMode.HALF_UP);
                PortfolioPerformanceDto perf = new PortfolioPerformanceDto();
                setField(perf, "date", date);
                setField(perf, "portfolioValue", value);
                performance.add(perf);
            }

            return ResponseEntity.ok(performance);
        } catch (Exception e) {
            return ResponseEntity.ok(createEmptyPerformance(months));
        }
    }

    private String mapAssetClassToCategory(String assetClass) {
        if (assetClass == null) return "OTHERS";
        switch (assetClass) {
            case "EQUITY":
                return "MUTUAL_FUNDS";
            case "DEBT":
                return "FIXED_INCOME";
            case "LIQUID":
                return "FIXED_INCOME";
            default:
                return "OTHERS";
        }
    }

    private PortfolioSummaryDto createEmptySummary(Long userId) {
        String investorIdStr = "INV" + String.format("%06d", userId);
        
        // Try to get investor account ID if available
        try {
            User user = userRepo.findById(userId).orElse(null);
            if (user != null) {
                Object investorAccount = getField(user, "investorAccount");
                if (investorAccount != null) {
                    Object investorAccountId = getField(investorAccount, "id");
                    if (investorAccountId != null && investorAccountId instanceof Long) {
                        investorIdStr = "INV" + String.format("%06d", (Long) investorAccountId);
                    }
                }
            }
        } catch (Exception e) {
            // Use fallback
        }
        
        PortfolioSummaryDto summary = new PortfolioSummaryDto();
        setField(summary, "totalPortfolioValue", BigDecimal.ZERO);
        setField(summary, "totalInvestedAmount", BigDecimal.ZERO);
        setField(summary, "totalReturns", BigDecimal.ZERO);
        setField(summary, "returnsPercentage", 0.0);
        setField(summary, "daysGainLoss", BigDecimal.ZERO);
        setField(summary, "activeSipsCount", 0);
        setField(summary, "lastUpdated", LocalDateTime.now());
        setField(summary, "investorId", investorIdStr);
        setField(summary, "investorName", "");
        return summary;
    }

    private List<PortfolioPerformanceDto> createEmptyPerformance(int months) {
        List<PortfolioPerformanceDto> performance = new ArrayList<>();
        LocalDate today = LocalDate.now();
        for (int i = months; i >= 0; i--) {
            PortfolioPerformanceDto perf = new PortfolioPerformanceDto();
            setField(perf, "date", today.minusMonths(i));
            setField(perf, "portfolioValue", BigDecimal.ZERO);
            performance.add(perf);
        }
        return performance;
    }
}

