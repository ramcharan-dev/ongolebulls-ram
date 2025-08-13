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
//}
//*/package dev.ongolebulls.model;
//
//import jakarta.persistence.*;
//import java.time.LocalDateTime;
//
//@Entity
//public class User {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String username;
//    private String firstName;
//    private String lastName;
//    private String mobile;
//    private String password;
//
//    private String pan;
//    private String dob;
//    private String gender;
//    private String address;
//    private String pincode;
//    private String city;
//    private String state;
//
//    private String addressProofPath;
//    private String bankProofPath;
//    private String chequeProofPath;
//
//    private String accountHolder;
//    private String bankName;
//    private String accountNumber;
//    private String ifsc;
//
//    private Integer riskScore;
//
//    private String verificationToken;
//    private Boolean isActive;
//
//    private String role;
//    private String occupation;
//    private String incomeBracket;
//    private String aadhaar;
//
//    private String nomineeName;
//    private String nomineeRelation;
//    private String nomineeAge;
//
//    private LocalDateTime createdAt;
//
//    private String email;
//    private String verificationCode;
//    private boolean verified;
//
//    // Getters and Setters
//    public Long getId() { return id; }
//    public void setId(Long id) { this.id = id; }
//
//    public String getUsername() { return username; }
//    public void setUsername(String username) { this.username = username; }
//
//    public String getFirstName() { return firstName; }
//    public void setFirstName(String firstName) { this.firstName = firstName; }
//
//    public String getLastName() { return lastName; }
//    public void setLastName(String lastName) { this.lastName = lastName; }
//
//    public String getMobile() { return mobile; }
//    public void setMobile(String mobile) { this.mobile = mobile; }
//
//    public String getPassword() { return password; }
//    public void setPassword(String password) { this.password = password; }
//
//    public String getPan() { return pan; }
//    public void setPan(String pan) { this.pan = pan; }
//
//    public String getDob() { return dob; }
//    public void setDob(String dob) { this.dob = dob; }
//
//    public String getGender() { return gender; }
//    public void setGender(String gender) { this.gender = gender; }
//
//    public String getAddress() { return address; }
//    public void setAddress(String address) { this.address = address; }
//
//    public String getPincode() { return pincode; }
//    public void setPincode(String pincode) { this.pincode = pincode; }
//
//    public String getCity() { return city; }
//    public void setCity(String city) { this.city = city; }
//
//    public String getState() { return state; }
//    public void setState(String state) { this.state = state; }
//
//    public String getAddressProofPath() { return addressProofPath; }
//    public void setAddressProofPath(String addressProofPath) { this.addressProofPath = addressProofPath; }
//
//    public String getBankProofPath() { return bankProofPath; }
//    public void setBankProofPath(String bankProofPath) { this.bankProofPath = bankProofPath; }
//
//    public String getChequeProofPath() { return chequeProofPath; }
//    public void setChequeProofPath(String chequeProofPath) { this.chequeProofPath = chequeProofPath; }
//
//    public String getAccountHolder() { return accountHolder; }
//    public void setAccountHolder(String accountHolder) { this.accountHolder = accountHolder; }
//
//    public String getBankName() { return bankName; }
//    public void setBankName(String bankName) { this.bankName = bankName; }
//
//    public String getAccountNumber() { return accountNumber; }
//    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
//
//    public String getIfsc() { return ifsc; }
//    public void setIfsc(String ifsc) { this.ifsc = ifsc; }
//
//    public Integer getRiskScore() { return riskScore; }
//    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }
//
//    public String getVerificationToken() { return verificationToken; }
//    public void setVerificationToken(String verificationToken) { this.verificationToken = verificationToken; }
//
//    public Boolean getIsActive() { return isActive; }
//    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
//
//    public boolean isActive() {
//        return isActive != null && isActive;
//    }
//
//    public String getRole() { return role; }
//    public void setRole(String role) { this.role = role; }
//
//    public String getOccupation() { return occupation; }
//    public void setOccupation(String occupation) { this.occupation = occupation; }
//
//    public String getIncomeBracket() { return incomeBracket; }
//    public void setIncomeBracket(String incomeBracket) { this.incomeBracket = incomeBracket; }
//
//    public String getAadhaar() { return aadhaar; }
//    public void setAadhaar(String aadhaar) { this.aadhaar = aadhaar; }
//
//    public String getNomineeName() { return nomineeName; }
//    public void setNomineeName(String nomineeName) { this.nomineeName = nomineeName; }
//
//    public String getNomineeRelation() { return nomineeRelation; }
//    public void setNomineeRelation(String nomineeRelation) { this.nomineeRelation = nomineeRelation; }
//
//    public String getNomineeAge() { return nomineeAge; }
//    public void setNomineeAge(String nomineeAge) { this.nomineeAge = nomineeAge; }
//
//    public LocalDateTime getCreatedAt() { return createdAt; }
//    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
//
//    public String getEmail() { return email; }
//    public void setEmail(String email) { this.email = email; }
//
//    public String getVerificationCode() { return verificationCode; }
//    public void setVerificationCode(String verificationCode) { this.verificationCode = verificationCode; }
//
//    public boolean isVerified() {
//        return verified;
//    }
//
//    public void setVerified(boolean verified) {
//        this.verified = verified;
//    }
//
//    public void setIfscCode(String ifscCode) {
//    }
//
//    public void setAccountHolderName(Object accountHolderName) {
//    }
//}

package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    public enum ProfileFor {
        SELF,
        SPOUSE,
        PARENT,
        CHILD,
        OTHER
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "mobile", nullable = false, unique = true) // ✅ corrected field name
    private String mobile;

    @Column(nullable = false)
    private String passwordHash;

    private boolean emailVerified;
    private boolean mobileVerified;

    @Enumerated(EnumType.STRING)
    private ProfileFor profileFor;

    private String relation;
    private String relativeName;

    private boolean c1;
    private boolean c2;
    private boolean c3;
    private boolean c4;
    private boolean c5;

    private LocalDateTime consentTimestamp;
    private String deviceInfo;
    private String ipAddress;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "kyc_id")
    private KycDetails kycDetails;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "bank_id")
    private BankDetails bankDetails;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "risk_id")
    private RiskProfile riskProfile;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "consent_id")
    private Consent consent;

    @Column(nullable = false)
    private Instant createdAt = Instant.now();
}
