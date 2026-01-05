package dev.ongolebulls.repository;

import dev.ongolebulls.model.FundPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface FundPlanRepository extends JpaRepository<FundPlan, Long> {
    List<FundPlan> findByFundId(Long fundId);
    
    @Query("SELECT fp FROM FundPlan fp WHERE fp.fund.id = :fundId AND fp.planType = :planType AND fp.optionType = :optionType")
    Optional<FundPlan> findByFundIdAndPlanTypeAndOptionType(
            @Param("fundId") Long fundId,
            @Param("planType") FundPlan.PlanType planType,
            @Param("optionType") FundPlan.OptionType optionType
    );
}

