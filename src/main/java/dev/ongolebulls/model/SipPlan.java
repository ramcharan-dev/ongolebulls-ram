package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class SipPlan {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) private InvestorAccount investor;

    private String fundName;
    private BigDecimal monthlyAmount;
    private LocalDate nextSIPDate;
    private boolean active;

    // getters/setters
    public Long getId() { return id; }
    public InvestorAccount getInvestor() { return investor; }
    public void setInvestor(InvestorAccount investor) { this.investor = investor; }
    public String getFundName() { return fundName; }
    public void setFundName(String fundName) { this.fundName = fundName; }
    public BigDecimal getMonthlyAmount() { return monthlyAmount; }
    public void setMonthlyAmount(BigDecimal monthlyAmount) { this.monthlyAmount = monthlyAmount; }
    public LocalDate getNextSIPDate() { return nextSIPDate; }
    public void setNextSIPDate(LocalDate nextSIPDate) { this.nextSIPDate = nextSIPDate; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}