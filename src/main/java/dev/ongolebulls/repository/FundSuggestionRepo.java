package dev.ongolebulls.repository;


import dev.ongolebulls.model.FundSuggestion;
import dev.ongolebulls.model.RiskProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FundSuggestionRepo extends JpaRepository<FundSuggestion, Long> {
    List<FundSuggestion> findTop6BySuitedForOrderByOneYearReturnPercentDesc(RiskProfile.RiskCategory suitedFor);
}
