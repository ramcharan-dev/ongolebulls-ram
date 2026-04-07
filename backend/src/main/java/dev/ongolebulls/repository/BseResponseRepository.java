package dev.ongolebulls.repository;

import dev.ongolebulls.model.BseResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BseResponseRepository extends JpaRepository<BseResponse, Long> {

    Optional<BseResponse> findByTransactionId(String transactionId);
}
