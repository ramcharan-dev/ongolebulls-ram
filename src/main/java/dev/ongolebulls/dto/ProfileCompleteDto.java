package dev.ongolebulls.dto;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class ProfileCompleteDto {
    // Personal Details
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String gender;
    private String dob;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private boolean isForSelf;
    private String relativeFullName;
    private String relativeRelation;
    private Instant createdAt;
    private Instant lastUpdatedAt;
    private String lastUpdatedIp;

    // KYC Details
    private String panNumber; // masked
    private String aadhaarNumber; // masked
    private String occupation;
    private String employerName;
    private String annualIncomeRange;
    private String riskTolerance;
    private boolean kycVerified;
    private LocalDateTime kycVerifiedAt;

    // Bank Details
    private String bankName;
    private String accountNumber; // masked
    private String ifsc;
    private String accountHolderName;
    private boolean nameMatchesPan;

    // Nominee Details (from KYC)
    private String nomineeName;
    private String nomineeRelation;
    private LocalDate nomineeDob;

    // Risk Profile
    private String riskCategory;
    private Integer riskScore;

    // Consents
    private boolean termsAccepted;
    private boolean declarationAccepted;
    private boolean consentComm;
    private boolean consentShareDocs;
    private boolean consentShareWithProviders;
    private boolean consentShareWithAmc;
    private boolean understoodMarketRisk;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getDob() { return dob; }
    public void setDob(String dob) { this.dob = dob; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }

    public boolean isForSelf() { return isForSelf; }
    public void setForSelf(boolean forSelf) { isForSelf = forSelf; }

    public String getRelativeFullName() { return relativeFullName; }
    public void setRelativeFullName(String relativeFullName) { this.relativeFullName = relativeFullName; }

    public String getRelativeRelation() { return relativeRelation; }
    public void setRelativeRelation(String relativeRelation) { this.relativeRelation = relativeRelation; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getLastUpdatedAt() { return lastUpdatedAt; }
    public void setLastUpdatedAt(Instant lastUpdatedAt) { this.lastUpdatedAt = lastUpdatedAt; }

    public String getLastUpdatedIp() { return lastUpdatedIp; }
    public void setLastUpdatedIp(String lastUpdatedIp) { this.lastUpdatedIp = lastUpdatedIp; }

    public String getPanNumber() { return panNumber; }
    public void setPanNumber(String panNumber) { this.panNumber = panNumber; }

    public String getAadhaarNumber() { return aadhaarNumber; }
    public void setAadhaarNumber(String aadhaarNumber) { this.aadhaarNumber = aadhaarNumber; }

    public String getOccupation() { return occupation; }
    public void setOccupation(String occupation) { this.occupation = occupation; }

    public String getEmployerName() { return employerName; }
    public void setEmployerName(String employerName) { this.employerName = employerName; }

    public String getAnnualIncomeRange() { return annualIncomeRange; }
    public void setAnnualIncomeRange(String annualIncomeRange) { this.annualIncomeRange = annualIncomeRange; }

    public String getRiskTolerance() { return riskTolerance; }
    public void setRiskTolerance(String riskTolerance) { this.riskTolerance = riskTolerance; }

    public boolean isKycVerified() { return kycVerified; }
    public void setKycVerified(boolean kycVerified) { this.kycVerified = kycVerified; }

    public LocalDateTime getKycVerifiedAt() { return kycVerifiedAt; }
    public void setKycVerifiedAt(LocalDateTime kycVerifiedAt) { this.kycVerifiedAt = kycVerifiedAt; }

    public String getBankName() { return bankName; }
    public void setBankName(String bankName) { this.bankName = bankName; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getIfsc() { return ifsc; }
    public void setIfsc(String ifsc) { this.ifsc = ifsc; }

    public String getAccountHolderName() { return accountHolderName; }
    public void setAccountHolderName(String accountHolderName) { this.accountHolderName = accountHolderName; }

    public boolean isNameMatchesPan() { return nameMatchesPan; }
    public void setNameMatchesPan(boolean nameMatchesPan) { this.nameMatchesPan = nameMatchesPan; }

    public String getNomineeName() { return nomineeName; }
    public void setNomineeName(String nomineeName) { this.nomineeName = nomineeName; }

    public String getNomineeRelation() { return nomineeRelation; }
    public void setNomineeRelation(String nomineeRelation) { this.nomineeRelation = nomineeRelation; }

    public LocalDate getNomineeDob() { return nomineeDob; }
    public void setNomineeDob(LocalDate nomineeDob) { this.nomineeDob = nomineeDob; }

    public String getRiskCategory() { return riskCategory; }
    public void setRiskCategory(String riskCategory) { this.riskCategory = riskCategory; }

    public Integer getRiskScore() { return riskScore; }
    public void setRiskScore(Integer riskScore) { this.riskScore = riskScore; }

    public boolean isTermsAccepted() { return termsAccepted; }
    public void setTermsAccepted(boolean termsAccepted) { this.termsAccepted = termsAccepted; }

    public boolean isDeclarationAccepted() { return declarationAccepted; }
    public void setDeclarationAccepted(boolean declarationAccepted) { this.declarationAccepted = declarationAccepted; }

    public boolean isConsentComm() { return consentComm; }
    public void setConsentComm(boolean consentComm) { this.consentComm = consentComm; }

    public boolean isConsentShareDocs() { return consentShareDocs; }
    public void setConsentShareDocs(boolean consentShareDocs) { this.consentShareDocs = consentShareDocs; }

    public boolean isConsentShareWithProviders() { return consentShareWithProviders; }
    public void setConsentShareWithProviders(boolean consentShareWithProviders) { this.consentShareWithProviders = consentShareWithProviders; }

    public boolean isConsentShareWithAmc() { return consentShareWithAmc; }
    public void setConsentShareWithAmc(boolean consentShareWithAmc) { this.consentShareWithAmc = consentShareWithAmc; }

    public boolean isUnderstoodMarketRisk() { return understoodMarketRisk; }
    public void setUnderstoodMarketRisk(boolean understoodMarketRisk) { this.understoodMarketRisk = understoodMarketRisk; }
}


