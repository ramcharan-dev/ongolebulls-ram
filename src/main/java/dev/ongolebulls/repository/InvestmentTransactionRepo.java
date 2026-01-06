// InvestmentTransactionRepo.java
package dev.ongolebulls.repository;

import dev.ongolebulls.model.InvestmentTransaction;
import dev.ongolebulls.model.InvestorAccount;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvestmentTransactionRepo extends JpaRepository<InvestmentTransaction, Long> {
    Page<InvestmentTransaction> findByInvestorId(Long investorId, Pageable pageable);
    // Other query methods...
}