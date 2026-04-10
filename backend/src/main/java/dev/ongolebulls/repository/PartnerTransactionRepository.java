package dev.ongolebulls.repository;

import dev.ongolebulls.model.PartnerTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface PartnerTransactionRepository extends JpaRepository<PartnerTransaction, Long> {

    List<PartnerTransaction> findByPartnerIdOrderByCreatedAtDesc(Long partnerId);

    List<PartnerTransaction> findByPartnerIdAndTypeOrderByCreatedAtDesc(Long partnerId, PartnerTransaction.TxnKind type);

    List<PartnerTransaction> findByPartnerIdAndStatusOrderByCreatedAtDesc(Long partnerId, PartnerTransaction.TxnStatus status);

    long countByPartnerId(Long partnerId);

    long countByPartnerIdAndType(Long partnerId, PartnerTransaction.TxnKind type);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM PartnerTransaction t WHERE t.partnerId = :pid AND t.status IN ('SUBMITTED', 'CONFIRMED')")
    BigDecimal sumActiveAmountByPartner(@Param("pid") Long partnerId);

    @Query("SELECT COALESCE(SUM(t.amount), 0) FROM PartnerTransaction t WHERE t.partnerId = :pid AND t.type = :type AND t.status IN ('SUBMITTED', 'CONFIRMED')")
    BigDecimal sumActiveAmountByPartnerAndType(@Param("pid") Long partnerId, @Param("type") PartnerTransaction.TxnKind type);
}
