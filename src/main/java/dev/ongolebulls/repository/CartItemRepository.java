package dev.ongolebulls.repository;

import dev.ongolebulls.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    
    @Query("SELECT ci FROM CartItem ci WHERE ci.user.id = :userId AND ci.fundPlan.id = :planId AND ci.investmentType = :investmentType")
    Optional<CartItem> findByUserIdAndFundPlanIdAndInvestmentType(
            @Param("userId") Long userId,
            @Param("planId") Long planId,
            @Param("investmentType") CartItem.InvestmentType investmentType
    );
    
    void deleteByUserId(Long userId);
}

