package dev.ongolebulls.bse.nominee.repository;

import dev.ongolebulls.bse.nominee.model.InvestorNomineeRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InvestorNomineeRegistrationRepository extends JpaRepository<InvestorNomineeRegistration, Long> {

    List<InvestorNomineeRegistration> findByInvestorIdOrderByCreatedAtDesc(Long investorId);

    Optional<InvestorNomineeRegistration> findByInvestorIdAndStatus(Long investorId, String status);

    Optional<InvestorNomineeRegistration> findTopByInvestorIdOrderByCreatedAtDesc(Long investorId);
}