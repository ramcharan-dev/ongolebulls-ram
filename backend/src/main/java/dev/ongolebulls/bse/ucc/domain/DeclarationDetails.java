package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

@Data
public class DeclarationDetails {
    private String pepFlag;
    private String foreignTaxFlag;
    private String sourceOfWealth;
    private String grossAnnualIncome;
    private String netWorth;
    private String netWorthDate;
}
