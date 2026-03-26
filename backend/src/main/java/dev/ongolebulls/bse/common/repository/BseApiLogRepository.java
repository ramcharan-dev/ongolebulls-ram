package dev.ongolebulls.bse.common.repository;

import dev.ongolebulls.bse.common.model.BseApiLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BseApiLogRepository extends JpaRepository<BseApiLog, Long> {

    List<BseApiLog> findByInvestorIdAndApiName(Long investorId, String apiName);

    List<BseApiLog> findByApiNameOrderByCreatedAtDesc(String apiName);

    List<BseApiLog> findByClientCode(String clientCode);

    List<BseApiLog> findByApiNameAndInvestorIdOrderByCreatedAtDesc(String apiName, Long investorId);

    List<BseApiLog> findByApiNameAndClientCodeOrderByCreatedAtDesc(String apiName, String clientCode);
}
