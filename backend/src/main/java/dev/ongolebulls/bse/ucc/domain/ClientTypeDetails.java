package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class ClientTypeDetails {
    private String holdingNature;
    private String taxStatus;
    private String clientType;
    private String divPayMode;
}
