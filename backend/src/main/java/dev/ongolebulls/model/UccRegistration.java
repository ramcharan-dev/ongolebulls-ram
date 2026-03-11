package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "ucc_registrations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UccRegistration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long userId;

    @Column(length = 20)
    private String clientCode;

    @Column(nullable = false, length = 20)
    @Builder.Default
    private String status = "DRAFT";

    // Step 1 — Client Details
    @Column(columnDefinition = "LONGTEXT")
    private String clientDetailsJson;

    // Step 2 — Joint Holder
    @Column(columnDefinition = "LONGTEXT")
    private String jointHolderJson;

    // Step 3 — Guardian
    @Column(columnDefinition = "LONGTEXT")
    private String guardianJson;

    // Step 4 — PAN Details
    @Column(columnDefinition = "LONGTEXT")
    private String panDetailsJson;

    // Step 5 — Client Type
    @Column(columnDefinition = "LONGTEXT")
    private String clientTypeJson;

    // Step 6 — Bank Details
    @Column(columnDefinition = "LONGTEXT")
    private String bankDetailsJson;

    // Step 7 — Address
    @Column(columnDefinition = "LONGTEXT")
    private String addressJson;

    // Step 8 — Contact
    @Column(columnDefinition = "LONGTEXT")
    private String contactJson;

    // Step 9 — Communication
    @Column(columnDefinition = "LONGTEXT")
    private String communicationJson;

    // Step 10 — NRI Details
    @Column(columnDefinition = "LONGTEXT")
    private String nriDetailsJson;

    // Step 11 — KYC
    @Column(columnDefinition = "LONGTEXT")
    private String kycJson;

    // Step 12 — Aadhaar
    @Column(columnDefinition = "LONGTEXT")
    private String aadhaarJson;

    // Step 13 — Declaration
    @Column(columnDefinition = "LONGTEXT")
    private String declarationJson;

    // Step 14 — Nomination
    @Column(columnDefinition = "LONGTEXT")
    private String nominationJson;

    // Step 15 — Nominee Details
    @Column(columnDefinition = "LONGTEXT")
    private String nomineeDetailsJson;

    // BSE API response
    @Column(columnDefinition = "TEXT")
    private String bseResponse;

    @Column(columnDefinition = "TEXT")
    private String errorMessage;

    private int retryCount;

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
