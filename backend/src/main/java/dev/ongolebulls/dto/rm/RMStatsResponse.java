package dev.ongolebulls.dto.rm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RMStatsResponse {
    private long totalPartners;
    private long activePartners;
    private long pendingActivation;
    private long totalClients;
    private List<RMPartnerSummary> pendingPartners;
    private List<RMPartnerSummary> recentPartners;
}
