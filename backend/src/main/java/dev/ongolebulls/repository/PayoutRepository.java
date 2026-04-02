package dev.ongolebulls.repository;

import dev.ongolebulls.model.Payout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PayoutRepository extends JpaRepository<Payout, Long> {
    List<Payout> findByPartnerId(Long partnerId);
    List<Payout> findByStatus(Payout.PayoutStatus status);
    List<Payout> findByPeriod(String period);
    long countByStatus(Payout.PayoutStatus status);
    List<Payout> findAllByOrderByCreatedAtDesc();
    List<Payout> findTop5ByStatusOrderByCreatedAtAsc(Payout.PayoutStatus status);
    List<Payout> findTop5ByStatusOrderByUpdatedAtDesc(Payout.PayoutStatus status);

    @Query("SELECT COALESCE(SUM(p.grossAmount), 0) FROM Payout p WHERE p.period = :period")
    BigDecimal sumGrossAmountByPeriod(@Param("period") String period);

    @Query("SELECT COALESCE(SUM(p.netAmount), 0) FROM Payout p WHERE p.period = :period AND p.status = 'RELEASED'")
    BigDecimal sumReleasedNetByPeriod(@Param("period") String period);

    @Query("SELECT DISTINCT p.period FROM Payout p ORDER BY p.period DESC")
    List<String> findDistinctPeriods();

    @Query("SELECT COALESCE(SUM(p.netAmount), 0) FROM Payout p WHERE p.status = 'PENDING'")
    BigDecimal sumPendingAmount();

    @Query("SELECT COALESCE(SUM(p.netAmount), 0) FROM Payout p WHERE p.status = 'RELEASED' AND p.payoutDate >= :startOfMonth")
    BigDecimal sumReleasedThisMonth(@Param("startOfMonth") java.time.LocalDate startOfMonth);

    List<Payout> findByStatusAndPeriod(Payout.PayoutStatus status, String period);

    @Query("SELECT COALESCE(SUM(p.gst), 0) FROM Payout p WHERE p.period = :period")
    BigDecimal sumGstByPeriod(@Param("period") String period);

    @Query("SELECT COALESCE(SUM(p.tds), 0) FROM Payout p WHERE p.period = :period")
    BigDecimal sumTdsByPeriod(@Param("period") String period);

    @Query("SELECT COALESCE(SUM(p.netAmount), 0) FROM Payout p WHERE p.period = :period AND p.status <> 'RELEASED'")
    BigDecimal sumPendingReleaseByPeriod(@Param("period") String period);
}
