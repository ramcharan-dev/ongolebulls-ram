package dev.ongolebulls.dto.rm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PerformanceResponse {
    private long totalClients;
    private Map<String, Long> clientsByStage;
    private long activePartners;
    private long pendingPartners;
    private List<TopPartner> topPartners;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TopPartner {
        private int rank;
        private String partnerName;
        private long clients;
        private long activeInvestors;
        private boolean isActivated;
    }
}
