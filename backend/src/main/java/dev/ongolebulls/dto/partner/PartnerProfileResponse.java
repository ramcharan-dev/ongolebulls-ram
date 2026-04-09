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
public class PartnerProfileResponse {
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String pan;
    private String arn;
    private String euin;
    private String euinHolderName;
    private String firmName;
    private String authorizedPerson;
    private String partnerBankAccount;
    private String partnerIfsc;
    private String partnerBankName;
    private String arnStatus;
    private String rejectionReason;
    private boolean isActivated;
    private boolean termsAccepted;
    private boolean declarationAccepted;
    private String role;
    private Instant createdAt;
    // Completion flags for onboarding checklist
    private boolean hasArn;
    private boolean hasBankDetails;
    private boolean hasAgreement;
}
