package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Setter;

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

    private String accountHolderName;      // ✅ matches AuthService
    private String bankName;
    private String accountNumberEncrypted; // ✅ matches AuthService
    private String ifscCode;                // ✅ matches AuthService
    private String chequeProofPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public void setAccountHolder(String accountHolder) {
    }

    public void setAccountNumber(String accountNumber) {
    }

    public void setIfsc(String ifsc) {

    }
}
