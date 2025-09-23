package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
public class InvestmentTransaction {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) private InvestorAccount investor;

    private LocalDate txnDate;

    @Enumerated(EnumType.STRING)
    private TxnType type;

    private String fundName;
    private BigDecimal amount; // can be null for SIP_MISSED

    // getters/setters
    public Long getId() { return id; }
    public InvestorAccount getInvestor() { return investor; }
    public void setInvestor(InvestorAccount investor) { this.investor = investor; }
    public LocalDate getTxnDate() { return txnDate; }
    public void setTxnDate(LocalDate txnDate) { this.txnDate = txnDate; }
    public TxnType getType() { return type; }
    public void setType(TxnType type) { this.type = type; }
    public String getFundName() { return fundName; }
    public void setFundName(String fundName) { this.fundName = fundName; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}