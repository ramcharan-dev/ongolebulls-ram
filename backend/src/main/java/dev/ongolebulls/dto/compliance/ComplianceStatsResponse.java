package dev.ongolebulls.dto.compliance;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ComplianceStatsResponse {
    private long openFlags;
    private long resolvedToday;
    private long partnersUnderReview;
    private long pendingApprovals;
    private long totalAuditLogsToday;
}
