package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class AddressDetails {
    private String address1;
    private String address2;
    private String address3;
    private String city;
    private String state;
    private String pincode;
    private String country;
}
