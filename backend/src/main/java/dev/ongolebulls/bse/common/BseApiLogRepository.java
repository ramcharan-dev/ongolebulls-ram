package dev.ongolebulls.bse.common;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BseApiLogRepository extends JpaRepository<BseApiLog, Long> {

    List<BseApiLog> findByApiNameAndInvestorIdOrderByCreatedAtDesc(String apiName, Long investorId);

    List<BseApiLog> findByApiNameAndClientCodeOrderByCreatedAtDesc(String apiName, String clientCode);
}
