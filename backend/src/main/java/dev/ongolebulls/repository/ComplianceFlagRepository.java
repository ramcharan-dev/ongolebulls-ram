package dev.ongolebulls.repository;

import dev.ongolebulls.model.ComplianceFlag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ComplianceFlagRepository extends JpaRepository<ComplianceFlag, Long> {
    List<ComplianceFlag> findByStatusOrderByFlaggedAtDesc(ComplianceFlag.FlagStatus status);
    List<ComplianceFlag> findByEntityTypeAndEntityId(String entityType, Long entityId);
    long countByStatus(ComplianceFlag.FlagStatus status);
    List<ComplianceFlag> findAllByOrderByFlaggedAtDesc();
    long countByStatusAndResolvedAtAfter(ComplianceFlag.FlagStatus status, LocalDateTime after);
    long countByEntityIdAndStatus(Long entityId, ComplianceFlag.FlagStatus status);
    List<ComplianceFlag> findByEntityTypeOrderByFlaggedAtDesc(String entityType);
    long countByStatusAndEntityTypeAndEntityIdIn(ComplianceFlag.FlagStatus status, String entityType, java.util.Collection<Long> entityIds);
}
