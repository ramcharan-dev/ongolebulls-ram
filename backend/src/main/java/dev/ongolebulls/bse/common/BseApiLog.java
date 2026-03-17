package dev.ongolebulls.bse.common;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "bse_api_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BseApiLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String apiName;

    private Long investorId;

    @Column(length = 20)
    private String clientCode;

    private int httpStatus;

    @Column(length = 20)
    private String bseStatus;

    @Column(columnDefinition = "TEXT")
    private String bseRemarks;

    @Column(columnDefinition = "LONGTEXT")
    private String maskedRequestPayload;

    @Column(columnDefinition = "LONGTEXT")
    private String responsePayload;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
    }
}
