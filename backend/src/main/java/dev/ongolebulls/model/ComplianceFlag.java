package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_flags")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceFlag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entity_type", nullable = false)
    private String entityType;

    @Column(name = "entity_id", nullable = false)
    private Long entityId;

    @Column(name = "entity_name")
    private String entityName;

    @Column(name = "flag_type", nullable = false)
    private String flagType;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String reason;

    @Column(name = "flagged_by")
    private Long flaggedBy;

    @CreationTimestamp
    @Column(name = "flagged_at", updatable = false)
    private LocalDateTime flaggedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private FlagStatus status;

    @Column(name = "resolved_at")
    private LocalDateTime resolvedAt;

    @Column(name = "resolved_by")
    private Long resolvedBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public enum FlagStatus {
        OPEN, RESOLVED
    }
}
