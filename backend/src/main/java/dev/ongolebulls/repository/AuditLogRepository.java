package dev.ongolebulls.repository;

import dev.ongolebulls.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByEntityTypeAndEntityId(String entityType, Long entityId);
    List<AuditLog> findAllByOrderByPerformedAtDesc();
    List<AuditLog> findByPerformedAtAfter(LocalDateTime after);
    long countByPerformedAtAfter(LocalDateTime after);
}
