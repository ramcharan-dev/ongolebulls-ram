package dev.ongolebulls.bse.nominee.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "investor_nominee_registration")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestorNomineeRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long investorId;

    @Column(nullable = false, length = 20)
    private String clientCode;

    @Column(length = 100)
    private String nomineeName;

    @Column(length = 50)
    private String relationship;

    private int nomineePercentage;

    @Column(length = 10)
    private String nomineeDob;

    @Column(length = 100)
    private String guardianName;

    @Column(length = 20)
    private String guardianPan;

    @Column(length = 20)
    private String bseStatus;

    @Column(columnDefinition = "TEXT")
    private String bseMessage;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = Instant.now();
    }
}