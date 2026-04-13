package dev.ongolebulls.repository;

import dev.ongolebulls.model.CommissionRule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommissionRuleRepository extends JpaRepository<CommissionRule, Long> {
    List<CommissionRule> findByIsActiveTrue();
    List<CommissionRule> findByAmcNameAndFundCategory(String amcName, CommissionRule.FundCategory fundCategory);
    List<CommissionRule> findAllByOrderByCreatedAtDesc();
    long countByIsActiveTrue();
}
