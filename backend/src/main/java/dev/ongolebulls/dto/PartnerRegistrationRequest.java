package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class PartnerRegistrationRequest {
    private String partnerType; // "INDIVIDUAL_PARTNER" or "NON_INDIVIDUAL_PARTNER"
    private String email;
    private String mobile;
    private String password;
    private String fullName;
    private String firmName;
    private String authorizedPerson;
    private String pan;
    private String arn;
    private String euin;
    private String euinHolderName;
    private String bankAccount;
    private String ifsc;
    private String bankName;
}
