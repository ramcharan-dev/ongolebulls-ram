package dev.ongolebulls.service;

import dev.ongolebulls.dto.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.*;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

@Service
@Transactional(readOnly = true)
public class DashboardService {

    private final UserRepository userRepo;
    private final InvestorAccountRepo investorRepo;
    private final PortfolioPositionRepo positionRepo;
    private final SipPlanRepo sipRepo;
    private final InvestmentTransactionRepo txnRepo;
    private final SmartAlertRepo alertRepo;
    private final FundSuggestionRepo fundRepo;

    public DashboardService(UserRepository userRepo,
                            InvestorAccountRepo investorRepo,
                            PortfolioPositionRepo positionRepo,
                            SipPlanRepo sipRepo,
                            InvestmentTransactionRepo txnRepo,
                            SmartAlertRepo alertRepo,
                            FundSuggestionRepo fundRepo) {
        this.userRepo = userRepo;
        this.investorRepo = investorRepo;
        this.positionRepo = positionRepo;
        this.sipRepo = sipRepo;
        this.txnRepo = txnRepo;
        this.alertRepo = alertRepo;
        this.fundRepo = fundRepo;
    }

    public DashboardPayload load(Long userId) {
        var user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var investorAccount = user.getInvestorAccount();
        if (investorAccount == null) {
            // User has no investor account; return default payload
            var emptyPayload = new DashboardPayload();
            emptyPayload.netWorth = "₹0";
            emptyPayload.investedAmount = "₹0";
            emptyPayload.currentValue = "₹0";
            emptyPayload.xirr = "0%";
            emptyPayload.allocationPercent = Map.of(
                    "Equity", 0,
                    "Debt", 0,
                    "Liquid", 0,
                    "Others", 0
            );
            emptyPayload.sip = new SipSummary(); // default empty
            emptyPayload.recentTransactions = Collections.emptyList();
            emptyPayload.topFunds = Collections.emptyList();
            emptyPayload.smartAlerts = Collections.emptyList();
            emptyPayload.riskProfile = null;
            return emptyPayload;
        }

        var investor = investorRepo.findById(investorAccount.getId())
                .orElseThrow(() -> new IllegalArgumentException("Investor not found"));

        Long investorId = investor.getId();

        var positions = positionRepo.findByInvestor_Id(investorId);

        BigDecimal invested = positions.stream()
                .map(PortfolioPosition::getInvestedAmount)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal current = positions.stream()
                .map(PortfolioPosition::getCurrentValue)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal xirr = invested.signum() == 0
                ? BigDecimal.ZERO
                : current.subtract(invested)
                .divide(invested, 6, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100));

        // Allocation %
        Map<AssetClass, BigDecimal> byClass = new EnumMap<>(AssetClass.class);
        for (AssetClass ac : AssetClass.values()) byClass.put(ac, BigDecimal.ZERO);

        positions.forEach(p -> byClass.put(p.getAssetClass(),
                byClass.get(p.getAssetClass()).add(
                        p.getCurrentValue() == null ? BigDecimal.ZERO : p.getCurrentValue()
                )));

        Map<String, Integer> alloc = new LinkedHashMap<>();
        if (current.signum() > 0) {
            byClass.forEach((k, v) -> {
                int pct = v.multiply(BigDecimal.valueOf(100))
                        .divide(current, 0, RoundingMode.HALF_UP)
                        .intValue();
                alloc.put(cap(k.name()), pct);
            });
        } else {
            alloc.put("Equity", 0);
            alloc.put("Debt", 0);
            alloc.put("Liquid", 0);
            alloc.put("Others", 0);
        }

        // SIP summary
        var activeSips = sipRepo.findByInvestor_IdAndActiveTrue(investorId);
        var sip = new SipSummary();
        sip.activeCount = activeSips.size();
        sip.totalMonthly = activeSips.stream()
                .map(SipPlan::getMonthlyAmount).filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        sip.nextSIPDate = activeSips.stream().map(SipPlan::getNextSIPDate)
                .filter(Objects::nonNull).min(LocalDate::compareTo).orElse(null);
        sip.missedCount = (int) txnRepo.findTop10ByInvestor_IdOrderByTxnDateDesc(investorId)
                .stream().filter(t -> t.getType() == TxnType.SIP_MISSED).count();

        // Recent transactions
        var txns = txnRepo.findTop10ByInvestor_IdOrderByTxnDateDesc(investorId).stream().map(t -> {
            var row = new TxnRow();
            row.date = t.getTxnDate().toString();
            row.action = formatTxn(t.getType());
            row.fund = t.getFundName();
            row.amount = t.getAmount() == null ? "—" : "₹" + t.getAmount();
            return row;
        }).toList();

        // Alerts
        var alerts = alertRepo.findTop10ByInvestor_IdOrderByCreatedAtDesc(investorId).stream().map(a -> {
            var card = new AlertCard();
            card.message = a.getMessage();
            card.createdAt = a.getCreatedAt().toString();
            return card;
        }).toList();

        var funds = fundRepo.findTop6BySuitedForOrderByOneYearReturnPercentDesc(
                        investor.getRiskProfile().getCategory())
                .stream()
                .map(f -> {
                    var c = new FundCard();
                    c.name = f.getFundName();
                    c.oneYearReturn = f.getOneYearReturnPercent() == null ? "-" : f.getOneYearReturnPercent() + "%";
                    c.tagline = f.getTagline();
                    return c;
                })
                .toList();

        var payload = new DashboardPayload();
        payload.netWorth = "₹" + current;
        payload.investedAmount = "₹" + invested;
        payload.currentValue = "₹" + current;
        payload.xirr = xirr.setScale(2, RoundingMode.HALF_UP) + "%";
        payload.allocationPercent = ensureOrder(alloc);
        payload.sip = sip;
        payload.riskProfile = investor.getRiskProfile();
        payload.recentTransactions = txns;
        payload.topFunds = funds;
        payload.smartAlerts = alerts;

        return payload;
    }

    private static String formatTxn(TxnType t) {
        return switch (t) {
            case SIP_EXECUTED -> "SIP Executed";
            case REDEMPTION -> "Redemption";
            case SIP_MISSED -> "SIP Missed";
            case PURCHASE -> "Purchase";
        };
    }

    private static Map<String, Integer> ensureOrder(Map<String, Integer> in) {
        // Return in Equity,Debt,Liquid,Others order for chart UX
        Map<String, Integer> m = new LinkedHashMap<>();
        m.put("Equity", in.getOrDefault("Equity", 0));
        m.put("Debt", in.getOrDefault("Debt", 0));
        m.put("Liquid", in.getOrDefault("Liquid", 0));
        m.put("Others", in.getOrDefault("Others", 0));
        return m;
    }

    private static String cap(String s) {
        return s.substring(0, 1).toUpperCase() + s.substring(1).toLowerCase();
    }

    public List<Map<String, Object>> getAssetAllocation(Long userId) {
        var user = userRepo.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        var investorAccount = Optional.ofNullable(user.getInvestorAccount())
                .orElseThrow(() -> new IllegalArgumentException("InvestorAccount not found"));

        Long investorId = investorAccount.getId();

        return PortfolioPositionRepo.findAssetAllocationByInvestorId(investorId);
    }

}
