package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminStatsResponse {
    private long totalPartners;
    private long activePartners;
    private long pendingActivation;
    private long totalClients;
    private List<UserSummaryResponse> recentPartners;
    private List<UserSummaryResponse> recentInternalUsers;
}
