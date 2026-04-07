package dev.ongolebulls.bse.elog.repository;

import dev.ongolebulls.bse.elog.model.InvestorElog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestorElogRepository extends JpaRepository<InvestorElog, Long> {

    Optional<InvestorElog> findByInvestorIdAndStatus(Long investorId, String status);

    List<InvestorElog> findByInvestorIdOrderByCreatedAtDesc(Long investorId);

    Optional<InvestorElog> findByIntRefNo(String intRefNo);

    Optional<InvestorElog> findTopByInvestorIdOrderByCreatedAtDesc(Long investorId);

    Optional<InvestorElog> findTopByClientCodeOrderByCreatedAtDesc(String clientCode);
}
