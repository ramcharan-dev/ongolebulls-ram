package dev.ongolebulls.repository;

import dev.ongolebulls.model.BankDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankRepository extends JpaRepository<BankDetails, Long> {}
