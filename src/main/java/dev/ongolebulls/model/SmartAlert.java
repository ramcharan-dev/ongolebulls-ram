package dev.ongolebulls.model;


import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class SmartAlert {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional=false) private InvestorAccount investor;

    @Enumerated(EnumType.STRING)
    private AlertType type;

    @Column(length=500)
    private String message;

    private LocalDateTime createdAt = LocalDateTime.now();

    // getters/setters
    public Long getId() { return id; }
    public InvestorAccount getInvestor() { return investor; }
    public void setInvestor(InvestorAccount investor) { this.investor = investor; }
    public AlertType getType() { return type; }
    public void setType(AlertType type) { this.type = type; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
