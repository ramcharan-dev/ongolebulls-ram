package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class PanInfo {
    private String pan;
    private String panExempt;
    private String panExemptCategory;
    private String kycVerified;
}
