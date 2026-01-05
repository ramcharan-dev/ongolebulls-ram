package dev.ongolebulls.controller;

import dev.ongolebulls.dto.NavGlossaryDto;
import dev.ongolebulls.dto.SipGlossaryDto;
import dev.ongolebulls.dto.EquityDebtGlossaryDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api/glossary")
@CrossOrigin(origins = "*")
public class GlossaryController {

    @GetMapping("/nav")
    public ResponseEntity<NavGlossaryDto> getNavGlossary() {
        // Create example
        NavGlossaryDto.NavExample example = new NavGlossaryDto.NavExample(
            "A mutual fund with ₹10 crores in assets",
            100000000.0,  // ₹10 crores
            2000000.0,    // ₹20 lakhs liabilities
            5000000L,     // 50 lakh units
            19.6,         // NAV = (100000000 - 2000000) / 5000000 = 19.6
            "If you invest ₹1,000, you'll get approximately 51 units (₹1,000 ÷ ₹19.6 = 51.02 units)"
        );

        // Create FAQs
        List<NavGlossaryDto.NavFaq> faqs = Arrays.asList(
            new NavGlossaryDto.NavFaq(
                "How often is NAV updated?",
                "NAV is calculated and updated daily at the end of each trading day. The NAV you see today reflects the fund's value as of the previous day's market close."
            ),
            new NavGlossaryDto.NavFaq(
                "Does a higher NAV mean a better fund?",
                "No, NAV alone doesn't indicate fund quality. A fund with NAV ₹50 can be better than one with NAV ₹100. Focus on returns, fund manager track record, expense ratio, and consistency of performance."
            ),
            new NavGlossaryDto.NavFaq(
                "Can NAV go below my investment amount?",
                "Yes, NAV can fluctuate based on market conditions. If the fund's underlying assets lose value, NAV decreases. This is normal market volatility, especially for equity funds."
            ),
            new NavGlossaryDto.NavFaq(
                "What's the difference between NAV and market price?",
                "NAV is the actual value per unit of a mutual fund, calculated from the fund's assets. Market price applies to stocks/ETFs traded on exchanges, which can differ from NAV due to supply and demand."
            ),
            new NavGlossaryDto.NavFaq(
                "Why do different funds have different NAVs?",
                "NAV depends on when the fund was launched, how many units were issued, and the fund's performance. A ₹10 NAV fund isn't necessarily better or worse than a ₹100 NAV fund."
            )
        );

        // Create glossary DTO
        NavGlossaryDto glossary = new NavGlossaryDto(
            "What is NAV?",
            "NAV (Net Asset Value) is the per-unit market value of a mutual fund. It represents the price at which you buy or sell fund units. NAV is calculated by dividing the total value of all assets in the fund (minus liabilities) by the total number of units outstanding.",
            "NAV = (Total Assets - Total Liabilities) / Total Number of Units",
            "Total Assets include all investments (stocks, bonds, cash, etc.) at their current market value. Total Liabilities include expenses, fees, and other obligations. The result gives you the value per unit.",
            example,
            faqs,
            LocalDateTime.now() // In production, fetch from database or fund data service
        );

        return ResponseEntity.ok(glossary);
    }

