package dev.ongolebulls.model;

import jakarta.persistence.*;
@Entity
@Table(name = "investor_accounts")
public class InvestorAccount {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;
    private String email;

    @Enumerated(EnumType.STRING)
    private RiskProfile.RiskCategory riskCategory = RiskProfile.RiskCategory.MODERATE;

    // getters/setters...

    public Long getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public RiskProfile.RiskCategory getRiskCategory() {
        return riskCategory;
    }

    public void setRiskCategory(RiskProfile.RiskCategory riskCategory) {
        this.riskCategory = riskCategory;
    }

    public void setId(Long id) {
        this.id = id;
        
    }

    public RiskProfile getRiskProfile() {
        return RiskProfile.builder()
                .category(this.riskCategory)
                .score(0)              // or calculate default score
                .answersJson(null)     // optional
                .build();
    }

}
