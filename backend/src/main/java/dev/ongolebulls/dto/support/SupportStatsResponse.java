package dev.ongolebulls.dto.support;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SupportStatsResponse {
    private long openTickets;
    private long inProgressTickets;
    private long resolvedToday;
    private long myOpenTickets;
    private long highPriorityOpen;
    private double avgResolutionHours;
}