    @GetMapping("/sip")
    public ResponseEntity<SipGlossaryDto> getSipGlossary() {
        // Create step-by-step flow
        List<SipGlossaryDto.SipStep> steps = Arrays.asList(
            new SipGlossaryDto.SipStep(
                1,
                "Choose Your Fund",
                "Select a mutual fund that aligns with your financial goals and risk profile. You can choose equity, debt, or hybrid funds.",
                "bi-compass"
            ),
            new SipGlossaryDto.SipStep(
                2,
                "Set Amount & Date",
                "Decide how much you want to invest monthly (minimum ₹500) and choose a date (1st to 28th of each month) for automatic deduction.",
                "bi-calendar-check"
            ),
            new SipGlossaryDto.SipStep(
                3,
                "Auto-Debit Setup",
                "Link your bank account and authorize auto-debit. Your chosen amount will be automatically deducted on the selected date every month.",
                "bi-bank"
            ),
            new SipGlossaryDto.SipStep(
                4,
                "Units Allocated",
                "On each SIP date, your investment amount is used to buy fund units at that day's NAV. You get more units when NAV is low, fewer when high.",
                "bi-pie-chart"
            ),
            new SipGlossaryDto.SipStep(
                5,
                "Rupee Cost Averaging",
                "By investing regularly, you buy units at different NAVs over time. This averages out your purchase price and reduces the impact of market volatility.",
                "bi-graph-up"
            ),
            new SipGlossaryDto.SipStep(
                6,
                "Wealth Growth",
                "Your investment grows over time through compounding. You can pause, modify, or stop your SIP anytime without penalties.",
                "bi-trophy"
            )
        );

        // Create SIP example table
        List<SipGlossaryDto.SipExampleRow> exampleRows = Arrays.asList(
            new SipGlossaryDto.SipExampleRow(1, 5000.0, 50.0, 100.0, 100.0, 5000.0),
            new SipGlossaryDto.SipExampleRow(2, 5000.0, 45.0, 111.11, 211.11, 9500.0),
            new SipGlossaryDto.SipExampleRow(3, 5000.0, 55.0, 90.91, 302.02, 16611.1),
            new SipGlossaryDto.SipExampleRow(4, 5000.0, 48.0, 104.17, 406.19, 19497.12),
            new SipGlossaryDto.SipExampleRow(5, 5000.0, 52.0, 96.15, 502.34, 26121.68),
            new SipGlossaryDto.SipExampleRow(6, 5000.0, 50.0, 100.0, 602.34, 30117.0)
        );

        SipGlossaryDto.SipExampleTable exampleTable = new SipGlossaryDto.SipExampleTable(
            "6-Month SIP Example: ₹5,000/month in an Equity Fund",
            exampleRows,
            "After 6 months: Total Invested ₹30,000 | Total Value ₹30,117 | Returns ₹117 (0.39%) | Average NAV ₹50.17"
        );

        // Create FAQs
        List<SipGlossaryDto.SipFaq> faqs = Arrays.asList(
            new SipGlossaryDto.SipFaq(
                "Can I pause my SIP?",
                "Yes, you can pause your SIP for 1-3 months without any penalty. Simply contact your fund house or use the online portal. After the pause period, your SIP will automatically resume."
            ),
            new SipGlossaryDto.SipFaq(
                "Is SIP safe?",
                "SIPs invest in mutual funds, which are market-linked instruments. While they're not risk-free, SIPs reduce risk through rupee cost averaging. Debt funds are relatively safer than equity funds. Your investments are regulated by SEBI."
            ),
            new SipGlossaryDto.SipFaq(
                "What is the minimum SIP amount?",
                "Most mutual funds allow SIPs starting from ₹500 per month. Some funds may have higher minimums (₹1,000 or ₹5,000). You can increase your SIP amount anytime."
            ),
            new SipGlossaryDto.SipFaq(
                "Can I change my SIP amount?",
                "Yes, you can increase, decrease, or pause your SIP amount anytime. Changes typically take effect from the next billing cycle. Some funds also allow you to add a one-time top-up."
            ),
            new SipGlossaryDto.SipFaq(
                "What happens if I miss a SIP payment?",
                "If auto-debit fails due to insufficient funds, your SIP installment is skipped for that month. Your SIP continues the next month. Multiple consecutive failures (usually 3) may lead to SIP cancellation."
            ),
            new SipGlossaryDto.SipFaq(
                "How is SIP different from lump sum?",
                "SIP allows you to invest small amounts regularly, reducing the impact of market timing. Lump sum is a one-time large investment. SIP is better for disciplined, long-term wealth creation, while lump sum works if you have a large amount and market timing is favorable."
            )
        );

        // Create glossary DTO
        SipGlossaryDto glossary = new SipGlossaryDto(
            "How SIPs Work",
            "SIP (Systematic Investment Plan) is a disciplined way to invest in mutual funds. You invest a fixed amount regularly (monthly) regardless of market conditions, which helps you build wealth over time through rupee cost averaging and compounding.",
            "https://www.instagram.com/reel/DRgiqyxlR2U/", // Instagram Reel URL
            "https://www.instagram.com/reel/DRgiqyxlR2U/embed/", // Instagram embed URL for iframe
            steps,
            exampleTable,
            faqs,
            LocalDateTime.now()
        );

        return ResponseEntity.ok(glossary);
    }

