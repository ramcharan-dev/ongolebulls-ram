package dev.ongolebulls.bse.elog.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "investor_elogs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InvestorElog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long investorId;

    @Column(nullable = false, length = 20)
    private String clientCode;

    @Column(length = 50)
    private String intRefNo;

    @Column(columnDefinition = "TEXT")
    private String elogUrl;

    @Column(length = 20)
    private String bseStatus;

    @Column(columnDefinition = "TEXT")
    private String bseMessage;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

    @Column(name = "callback_status", length = 20)
    @Builder.Default
    private String callbackStatus = "PENDING";

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    private Instant verifiedAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
