package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientSummaryResponse {
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private boolean isActivated;
    private Instant createdAt;
    private String kycStatus;         // "Not Started" for now — TODO: join KycDetails
    private String assignedPartnerName; // null for now — TODO: track partner-client mapping
}
