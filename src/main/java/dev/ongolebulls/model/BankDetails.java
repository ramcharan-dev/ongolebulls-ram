package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bank_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BankDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // --- Required Fields ---
    @Column(name = "account_holder_name", nullable = false)
    private String accountHolderName;

    @Column(name = "bank_name", nullable = false)
    private String bankName;

    @Column(name = "account_number_encrypted", nullable = false, unique = true, length = 255)
    private String accountNumberEncrypted;

    @Column(name = "ifsc", nullable = false, length = 20)
    private String ifsc;

    // --- Validations ---
    @Column(name = "name_matches_pan")
    private boolean nameMatchesPan = false;

    // --- Reverse Mapping (optional) ---
    @OneToOne(mappedBy = "bankDetails")
    private User user;

    // convenience setter (optional)
    public void setIfscCode(String ifscCode) {
        this.ifsc = ifscCode;
    }
}
