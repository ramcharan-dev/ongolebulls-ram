package dev.ongolebulls.repository;
import dev.ongolebulls.model.ClientMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface ClientMetricsRepository extends JpaRepository<ClientMetrics, Long> {
    Optional<ClientMetrics> findByUsername(String username);
}