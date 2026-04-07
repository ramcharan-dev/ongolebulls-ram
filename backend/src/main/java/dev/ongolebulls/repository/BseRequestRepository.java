package dev.ongolebulls.repository;

import dev.ongolebulls.model.BseRequest;
import dev.ongolebulls.model.BseRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BseRequestRepository extends JpaRepository<BseRequest, Long> {

    Optional<BseRequest> findByTransactionId(String transactionId);

    List<BseRequest> findTop50ByOrderByCreatedAtDesc();

    List<BseRequest> findByApiNameAndStatus(String apiName, BseRequestStatus status);
}
