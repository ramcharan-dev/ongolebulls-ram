package dev.ongolebulls.config;

import dev.ongolebulls.model.*;
import dev.ongolebulls.model.AlertType;
import dev.ongolebulls.repository.*;
import dev.ongolebulls.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Initializes dummy users with different investment data for testing
 * Run this once to populate the database with test data
 */
@Component
public class DummyDataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private InvestorAccountRepo investorAccountRepo;
    
    @Autowired
    private PortfolioPositionRepo portfolioPositionRepo;
    
    @Autowired
    private SipPlanRepo sipPlanRepo;
    
    @Autowired
    private InvestmentTransactionRepo transactionRepo;
    
    @Autowired
    private SmartAlertRepo alertRepo;
    
    @Autowired
    private FundSuggestionRepo fundRepo;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AdminUserRepository adminUserRepository;

    @Override
    public void run(String... args) {
        // Create default admin user if it doesn't exist
        createDefaultAdminUser();
        
        // Only create if users don't exist
        if (userRepository.count() == 0) {
            System.out.println("Creating dummy users with test data...");
            createDummyUsers();
            System.out.println("Dummy users created successfully!");
        } else {
            System.out.println("Users already exist. Skipping dummy data creation.");
        }
    }
    
    private void createDefaultAdminUser() {
        // Check if admin user exists
        if (adminUserRepository.findByEmail("admin@ongolebullsinvest.com").isEmpty()) {
            System.out.println("Creating default admin user...");
            AdminUser admin = new AdminUser();
            admin.setEmail("admin@ongolebullsinvest.com");
            admin.setPassword("admin123"); // Plain password (as per current implementation)
            admin.setName("Admin");
            adminUserRepository.save(admin);
            System.out.println("Default admin user created: admin@ongolebullsinvest.com / admin123");
        } else {
            System.out.println("Default admin user already exists.");
        }
    }

    private void createDummyUsers() {
        // User 1: Aggressive Investor with High Equity
        User user1 = createUser(1L, "Rajesh Kumar", "rajesh.kumar@ongolebulls.com", "9876543210", "password123");
        InvestorAccount acc1 = createInvestorAccount(user1, RiskProfile.RiskCategory.AGGRESSIVE);
        Object userId1 = getField(user1, "id");
        Long id1 = userId1 != null ? Long.valueOf(userId1.toString()) : 1L;
        createPortfolioData(acc1, id1, 500000.0, 600000.0, 0.70, 0.20, 0.05, 0.05);
        createSIPData(acc1, id1, 15000.0, 3);
        createTransactions(acc1, id1, 10);
        createAlerts(acc1, id1, 5);

        // User 2: Moderate Investor with Balanced Portfolio
        User user2 = createUser(2L, "Priya Sharma", "priya.sharma@ongolebulls.com", "9876543211", "password123");
        InvestorAccount acc2 = createInvestorAccount(user2, RiskProfile.RiskCategory.MODERATE);
        Object userId2 = getField(user2, "id");
        Long id2 = userId2 != null ? Long.valueOf(userId2.toString()) : 2L;
        createPortfolioData(acc2, id2, 300000.0, 330000.0, 0.50, 0.35, 0.10, 0.05);
        createSIPData(acc2, id2, 10000.0, 2);
        createTransactions(acc2, id2, 8);
        createAlerts(acc2, id2, 3);

        // User 3: Conservative Investor with High Debt
        User user3 = createUser(3L, "Amit Patel", "amit.patel@ongolebulls.com", "9876543212", "password123");
        InvestorAccount acc3 = createInvestorAccount(user3, RiskProfile.RiskCategory.CONSERVATIVE);
        Object userId3 = getField(user3, "id");
        Long id3 = userId3 != null ? Long.valueOf(userId3.toString()) : 3L;
        createPortfolioData(acc3, id3, 200000.0, 210000.0, 0.30, 0.50, 0.15, 0.05);
        createSIPData(acc3, id3, 5000.0, 1);
        createTransactions(acc3, id3, 5);
        createAlerts(acc3, id3, 2);
    }

    private User createUser(Long id, String fullName, String email, String mobile, String password) {
        User user = new User();
        // Use reflection to set fields
        setField(user, "id", id);
        setField(user, "fullName", fullName);
        setField(user, "email", email);
        setField(user, "mobileNumber", mobile);
        setField(user, "passwordHash", passwordEncoder.encode(password));
        setField(user, "termsAccepted", true);
        setField(user, "declarationAccepted", true);
        setField(user, "enabled", true);
        setField(user, "address", "123 Main Street");
        setField(user, "city", "Mumbai");
        setField(user, "state", "Maharashtra");
        setField(user, "pincode", "400001");
        return userRepository.save(user);
    }
    
    private void setField(Object obj, String fieldName, Object value) {
        try {
            java.lang.reflect.Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore if field doesn't exist
        }
    }
    
    private Object getField(Object obj, String fieldName) {
        try {
            java.lang.reflect.Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }

    private InvestorAccount createInvestorAccount(User user, RiskProfile.RiskCategory riskCategory) {
        InvestorAccount account = new InvestorAccount();
        Object fullName = getField(user, "fullName");
        Object email = getField(user, "email");
        account.setFullName(fullName != null ? fullName.toString() : "User");
        account.setEmail(email != null ? email.toString() : "");
        account.setRiskCategory(riskCategory);
        
        account = investorAccountRepo.save(account);
        setField(user, "investorAccount", account);
        userRepository.save(user);
        return account;
    }

    private void createPortfolioData(InvestorAccount account, Long userId, 
                                     double invested, double current, 
                                     double equityPct, double debtPct, 
                                     double liquidPct, double othersPct) {
        // Equity
        PortfolioPosition eq = new PortfolioPosition();
        eq.setInvestor(account);
        eq.setFundName("Axis Bluechip Fund");
        eq.setAssetClass(AssetClass.EQUITY);
        eq.setInvestedAmount(BigDecimal.valueOf(invested * equityPct));
        eq.setCurrentValue(BigDecimal.valueOf(current * equityPct));
        // Units field may not exist, use reflection if needed
        try {
            java.lang.reflect.Field unitsField = PortfolioPosition.class.getDeclaredField("units");
            unitsField.setAccessible(true);
            unitsField.set(eq, BigDecimal.valueOf(1000));
        } catch (Exception e) {
            // Units field doesn't exist, skip
        }
        portfolioPositionRepo.save(eq);

        // Debt
        PortfolioPosition debt = new PortfolioPosition();
        debt.setInvestor(account);
        debt.setFundName("HDFC Debt Fund");
        debt.setAssetClass(AssetClass.DEBT);
        debt.setInvestedAmount(BigDecimal.valueOf(invested * debtPct));
        debt.setCurrentValue(BigDecimal.valueOf(current * debtPct));
        try {
            java.lang.reflect.Field unitsField = PortfolioPosition.class.getDeclaredField("units");
            unitsField.setAccessible(true);
            unitsField.set(debt, BigDecimal.valueOf(500));
        } catch (Exception e) {
            // Skip
        }
        portfolioPositionRepo.save(debt);

        // Liquid
        PortfolioPosition liq = new PortfolioPosition();
        liq.setInvestor(account);
        liq.setFundName("ICICI Liquid Fund");
        liq.setAssetClass(AssetClass.LIQUID);
        liq.setInvestedAmount(BigDecimal.valueOf(invested * liquidPct));
        liq.setCurrentValue(BigDecimal.valueOf(current * liquidPct));
        try {
            java.lang.reflect.Field unitsField = PortfolioPosition.class.getDeclaredField("units");
            unitsField.setAccessible(true);
            unitsField.set(liq, BigDecimal.valueOf(200));
        } catch (Exception e) {
            // Skip
        }
        portfolioPositionRepo.save(liq);

        // Others
        PortfolioPosition oth = new PortfolioPosition();
        oth.setInvestor(account);
        oth.setFundName("Gold ETF");
        oth.setAssetClass(AssetClass.OTHERS);
        oth.setInvestedAmount(BigDecimal.valueOf(invested * othersPct));
        oth.setCurrentValue(BigDecimal.valueOf(current * othersPct));
        try {
            java.lang.reflect.Field unitsField = PortfolioPosition.class.getDeclaredField("units");
            unitsField.setAccessible(true);
            unitsField.set(oth, BigDecimal.valueOf(50));
        } catch (Exception e) {
            // Skip
        }
        portfolioPositionRepo.save(oth);
    }

    private void createSIPData(InvestorAccount account, Long userId, double monthlyAmount, int count) {
        for (int i = 1; i <= count; i++) {
            SipPlan sip = new SipPlan();
            sip.setInvestor(account);
            sip.setFundName("SIP Fund " + i);
            sip.setMonthlyAmount(BigDecimal.valueOf(monthlyAmount / count));
            sip.setNextSIPDate(LocalDate.now().plusDays(5));
            sip.setActive(true);
            sipPlanRepo.save(sip);
        }
    }

    private void createTransactions(InvestorAccount account, Long userId, int count) {
        String[] types = {"BUY", "SELL", "SIP", "DIVIDEND"};
        String[] funds = {"Axis Bluechip", "HDFC Debt", "ICICI Liquid", "Gold ETF"};
        
        for (int i = 0; i < count; i++) {
            InvestmentTransaction txn = new InvestmentTransaction();
            // Use reflection to set fields
            try {
                java.lang.reflect.Field investorField = InvestmentTransaction.class.getDeclaredField("investor");
                investorField.setAccessible(true);
                investorField.set(txn, account);
                
                java.lang.reflect.Field typeField = InvestmentTransaction.class.getDeclaredField("type");
                typeField.setAccessible(true);
                typeField.set(txn, types[i % types.length]);
                
                java.lang.reflect.Field schemeField = InvestmentTransaction.class.getDeclaredField("schemeName");
                schemeField.setAccessible(true);
                schemeField.set(txn, funds[i % funds.length]);
                
                java.lang.reflect.Field amountField = InvestmentTransaction.class.getDeclaredField("amount");
                amountField.setAccessible(true);
                amountField.set(txn, BigDecimal.valueOf(10000 + (i * 1000)));
                
                java.lang.reflect.Field dateField = InvestmentTransaction.class.getDeclaredField("transactionDate");
                dateField.setAccessible(true);
                dateField.set(txn, LocalDateTime.now().minusDays(i));
                
                java.lang.reflect.Field statusField = InvestmentTransaction.class.getDeclaredField("status");
                statusField.setAccessible(true);
                statusField.set(txn, "COMPLETED");
            } catch (Exception e) {
                System.err.println("Error creating transaction: " + e.getMessage());
                continue;
            }
            transactionRepo.save(txn);
        }
    }

    private void createAlerts(InvestorAccount account, Long userId, int count) {
        String[] messages = {
            "Your portfolio has gained 5% this month",
            "New fund recommendation based on your risk profile",
            "SIP payment due in 3 days",
            "Market update: Equity markets showing positive trends",
            "Rebalancing suggestion: Consider adjusting your asset allocation"
        };
        
        AlertType[] types = {AlertType.INFO, AlertType.GOAL, AlertType.NFO, AlertType.MATURITY, AlertType.INFO};
        
        for (int i = 0; i < count; i++) {
            SmartAlert alert = new SmartAlert();
            alert.setInvestor(account);
            alert.setMessage(messages[i % messages.length]);
            alert.setType(types[i % types.length]);
            alert.setCreatedAt(LocalDateTime.now().minusDays(i));
            alertRepo.save(alert);
        }
    }
}

