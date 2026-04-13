package dev.ongolebulls.dto.compliance;

import lombok.*;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PartnerRiskResponse {
    private Long id;
    private String fullName;
    private String firmName;
    private String email;
    private String partnerType;
    private boolean isActivated;
    private boolean missingArn;
    private boolean missingEuin;
    private boolean missingBankDetails;
    private long openFlagsCount;
    private Instant createdAt;
}
