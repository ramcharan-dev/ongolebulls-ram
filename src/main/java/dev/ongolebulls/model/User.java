///*
//package dev.ongolebulls.model;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//
//@Entity
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String username;
//
//    @JsonProperty("fname")
//    private String firstName;
//
//    @JsonProperty("lname")
//    private String lastName;
//
//    private String mobile;
//    private String password;
//
//    // Getters and Setters
//    public Long getId() {
//        return id;
//    }
//
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getFirstName() {
//        return firstName;
//    }
//
//    public void setFirstName(String firstName) {
//        this.firstName = firstName;
//    }
//
//    public String getLastName() {
//        return lastName;
//    }
//
//    public void setLastName(String lastName) {
//        this.lastName = lastName;
//    }
//
//    public String getMobile() {
//        return mobile;
//    }
//
//    public void setMobile(String mobile) {
//        this.mobile = mobile;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//}*/
//package dev.ongolebulls.model;
//
//import com.fasterxml.jackson.annotation.JsonProperty;
//import jakarta.persistence.*;
//
//@Entity
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String username;
//
//    @JsonProperty("fname")
//    private String firstName;
//
//    @JsonProperty("lname")
//    private String lastName;
//
//    private String mobile;
//    private String password;
//
//    // ==== Extra Fields for multi-step registration ====
//    private String panNumber;
//    private String aadhaarNumber;
//    private String email;
//
//    private String accountHolderName;
//    private String bankName;
//    private String ifscCode;
//    private String accountNumberEncrypted;
//
//    private String occupation;
//    private String employerName;
//    private String incomeRange;
//
//    private boolean declarationAccepted;
//
//    // ===== Getters and Setters =====
//    public Long getId() {
//        return id;
//    }
//    public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getFirstName() {
//        return firstName;
//    }
//    public void setFirstName(String firstName) {
//        this.firstName = firstName;
//    }
//
//    public String getLastName() {
//        return lastName;
//    }
//    public void setLastName(String lastName) {
//        this.lastName = lastName;
//    }
//
//    public String getMobile() {
//        return mobile;
//    }
//    public void setMobile(String mobile) {
//        this.mobile = mobile;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//    public void setPassword(String password) {
//        this.password = password;
//    }
//
//    public String getPanNumber() {
//        return panNumber;
//    }
//    public void setPanNumber(String panNumber) {
//        this.panNumber = panNumber;
//    }
//
//    public String getAadhaarNumber() {
//        return aadhaarNumber;
//    }
//    public void setAadhaarNumber(String aadhaarNumber) {
//        this.aadhaarNumber = aadhaarNumber;
//    }
//
//    public String getEmail() {
//        return email;
//    }
//    public void setEmail(String email) {
//        this.email = email;
//    }
//
//    public String getAccountHolderName() {
//        return accountHolderName;
//    }
//    public void setAccountHolderName(String accountHolderName) {
//        this.accountHolderName = accountHolderName;
//    }
//
//    public String getBankName() {
//        return bankName;
//    }
//    public void setBankName(String bankName) {
//        this.bankName = bankName;
//    }
//
//    public String getIfscCode() {
//        return ifscCode;
//    }
//    public void setIfscCode(String ifscCode) {
//        this.ifscCode = ifscCode;
//    }
//
//    public String getAccountNumberEncrypted() {
//        return accountNumberEncrypted;
//    }
//    public void setAccountNumberEncrypted(String accountNumberEncrypted) {
//        this.accountNumberEncrypted = accountNumberEncrypted;
//    }
//
//    public String getOccupation() {
//        return occupation;
//    }
//    public void setOccupation(String occupation) {
//        this.occupation = occupation;
//    }
//
//    public String getEmployerName() {
//        return employerName;
//    }
//    public void setEmployerName(String employerName) {
//        this.employerName = employerName;
//    }
//
//    public String getIncomeRange() {
//        return incomeRange;
//    }
//    public void setIncomeRange(String incomeRange) {
//        this.incomeRange = incomeRange;
//    }
//
//    public boolean isDeclarationAccepted() {
//        return declarationAccepted;
//    }
//    public void setDeclarationAccepted(boolean declarationAccepted) {
//        this.declarationAccepted = declarationAccepted;
//    }
//}



package dev.ongolebulls.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.Instant;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fullName;


    @Column(unique = true, nullable = false)
    private String email;

    @Pattern(
            regexp = "^(\\+91[\\s-]?)?[0-9]{10}$",
            message = "Mobile number must be 10 digits with optional +91 prefix"
    )
    @Column(name = "mobile", nullable = false, length = 255, unique = true)
    private String mobileNumber;

    @Column(nullable = true)
    private String passwordHash;

    private boolean isForSelf = true; // default true



    private String relativeFullName;
    private String relativeRelation;

    private String dob;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;

    private String chequePath;
    private String kycProofPath;

    // --- Consents with defaults ---
    @Column(nullable = false)
    private boolean termsAccepted = false;

    @Column(nullable = false)
    private boolean declarationAccepted = false;

    @Column(nullable = false)
    private boolean consentComm = false;

    @Column(nullable = false)
    private boolean consentShareDocs = false;

    @Column(nullable = false)
    private boolean consentShareWithProviders = false;

    @Column(nullable = false)
    private boolean consentShareWithAmc = false;

    @Column(nullable = false)
    private boolean understoodMarketRisk = false;

    private String consentDeviceId;
    private String consentIp;
    private Instant consentTimestamp;

    // --- Relations ---
    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "risk_id")
    private RiskProfile riskProfile;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "kyc_id")
    private KycDetails kycDetails;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "bank_id")
    private BankDetails bankDetails;

    // --- Audit fields ---
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private boolean enabled = true;  // default to true

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        // Ensure all booleans have a default value if not set
        if (!isForSelf) isForSelf = true;
        if (!termsAccepted) termsAccepted = false;
        if (!declarationAccepted) declarationAccepted = false;
        if (!consentComm) consentComm = false;
        if (!consentShareDocs) consentShareDocs = false;
        if (!consentShareWithProviders) consentShareWithProviders = false;
        if (!consentShareWithAmc) consentShareWithAmc = false;
        if (!understoodMarketRisk) understoodMarketRisk = false;
        if (!enabled) enabled = true;
    }

    // --- Security (Spring Security integration) ---
    @Override
    public String getPassword() {
        return passwordHash;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled && termsAccepted && declarationAccepted;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();
    }

    // --- Custom setters for nested objects ---
    public void setIsForSelf(boolean isForSelf) {
        this.isForSelf = isForSelf;
    }

    public void setPanNumberEncrypted(String panNumber) {
        if (this.kycDetails == null) {
            this.kycDetails = new KycDetails();
        }
        this.kycDetails.setPanNumber(panNumber);
    }

    public void setConsentDeclared(boolean declarationAccepted) {
        this.declarationAccepted = declarationAccepted;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setKycDetails(KycDetails kycDetails) {
        this.kycDetails = kycDetails;
    }

    public void setBankDetails(BankDetails bankDetails) {
        this.bankDetails = bankDetails;
    }

    public void setRiskProfile(RiskProfile riskProfile) {
        this.riskProfile = riskProfile;
    }

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "investor_id")
    private InvestorAccount investorAccount;

    public void setPassword(String encode) {

    }
}
