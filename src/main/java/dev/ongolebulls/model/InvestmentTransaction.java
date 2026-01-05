// InvestmentTransaction.java
package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "investment_transactions")
public class InvestmentTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "investor_id", nullable = false)
    private InvestorAccount investor;

    private String transactionId;
    private LocalDateTime transactionDate;
    private String type;
    private String schemeName;
    private String schemeCode;
    private BigDecimal amount;
    private BigDecimal units;
    private BigDecimal nav;
    private String status;
    private String transactionMode;

    // Getters and Setters
    // ...
}