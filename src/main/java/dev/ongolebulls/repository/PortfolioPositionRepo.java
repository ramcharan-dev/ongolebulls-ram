package dev.ongolebulls.repository;

import dev.ongolebulls.model.PortfolioPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface PortfolioPositionRepo extends JpaRepository<PortfolioPosition, Long> {
    List<PortfolioPosition> findByInvestor_Id(Long investorId);

    @Query("SELECT new map(p.assetClass as assetClass, SUM(p.currentValue) as totalValue) " +
            "FROM PortfolioPosition p WHERE p.investor.id = :investorId GROUP BY p.assetClass")
    static List<Map<String, Object>> findAssetAllocationByInvestorId(@Param("investorId") Long investorId) {
        return null;
    }
}
