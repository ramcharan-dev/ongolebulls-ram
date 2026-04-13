package dev.ongolebulls.dto.compliance;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuditLogResponse {
    private Long id;
    private String entityType;
    private Long entityId;
    private String action;
    private Long performedBy;
    private String performedByName;
    private LocalDateTime performedAt;
    private String oldValue;
    private String newValue;
    private String notes;
}
