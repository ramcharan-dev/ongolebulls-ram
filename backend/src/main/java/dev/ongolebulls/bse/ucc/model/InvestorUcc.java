package dev.ongolebulls.bse.ucc.model;

import dev.ongolebulls.model.InvestorAccount;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "investor_ucc")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestorUcc {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "investor_id", unique = true, nullable = false)
    private InvestorAccount investor;

    @Column(name = "ucc_code", length = 20)
    private String uccCode;

    @Column(name = "status", nullable = false, length = 20)
    private String status;

    @Column(name = "attempt_count", nullable = false)
    @Builder.Default
    private int attemptCount = 0;

    @Column(name = "last_error", columnDefinition = "TEXT")
    private String lastError;

    @Column(name = "remarks", columnDefinition = "TEXT")
    private String remarks;

    @Column(name = "regn_type", nullable = false, length = 20)
    @Builder.Default
    private String regnType = "NEW";

    @Column(name = "last_request_time")
    private Instant lastRequestTime;

    @Column(name = "last_response_time")
    private Instant lastResponseTime;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    @PrePersist
    public void prePersist() {
        Instant now = Instant.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }
}
