package dev.ongolebulls.repository;

import dev.ongolebulls.model.InvestorAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InvestorAccountRepo extends JpaRepository<InvestorAccount, Long> {
}