    @GetMapping("/equity-debt")
    public ResponseEntity<EquityDebtGlossaryDto> getEquityDebtGlossary() {
        // Equity Information
        EquityDebtGlossaryDto.EquityInfo equity = new EquityDebtGlossaryDto.EquityInfo(
            "Equity funds invest primarily in stocks/shares of companies. Your money is invested in ownership stakes of businesses, which means you participate in their growth and profits.",
            Arrays.asList(
                "Higher growth potential (12-15% annual returns historically)",
                "Beats inflation over long term",
                "Wealth creation for long-term goals",
                "Diversification across sectors and companies"
            ),
            Arrays.asList(
                "High volatility - values can fluctuate significantly",
                "Not suitable for short-term goals (< 3 years)",
                "Market risk - can lose value during downturns",
                "Requires patience and discipline"
            ),
            "High",
            "12-15% annually (long-term average)",
            "5+ years (ideal for long-term wealth creation)"
        );

        // Debt Information
        EquityDebtGlossaryDto.DebtInfo debt = new EquityDebtGlossaryDto.DebtInfo(
            "Debt funds invest in fixed-income instruments like bonds, government securities, and corporate debt. Your money is lent to entities in exchange for regular interest payments.",
            Arrays.asList(
                "Stable returns with lower volatility",
                "Predictable income through interest",
                "Lower risk compared to equity",
                "Suitable for short to medium-term goals"
            ),
            Arrays.asList(
                "Lower returns (6-8% annually)",
                "May not beat inflation in long run",
                "Interest rate risk",
                "Credit risk (default by borrower)"
            ),
            "Low to Moderate",
            "6-8% annually (varies by fund type)",
            "1-3 years (ideal for short-term goals)"
        );

        // Comparison Table
        List<EquityDebtGlossaryDto.ComparisonRow> comparisonRows = Arrays.asList(
            new EquityDebtGlossaryDto.ComparisonRow("Risk Level", "High - Market volatility", "Low to Moderate - Stable"),
            new EquityDebtGlossaryDto.ComparisonRow("Returns Potential", "12-15% p.a. (long-term)", "6-8% p.a."),
            new EquityDebtGlossaryDto.ComparisonRow("Volatility", "High - Can fluctuate 20-30%", "Low - Stable returns"),
            new EquityDebtGlossaryDto.ComparisonRow("Time Horizon", "5+ years recommended", "1-3 years suitable"),
            new EquityDebtGlossaryDto.ComparisonRow("Inflation Beating", "Yes - Beats inflation", "May not always beat"),
            new EquityDebtGlossaryDto.ComparisonRow("Best For", "Long-term wealth creation", "Short-term goals, stability"),
            new EquityDebtGlossaryDto.ComparisonRow("Taxation", "LTCG: 10% after 1 year (over ₹1L)", "LTCG: 20% with indexation after 3 years"),
            new EquityDebtGlossaryDto.ComparisonRow("Liquidity", "High - Can redeem anytime", "High - Can redeem anytime")
        );

        EquityDebtGlossaryDto.ComparisonTable comparisonTable = new EquityDebtGlossaryDto.ComparisonTable(comparisonRows);

        EquityDebtGlossaryDto.EquityDebtComparison comparison = new EquityDebtGlossaryDto.EquityDebtComparison(
            equity,
            debt,
            comparisonTable
        );

        // When to Choose
        List<EquityDebtGlossaryDto.WhenToChoose> whenToChoose = Arrays.asList(
            new EquityDebtGlossaryDto.WhenToChoose(
                "EQUITY",
                "Long-term goals (5+ years)",
                "Equity funds are ideal for goals like retirement (20+ years away), child's education (10+ years), or wealth creation. Time allows you to ride out market volatility."
            ),
            new EquityDebtGlossaryDto.WhenToChoose(
                "EQUITY",
                "Young investor with high risk appetite",
                "If you're in your 20s-30s and can handle market ups and downs, equity can help build significant wealth over decades."
            ),
            new EquityDebtGlossaryDto.WhenToChoose(
                "DEBT",
                "Short-term goals (1-3 years)",
                "Debt funds are perfect for goals like vacation, down payment, or emergency fund. Lower risk ensures your money is safe when you need it."
            ),
            new EquityDebtGlossaryDto.WhenToChoose(
                "DEBT",
                "Conservative investor or nearing retirement",
                "If you're risk-averse or close to retirement, debt funds provide stability and regular income without market volatility."
            ),
            new EquityDebtGlossaryDto.WhenToChoose(
                "BOTH",
                "Balanced portfolio",
                "A mix of equity (60-70%) and debt (30-40%) balances growth and stability. This is ideal for moderate risk investors."
            )
        );

        // FAQs
        List<EquityDebtGlossaryDto.EquityDebtFaq> faqs = Arrays.asList(
            new EquityDebtGlossaryDto.EquityDebtFaq(
                "Which grows faster - Equity or Debt?",
                "Equity funds typically grow faster over the long term (5+ years) with 12-15% annual returns. Debt funds grow slower but steadily at 6-8% annually. However, equity has higher volatility, while debt is more stable."
            ),
            new EquityDebtGlossaryDto.EquityDebtFaq(
                "Can I lose money in equity funds?",
                "Yes, equity funds are subject to market risk. In the short term (1-2 years), you may see losses during market downturns. However, over the long term (5+ years), equity funds have historically delivered positive returns."
            ),
            new EquityDebtGlossaryDto.EquityDebtFaq(
                "Are debt funds completely safe?",
                "Debt funds are safer than equity but not risk-free. They carry credit risk (borrower default) and interest rate risk. However, they're much more stable than equity and suitable for conservative investors."
            ),
            new EquityDebtGlossaryDto.EquityDebtFaq(
                "Should I invest only in equity or debt?",
                "A balanced portfolio with both equity and debt is recommended. The ratio depends on your age, risk appetite, and goals. A common rule: (100 - your age)% in equity, rest in debt. For example, at 30 years: 70% equity, 30% debt."
            ),
            new EquityDebtGlossaryDto.EquityDebtFaq(
                "Which is better for tax saving?",
                "For tax saving under Section 80C, ELSS (Equity Linked Savings Scheme) funds are popular as they offer tax deduction and equity exposure. However, they have a 3-year lock-in. Debt funds offer indexation benefits for LTCG after 3 years."
            )
        );

        // Create glossary DTO
        EquityDebtGlossaryDto glossary = new EquityDebtGlossaryDto(
            "Equity vs Debt",
            "Understanding the difference between equity and debt funds is crucial for making informed investment decisions. Equity funds offer higher growth potential but with higher risk, while debt funds provide stability with lower returns.",
            comparison,
            faqs,
            whenToChoose,
            LocalDateTime.now()
        );

        return ResponseEntity.ok(glossary);
    }
}

