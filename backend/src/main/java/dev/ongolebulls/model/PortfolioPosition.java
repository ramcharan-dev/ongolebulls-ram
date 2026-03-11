package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class PortfolioPosition {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) private InvestorAccount investor;

    private String fundName;

    @Enumerated(EnumType.STRING)
    private AssetClass assetClass;

    private BigDecimal investedAmount;   // total invested
    private BigDecimal currentValue;     // current market value

    // getters/setters
    public Long getId() { return id; }
    public InvestorAccount getInvestor() { return investor; }
    public void setInvestor(InvestorAccount investor) { this.investor = investor; }
    public String getFundName() { return fundName; }
    public void setFundName(String fundName) { this.fundName = fundName; }
    public AssetClass getAssetClass() { return assetClass; }
    public void setAssetClass(AssetClass assetClass) { this.assetClass = assetClass; }
    public BigDecimal getInvestedAmount() { return investedAmount; }
    public void setInvestedAmount(BigDecimal investedAmount) { this.investedAmount = investedAmount; }
    public BigDecimal getCurrentValue() { return currentValue; }
    public void setCurrentValue(BigDecimal currentValue) { this.currentValue = currentValue; }
}