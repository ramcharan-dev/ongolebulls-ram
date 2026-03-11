package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Identity fields ---
    @Column(nullable = false, unique = true, length = 512) // encrypted PAN
    private String panNumber;

    @Column(unique = true, length = 12)
    private String aadhaarNumber; // optional

    private String occupation;
    private String employerName; // ✅ added
    private String annualIncomeRange; // e.g., "1–5 LPA", "5–10 LPA"
    private String incomeRange; // ✅ added alternative field if needed
    private String riskTolerance; // Low / Medium / High

    // --- Nominee Details ---
    private String nomineeName;
    private String nomineeRelation;
    private LocalDate nomineeDob;

    // --- Status tracking ---
    private boolean verified = false;

    private LocalDateTime verifiedAt; // ✅ changed to LocalDateTime

    @PrePersist
    protected void onCreate() {
        if (verifiedAt == null && verified) {
            verifiedAt = LocalDateTime.now();
        }
    }
}
