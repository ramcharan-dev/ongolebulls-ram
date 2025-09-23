package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
@Entity
public class FundSuggestion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fundName;
    private BigDecimal oneYearReturnPercent;
    private String tagline;

    @Enumerated(EnumType.STRING)
    private RiskProfile.RiskCategory suitedFor = RiskProfile.RiskCategory.MODERATE;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFundName() {
        return fundName;
    }

    public void setFundName(String fundName) {
        this.fundName = fundName;
    }

    public BigDecimal getOneYearReturnPercent() {
        return oneYearReturnPercent;
    }

    public String getTagline() {
        return tagline;
    }

    public void setTagline(String tagline) {
        this.tagline = tagline;
    }

    public RiskProfile.RiskCategory getSuitedFor() {
        return suitedFor;
    }

    public void setSuitedFor(RiskProfile.RiskCategory suitedFor) {
        this.suitedFor = suitedFor;
    }

    public void setOneYearReturnPercent(BigDecimal oneYearReturnPercent) {
        this.oneYearReturnPercent = oneYearReturnPercent;
    }
}
