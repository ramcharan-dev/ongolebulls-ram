package dev.ongolebulls.dto;

import dev.ongolebulls.dto.TransactionDto;
import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

//package dev.ongolebulls.dto;
//
//import dev.ongolebulls.model.RiskProfile;
//
//import java.util.List;
//import java.util.Map;
//
//public class DashboardPayload {
//    // Portfolio KPIs
//    public String netWorth;
//    public String investedAmount;
//    public String currentValue;
//    public String xirr;
//
//    // Asset Allocation
//    public Map<String,Integer> allocationPercent; // {Equity:60, Debt:25,...}
//
//    // SIP
//    public SipSummary sip;
//
//    // Risk profile
//    public RiskProfile riskProfile;
//
//    // Lists
//    public List<TxnRow> recentTransactions;
//    public List<FundCard> topFunds;
//    public List<AlertCard> smartAlerts;
//}

import lombok.Data;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class DashboardPayload {

    private Double netWorth = 0.0;
    private Double investedAmount = 0.0;
    private Double currentValue = 0.0;
    private Double xirr = 0.0;

    private String riskProfile = "MODERATE";

    private Map<String, Double> allocationPercent = new HashMap<>();

    private SipSummaryDto sip = new SipSummaryDto();

    private List<TransactionDto> recentTransactions = new ArrayList<>();
    private List<FundDto> topFunds = new ArrayList<>();
    private List<AlertDto> smartAlerts = new ArrayList<>();
}
