package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fund_plan_id", nullable = false)
    private FundPlan fundPlan;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private InvestmentType investmentType; // LUMPSUM or SIP

    @Column(precision = 10, scale = 2)
    private BigDecimal amount; // Investment amount

    @Column(precision = 10, scale = 2)
    private BigDecimal sipAmount; // Monthly SIP amount (if SIP)

    private Integer sipDuration; // SIP duration in months (if SIP)

    private LocalDateTime addedAt;

    @PrePersist
    protected void onCreate() {
        addedAt = LocalDateTime.now();
    }

    public enum InvestmentType {
        LUMPSUM, SIP
    }
}

