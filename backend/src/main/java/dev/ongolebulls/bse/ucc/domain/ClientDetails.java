package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class ClientDetails {
    private String clientCode;
    private String firstName;
    private String middleName;
    private String lastName;
    private String taxStatus;
    private String gender;
    private String dob;
    private String occupationCode;
    private String holdingNature;
}
