package dev.ongolebulls.repository;

import dev.ongolebulls.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OtpRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByTargetAndConsumedFalseOrderByExpiresAtDesc(String target);
}