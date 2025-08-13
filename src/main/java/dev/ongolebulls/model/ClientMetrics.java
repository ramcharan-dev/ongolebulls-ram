package dev.ongolebulls.model;

import jakarta.persistence.*;

@Entity
@Table(name = "client_metrics")
public class ClientMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private double investment;
    private double currentValue;
    private double profitLoss;
    private double absoluteReturn;
    private double xirr;

    // Getters and setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public double getInvestment() { return investment; }
    public void setInvestment(double investment) { this.investment = investment; }

    public double getCurrentValue() { return currentValue; }
    public void setCurrentValue(double currentValue) { this.currentValue = currentValue; }

    public double getProfitLoss() { return profitLoss; }
    public void setProfitLoss(double profitLoss) { this.profitLoss = profitLoss; }

    public double getAbsoluteReturn() { return absoluteReturn; }
    public void setAbsoluteReturn(double absoluteReturn) { this.absoluteReturn = absoluteReturn; }

    public double getXirr() { return xirr; }
    public void setXirr(double xirr) { this.xirr = xirr; }
}