package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "risk_profile")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RiskProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int score;
    private String category;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;
}
