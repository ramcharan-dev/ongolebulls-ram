package dev.ongolebulls.repository;

import dev.ongolebulls.model.RedemptionRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RedemptionRequestRepo extends JpaRepository<RedemptionRequest, Long> {
    List<RedemptionRequest> findByUserId(Long userId);
}
