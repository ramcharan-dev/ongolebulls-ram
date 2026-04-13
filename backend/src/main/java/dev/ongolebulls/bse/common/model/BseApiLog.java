package dev.ongolebulls.bse.common.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "bse_api_logs", indexes = {
        @Index(name = "idx_bse_log_investor", columnList = "investor_id"),
        @Index(name = "idx_bse_log_api", columnList = "api_name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BseApiLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "api_name", nullable = false, length = 100)
    private String apiName;

    @Column(name = "investor_id")
    private Long investorId;

    @Column(name = "client_code", length = 20)
    private String clientCode;

    @Column(name = "http_status")
    private Integer httpStatus;

    @Column(name = "bse_status", length = 20)
    private String bseStatus;

    @Column(name = "bse_remarks", columnDefinition = "TEXT")
    private String bseRemarks;

    @Column(name = "masked_request_payload", columnDefinition = "TEXT")
    private String maskedRequestPayload;

    @Column(name = "response_payload", columnDefinition = "TEXT")
    private String responsePayload;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = Instant.now();
    }
}
