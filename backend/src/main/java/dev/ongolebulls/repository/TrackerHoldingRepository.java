package dev.ongolebulls.repository;

import dev.ongolebulls.model.TrackerHolding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TrackerHoldingRepository extends JpaRepository<TrackerHolding, Long> {

    List<TrackerHolding> findByPartnerIdOrderByUploadDateDescAmcName(Long partnerId);

    @Transactional
    void deleteByPartnerId(Long partnerId);

    @Query(value = "SELECT t.client_name AS clientName, COUNT(DISTINCT t.amc_name) AS amcCount, " +
            "SUM(t.current_value) AS totalValue " +
            "FROM tracker_holdings t WHERE t.partner_id = :partnerId " +
            "GROUP BY t.client_name HAVING COUNT(DISTINCT t.amc_name) > 1 " +
            "ORDER BY SUM(t.current_value) DESC", nativeQuery = true)
    List<Object[]> findCobOpportunities(@Param("partnerId") Long partnerId);
}
