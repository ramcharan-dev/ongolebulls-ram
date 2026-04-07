package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "bse_responses")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BseResponse {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_id", nullable = false)
    private String transactionId;

    @Column(name = "api_name", nullable = false)
    private String apiName;

    @Column(name = "http_status")
    private Integer httpStatus;

    @Column(name = "encrypted_response", columnDefinition = "TEXT")
    private String encryptedResponse;

    @Column(name = "decrypted_response", columnDefinition = "TEXT")
    private String decryptedResponse;

    @Column(name = "bse_status")
    private String bseStatus;

    @Column(name = "bse_message", columnDefinition = "TEXT")
    private String bseMessage;

    @CreationTimestamp
    @Column(name = "received_at", updatable = false)
    private LocalDateTime receivedAt;
}
