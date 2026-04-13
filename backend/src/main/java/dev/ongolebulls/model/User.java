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

import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

@Entity
@Table(
        name = "users",
        indexes = {
                @Index(name = "idx_users_assigned_location",
                        columnList = "assigned_state, assigned_district, assigned_city"),
                @Index(name = "idx_users_assigned_city",
                        columnList = "assigned_state, assigned_city"),
                @Index(name = "idx_users_partner_location",
                        columnList = "state, district")
        }
)
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

    @Column(nullable = true)
    private Boolean isForSelf = true; // default true



    private String relativeFullName;
    private String relativeRelation;

    private String dob;
    private String gender;
    private String address;
    private String city;
    private String state;
    private String pincode;

    // Partner location — captured during partner registration and used for
    // location-based RM auto-assignment. `city` above is reused for partners.
    @Column(name = "district")
    private String district;

    private String chequePath;
    private String kycProofPath;

    // --- Consents with defaults ---
    @Column(nullable = true)
    private Boolean termsAccepted = false;

    @Column(nullable = true)
    private Boolean declarationAccepted = false;

    @Column(nullable = true)
    private Boolean consentComm = false;

    @Column(nullable = true)
    private Boolean consentShareDocs = false;

    @Column(nullable = true)
    private Boolean consentShareWithProviders = false;

    @Column(nullable = true)
    private Boolean consentShareWithAmc = false;

    @Column(nullable = true)
    private Boolean understoodMarketRisk = false;

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

    @Column(nullable = true)
    private Boolean enabled = true;  // default to true

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "is_activated", nullable = true)
    private Boolean isActivated = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "arn_status", columnDefinition = "varchar(255) default 'NOT_SUBMITTED'")
    private ArnStatus arnStatus = ArnStatus.NOT_SUBMITTED;

    // --- Partner-specific fields ---
    private String firmName;
    private String authorizedPerson;
    private String pan;
    private String arn;
    private String euin;
    private String euinHolderName;
    private String partnerBankAccount;
    private String partnerIfsc;
    private String partnerBankName;

    // --- Partner referral & client tracking ---
    @Column(name = "referred_by")
    private Long referredBy;

    @Enumerated(EnumType.STRING)
    @Column(name = "lifecycle_stage")
    private LifecycleStage lifecycleStage;

    @Column(name = "assigned_partner_id")
    private Long assignedPartnerId;

    @Column(name = "last_cas_upload")
    private LocalDateTime lastCasUpload;

    @Column(name = "assigned_rm_id")
    private Long assignedRmId;

    // RM service area — populated only for users with RELATIONSHIP_MANAGER role.
    // Drives location-based RM auto-assignment during partner registration.
    @Column(name = "assigned_state")
    private String assignedState;

    @Column(name = "assigned_district")
    private String assignedDistrict;

    // Most-specific RM service area. When set, the RM handles that exact city
    // (case-insensitive), taking precedence over district-level and state-level
    // RMs in the auto-assignment fallback chain.
    @Column(name = "assigned_city")
    private String assignedCity;

    @Column(name = "rejection_reason")
    private String rejectionReason;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = Instant.now();
        // Ensure all Booleans have a default value if null
        if (isForSelf == null) isForSelf = true;
        if (termsAccepted == null) termsAccepted = false;
        if (declarationAccepted == null) declarationAccepted = false;
        if (consentComm == null) consentComm = false;
        if (consentShareDocs == null) consentShareDocs = false;
        if (consentShareWithProviders == null) consentShareWithProviders = false;
        if (consentShareWithAmc == null) consentShareWithAmc = false;
        if (understoodMarketRisk == null) understoodMarketRisk = false;
        if (enabled == null) enabled = true;
        if (isActivated == null) isActivated = false;
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
        return Boolean.TRUE.equals(enabled) && Boolean.TRUE.equals(termsAccepted) && Boolean.TRUE.equals(declarationAccepted);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + this.role.name()));
    }

    // --- Backward-compatible accessors for isActivated (Lombok changes getter name for Boolean) ---
    public boolean isActivated() {
        return Boolean.TRUE.equals(isActivated);
    }

    public void setActivated(Boolean activated) {
        this.isActivated = activated;
    }

    // --- Custom setters for nested objects ---
    public void setIsForSelf(Boolean isForSelf) {
        this.isForSelf = isForSelf;
    }

    public void setPanNumberEncrypted(String panNumber) {
        if (this.kycDetails == null) {
            this.kycDetails = new KycDetails();
        }
        this.kycDetails.setPanNumber(panNumber);
    }

    public void setConsentDeclared(Boolean declarationAccepted) {
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

    public void setMobile(@Pattern(regexp = "^[0-9]{10}$", message = "Mobile number must be 10 digits") String mobile) {
    }
}
