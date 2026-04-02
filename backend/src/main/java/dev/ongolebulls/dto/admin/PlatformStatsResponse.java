package dev.ongolebulls.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PlatformStatsResponse {
    private long totalUsers;
    private long totalPartners;
    private long totalClients;
    private long totalInternalUsers;
    private long activePartners;
    private long pendingPartners;
    private Map<String, Long> partnersByType;
    private Map<String, Long> clientsByLifecycle;
    private Map<String, Long> internalUsersByRole;
    private long totalReferrals;
    private long convertedReferrals;
    private List<ActivityEntry> recentActivity;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ActivityEntry {
        private String action;
        private String entityType;
        private String entityName;
        private String performedByName;
        private LocalDateTime performedAt;
    }
}
