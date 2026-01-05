package dev.ongolebulls.service;

import dev.ongolebulls.dto.CartDto;
import dev.ongolebulls.model.AMC;
import dev.ongolebulls.model.CartItem;
import dev.ongolebulls.model.Fund;
import dev.ongolebulls.model.FundPlan;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.AMCRepository;
import dev.ongolebulls.repository.CartItemRepository;
import dev.ongolebulls.repository.FundPlanRepository;
import dev.ongolebulls.repository.FundRepository;
import dev.ongolebulls.repository.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final FundPlanRepository fundPlanRepository;
    private final UserRepository userRepository;
    private final FundRepository fundRepository;
    private final AMCRepository amcRepository;
    private final EntityManager entityManager;

    public CartDto getCart(Long userId) {
        List<CartItem> items = cartItemRepository.findByUserId(userId);
        
        List<CartDto.CartItemDto> itemDtos = items.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
        
        BigDecimal totalAmount = itemDtos.stream()
                .map(item -> item.getAmount() != null ? item.getAmount() : 
                           (item.getSipAmount() != null ? item.getSipAmount() : BigDecimal.ZERO))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        
        return CartDto.builder()
                .items(itemDtos)
                .totalAmount(totalAmount)
                .build();
    }

    @Transactional
    public CartDto addToCart(Long userId, Long planId, CartItem.InvestmentType investmentType, 
                            BigDecimal amount, BigDecimal sipAmount, Integer sipDuration) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Handle mock plans (planId > 1000)
        FundPlan fundPlan;
        if (planId > 1000) {
            // Check if mock plan already exists
            fundPlan = fundPlanRepository.findById(planId).orElse(null);
            if (fundPlan == null) {
                // Create and save mock fund plan
                fundPlan = createAndSaveMockFundPlan(planId);
            }
        } else {
            fundPlan = fundPlanRepository.findById(planId)
                    .orElseThrow(() -> new RuntimeException("Fund plan not found"));
        }

        // Check if item already exists (only for real plans, not mock)
        CartItem existingItem = null;
        if (planId <= 1000) {
            try {
                existingItem = cartItemRepository
                        .findByUserIdAndFundPlanIdAndInvestmentType(userId, planId, investmentType)
                        .orElse(null);
            } catch (Exception e) {
                // If query fails, just create new item
                existingItem = null;
            }
        }

        if (existingItem != null) {
            // Update existing item
            if (investmentType == CartItem.InvestmentType.LUMPSUM) {
                existingItem.setAmount(amount);
            } else {
                existingItem.setSipAmount(sipAmount);
                existingItem.setSipDuration(sipDuration);
            }
            cartItemRepository.save(existingItem);
        } else {
            // Create new item
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .fundPlan(fundPlan)
                    .investmentType(investmentType)
                    .amount(investmentType == CartItem.InvestmentType.LUMPSUM ? amount : null)
                    .sipAmount(investmentType == CartItem.InvestmentType.SIP ? sipAmount : null)
                    .sipDuration(investmentType == CartItem.InvestmentType.SIP ? sipDuration : null)
                    .build();
            cartItemRepository.save(cartItem);
        }

        return getCart(userId);
    }

    @Transactional
    public CartDto removeFromCart(Long userId, Long itemId) {
        cartItemRepository.deleteById(itemId);
        return getCart(userId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    @Transactional
    public CartDto processInvestment(Long userId) {
        // Process investment logic here
        // For now, just clear the cart
        clearCart(userId);
        return getCart(userId);
    }

    private CartDto.CartItemDto convertToDto(CartItem item) {
        FundPlan plan = item.getFundPlan();
        Fund fund = plan != null ? plan.getFund() : null;
        
        return CartDto.CartItemDto.builder()
                .itemId(item.getId())
                .fundId(fund != null ? fund.getId() : (item.getId() % 6) + 1)
                .fundName(fund != null ? fund.getName() : "Fund " + item.getId())
                .amcName(fund != null && fund.getAmc() != null ? fund.getAmc().getName() : "N/A")
                .planId(plan != null ? plan.getId() : item.getId())
                .planType(plan != null ? plan.getPlanType().name() : "DIRECT")
                .optionType(plan != null ? plan.getOptionType().name() : "GROWTH")
                .investmentType(item.getInvestmentType().name())
                .amount(item.getAmount())
                .sipAmount(item.getSipAmount())
                .sipDuration(item.getSipDuration())
                .nav(plan != null ? plan.getNav() : BigDecimal.valueOf(100))
                .addedAt(item.getAddedAt())
                .build();
    }
    
    @Transactional
    private FundPlan createAndSaveMockFundPlan(Long planId) {
        // Determine fund ID from plan ID
        final Long fundId = planId > 2000 ? planId - 2000 : planId - 1000;
        
        // Check if fund plan already exists
        FundPlan existingPlan = fundPlanRepository.findById(planId).orElse(null);
        if (existingPlan != null) {
            return existingPlan;
        }
        
        // CRITICAL: Get or create Fund - use native SQL to insert with specific ID
        Fund verifiedFund = fundRepository.findById(fundId).orElse(null);
        
        if (verifiedFund == null) {
            // Fund doesn't exist - create it using native SQL to set ID directly
            // Get or create a default AMC
            AMC defaultAMC = amcRepository.findAll().stream().findFirst()
                    .orElseGet(() -> {
                        AMC amc = new AMC();
                        amc.setName("Default AMC");
                        return amcRepository.save(amc);
                    });
            
            // Use native SQL to insert Fund with specific ID
            // This bypasses Hibernate's ID generation and ensures the ID matches
            try {
                entityManager.createNativeQuery(
                    "INSERT INTO funds (id, name, type, risk, asset_type, amc_id) VALUES (:id, :name, :type, :risk, :assetType, :amcId)"
                )
                .setParameter("id", fundId)
                .setParameter("name", "Mock Fund " + fundId)
                .setParameter("type", "Equity")
                .setParameter("risk", "HIGH")
                .setParameter("assetType", "EQUITY")
                .setParameter("amcId", defaultAMC.getId())
                .executeUpdate();
                entityManager.flush();
                entityManager.clear(); // Clear persistence context to force reload
                
                // Reload the fund from database
                verifiedFund = fundRepository.findById(fundId)
                        .orElseThrow(() -> new RuntimeException("Failed to create/retrieve Fund with ID: " + fundId));
            } catch (Exception e) {
                // If insert fails (e.g., ID already exists), try to get it
                verifiedFund = fundRepository.findById(fundId).orElse(null);
                if (verifiedFund == null) {
                    // Last resort: create without specifying ID and use whatever ID is assigned
                    Fund newFund = new Fund();
                    newFund.setName("Mock Fund " + fundId);
                    newFund.setType("Equity");
                    newFund.setRisk(Fund.RiskLevel.HIGH);
                    newFund.setAssetType("EQUITY");
                    newFund.setAmc(defaultAMC);
                    verifiedFund = fundRepository.save(newFund);
                    entityManager.flush();
                    // Use the actual assigned ID - update fundId to match
                    // But fundId is final, so we'll need to handle this differently
                    // For now, just use the assigned ID
                }
            }
        } else {
            // Fund exists - refresh to ensure we have latest state
            entityManager.refresh(verifiedFund);
        }
        
        // CRITICAL: Verify fund has valid ID and exists in database
        if (verifiedFund.getId() == null) {
            throw new RuntimeException("Fund entity has null ID - cannot create FundPlan");
        }
        
        // Final verification: query database to ensure fund exists
        final Long finalFundId = verifiedFund.getId();
        Fund dbFund = fundRepository.findById(finalFundId)
                .orElseThrow(() -> new RuntimeException("Fund with ID " + finalFundId + " does not exist in database"));
        verifiedFund = dbFund; // Use database-verified fund
        
        // Create a mock fund plan
        FundPlan.PlanType planType = planId > 2000 ? FundPlan.PlanType.DIRECT : FundPlan.PlanType.REGULAR;
        
        FundPlan mockPlan = new FundPlan();
        mockPlan.setFund(verifiedFund); // Use verified fund
        mockPlan.setPlanType(planType);
        mockPlan.setOptionType(FundPlan.OptionType.GROWTH);
        mockPlan.setNav(BigDecimal.valueOf(100));
        mockPlan.setNavChange(BigDecimal.valueOf(0.5));
        mockPlan.setOneYearReturn(BigDecimal.valueOf(15));
        mockPlan.setThreeYearReturn(BigDecimal.valueOf(18));
        mockPlan.setFiveYearReturn(BigDecimal.valueOf(20));
        mockPlan.setNavDate(LocalDate.now());
        mockPlan.setExpenseRatio(BigDecimal.valueOf(1.0));
        mockPlan.setMinimumInvestment(BigDecimal.valueOf(5000));
        mockPlan.setMinimumSipAmount(BigDecimal.valueOf(500));
        
        // Save the plan
        mockPlan = fundPlanRepository.save(mockPlan);
        entityManager.flush(); // Force immediate database write
        entityManager.refresh(mockPlan); // Reload to ensure it's fully persisted
        
        // If we need a specific planId, update it using native query
        if (!mockPlan.getId().equals(planId)) {
            try {
                entityManager.createNativeQuery(
                    "UPDATE fund_plans SET id = :newId WHERE id = :oldId"
                )
                .setParameter("newId", planId)
                .setParameter("oldId", mockPlan.getId())
                .executeUpdate();
                entityManager.flush();
                entityManager.clear(); // Clear persistence context
                
                // Reload the plan with new ID
                mockPlan = fundPlanRepository.findById(planId).orElse(mockPlan);
            } catch (Exception e) {
                // If update fails, log but continue with actual ID
                System.err.println("Warning: Could not update FundPlan ID from " + mockPlan.getId() + " to " + planId);
            }
        }
        
        return mockPlan;
    }
}
