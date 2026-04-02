package dev.ongolebulls.dto.compliance;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceFlagResponse {
    private Long id;
    private String entityType;
    private Long entityId;
    private String entityName;
    private String flagType;
    private String reason;
    private Long flaggedBy;
    private String flaggedByName;
    private LocalDateTime flaggedAt;
    private String status;
    private LocalDateTime resolvedAt;
    private Long resolvedBy;
    private String resolvedByName;
    private String notes;
}
