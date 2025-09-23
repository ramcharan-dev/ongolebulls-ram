package dev.ongolebulls.dto;

import dev.ongolebulls.model.RiskProfile;

import java.util.List;
import java.util.Map;

public class DashboardPayload {
    // Portfolio KPIs
    public String netWorth;
    public String investedAmount;
    public String currentValue;
    public String xirr;

    // Asset Allocation
    public Map<String,Integer> allocationPercent; // {Equity:60, Debt:25,...}

    // SIP
    public SipSummary sip;

    // Risk profile
    public RiskProfile riskProfile;

    // Lists
    public List<TxnRow> recentTransactions;
    public List<FundCard> topFunds;
    public List<AlertCard> smartAlerts;
}
