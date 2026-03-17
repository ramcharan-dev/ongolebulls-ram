package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class UccKycDetails {
    private String ckycNumber;
    private String kycVerified;
    private String kycType;
}
