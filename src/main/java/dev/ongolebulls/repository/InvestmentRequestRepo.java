package dev.ongolebulls.repository;

import dev.ongolebulls.model.InvestmentRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InvestmentRequestRepo extends JpaRepository<InvestmentRequest, Long> {
    List<InvestmentRequest> findByUserId(Long userId);
}
