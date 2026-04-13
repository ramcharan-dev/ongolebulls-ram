package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class UccBankDetails {
    private String accountNumber;
    private String accountType;
    private String ifscCode;
    private String micrCode;
    private String bankName;
    private String branchName;
    private String branchAddress;
    private String branchCity;
    private String branchPincode;
}
