package dev.ongolebulls.dto.rm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RMPartnerSummary {
    private Long id;
    private String fullName;
    private String firmName;
    private String email;
    private String mobileNumber;
    private String partnerType;
    private String arn;
    private String pan;
    private String euin;
    private String partnerBankAccount;
    private String partnerIfsc;
    private String partnerBankName;
    private boolean isActivated;
    private long clientCount;
    private Instant createdAt;
    private String notes;
}
