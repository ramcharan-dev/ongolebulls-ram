package dev.ongolebulls.repository;

import dev.ongolebulls.model.BseToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BseTokenRepository extends JpaRepository<BseToken, Long> {

    Optional<BseToken> findTopByIsActiveTrueOrderByObtainedAtDesc();
}
