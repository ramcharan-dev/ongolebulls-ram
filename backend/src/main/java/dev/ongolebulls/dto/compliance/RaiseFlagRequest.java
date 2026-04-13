package dev.ongolebulls.dto.compliance;

import lombok.Data;

@Data
public class RaiseFlagRequest {
    private String entityType;
    private Long entityId;
    private String entityName;
    private String flagType;
    private String reason;
}
