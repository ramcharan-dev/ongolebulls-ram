package dev.ongolebulls.repository;

import dev.ongolebulls.model.SIPInstallment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface SIPInstallmentRepository extends JpaRepository<SIPInstallment, Long> {
    List<SIPInstallment> findBySipIdOrderByInstallmentDateDesc(Long sipId);
    List<SIPInstallment> findByUserIdOrderByInstallmentDateDesc(Long userId);
    List<SIPInstallment> findBySipIdAndStatus(Long sipId, String status);
    List<SIPInstallment> findByUserIdAndStatus(Long userId, String status);
    List<SIPInstallment> findBySipIdAndInstallmentDateBetween(Long sipId, LocalDate startDate, LocalDate endDate);
    @Query("SELECT i FROM SIPInstallment i WHERE i.sipId = :sipId ORDER BY i.installmentDate DESC")
    List<SIPInstallment> findRecentBySipId(@Param("sipId") Long sipId);
}

