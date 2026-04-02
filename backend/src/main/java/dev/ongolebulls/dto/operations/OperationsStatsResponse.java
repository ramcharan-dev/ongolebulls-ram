package dev.ongolebulls.dto.operations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OperationsStatsResponse {
    private long pendingActivation;
    private long activatedToday;
    private long clientsInKycQueue;
    private long activatedThisMonth;
    private List<PartnerVerificationResponse> urgentPartners;
}
