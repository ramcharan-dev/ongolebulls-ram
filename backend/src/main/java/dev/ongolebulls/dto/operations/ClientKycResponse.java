package dev.ongolebulls.dto.operations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ClientKycResponse {
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String lifecycleStage;
    private String kycStatus;
    private String assignedPartnerName;
    private Long assignedPartnerId;
    private long daysSinceRegistration;
    private Instant createdAt;
}
