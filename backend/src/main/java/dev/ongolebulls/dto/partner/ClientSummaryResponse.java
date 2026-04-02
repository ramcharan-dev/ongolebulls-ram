package dev.ongolebulls.dto.partner;

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
    private String lifecycleStage;
    private String kycStatus;
    private Instant createdAt;
    private Instant lastActivityDate;
}
