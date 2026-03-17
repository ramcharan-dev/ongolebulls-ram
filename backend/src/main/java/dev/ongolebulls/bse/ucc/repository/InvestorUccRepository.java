package dev.ongolebulls.bse.ucc.repository;

import dev.ongolebulls.bse.ucc.model.InvestorUcc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestorUccRepository extends JpaRepository<InvestorUcc, Long> {

    Optional<InvestorUcc> findByInvestorId(Long investorId);

    List<InvestorUcc> findByStatus(String status);

    Optional<InvestorUcc> findByUccCode(String uccCode);
}
