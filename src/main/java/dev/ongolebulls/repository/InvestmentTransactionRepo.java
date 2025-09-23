package dev.ongolebulls.repository;


import dev.ongolebulls.model.InvestmentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestmentTransactionRepo extends JpaRepository<InvestmentTransaction, Long> {
    List<InvestmentTransaction> findTop10ByInvestor_IdOrderByTxnDateDesc(Long investorId);
}
