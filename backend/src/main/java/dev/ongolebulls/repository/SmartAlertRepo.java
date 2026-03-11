package dev.ongolebulls.repository;

import dev.ongolebulls.model.SmartAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SmartAlertRepo extends JpaRepository<SmartAlert, Long> {
    List<SmartAlert> findTop10ByInvestor_IdOrderByCreatedAtDesc(Long investorId);
}
