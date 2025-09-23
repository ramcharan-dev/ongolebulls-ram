package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "risk_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;

    @Enumerated(EnumType.STRING)
    private RiskCategory category;

    @Column(columnDefinition = "TEXT")
    private String answersJson;

    public enum RiskCategory {
        CONSERVATIVE,
        MODERATE,
        AGGRESSIVE
    }
}

