package dev.ongolebulls.dto;

import dev.ongolebulls.model.Nominee;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public class DocumentSubmissionDTO {

    private Long id;
    private String investorName;
    private String investorEmail;
    private String investorPhone;
    private LocalDate investorDob;
    private String panNumber;
    private String aadhaarNumber;
    private String investorAddress;
    private String bankAccountName;
    private String bankName;
    private String bankAccountNumber;
    private String bankIfsc;
    private String bankBranch;
    private String bankAccountType;
    private String bankProofType;
    private String taxResidencyCountry;
    private String riskProfile;
    private String panCardFileUrl;
    private String aadhaarCardFileUrl;
    private String photographFileUrl;
    private String bankProofFileUrl;
    private String signatureFileUrl;
    private String status;
    private LocalDateTime submittedDate;
    private LocalDateTime reviewedDate;
    private String rejectionReason;
    private List<Nominee> nominees;
    private Integer nomineesCount;

    // Constructors
    public DocumentSubmissionDTO() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getInvestorName() {
        return investorName;
    }

    public void setInvestorName(String investorName) {
        this.investorName = investorName;
    }

    public String getInvestorEmail() {
        return investorEmail;
    }

    public void setInvestorEmail(String investorEmail) {
        this.investorEmail = investorEmail;
    }

    public String getInvestorPhone() {
        return investorPhone;
    }

    public void setInvestorPhone(String investorPhone) {
        this.investorPhone = investorPhone;
    }

    public LocalDate getInvestorDob() {
        return investorDob;
    }

    public void setInvestorDob(LocalDate investorDob) {
        this.investorDob = investorDob;
    }

    public String getPanNumber() {
        return panNumber;
    }

    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }

    public String getAadhaarNumber() {
        return aadhaarNumber;
    }

    public void setAadhaarNumber(String aadhaarNumber) {
        this.aadhaarNumber = aadhaarNumber;
    }

    public String getInvestorAddress() {
        return investorAddress;
    }

    public void setInvestorAddress(String investorAddress) {
        this.investorAddress = investorAddress;
    }

    public String getBankAccountName() {
        return bankAccountName;
    }

    public void setBankAccountName(String bankAccountName) {
        this.bankAccountName = bankAccountName;
    }

    public String getBankName() {
        return bankName;
    }

    public void setBankName(String bankName) {
        this.bankName = bankName;
    }

    public String getBankAccountNumber() {
        return bankAccountNumber;
    }

    public void setBankAccountNumber(String bankAccountNumber) {
        this.bankAccountNumber = bankAccountNumber;
    }

    public String getBankIfsc() {
        return bankIfsc;
    }

    public void setBankIfsc(String bankIfsc) {
        this.bankIfsc = bankIfsc;
    }

    public String getBankBranch() {
        return bankBranch;
    }

    public void setBankBranch(String bankBranch) {
        this.bankBranch = bankBranch;
    }

    public String getBankAccountType() {
        return bankAccountType;
    }

    public void setBankAccountType(String bankAccountType) {
        this.bankAccountType = bankAccountType;
    }

    public String getBankProofType() {
        return bankProofType;
    }

    public void setBankProofType(String bankProofType) {
        this.bankProofType = bankProofType;
    }

    public String getTaxResidencyCountry() {
        return taxResidencyCountry;
    }

    public void setTaxResidencyCountry(String taxResidencyCountry) {
        this.taxResidencyCountry = taxResidencyCountry;
    }

    public String getRiskProfile() {
        return riskProfile;
    }

    public void setRiskProfile(String riskProfile) {
        this.riskProfile = riskProfile;
    }

    public String getPanCardFileUrl() {
        return panCardFileUrl;
    }

    public void setPanCardFileUrl(String panCardFileUrl) {
        this.panCardFileUrl = panCardFileUrl;
    }

    public String getAadhaarCardFileUrl() {
        return aadhaarCardFileUrl;
    }

    public void setAadhaarCardFileUrl(String aadhaarCardFileUrl) {
        this.aadhaarCardFileUrl = aadhaarCardFileUrl;
    }

    public String getPhotographFileUrl() {
        return photographFileUrl;
    }

    public void setPhotographFileUrl(String photographFileUrl) {
        this.photographFileUrl = photographFileUrl;
    }

    public String getBankProofFileUrl() {
        return bankProofFileUrl;
    }

    public void setBankProofFileUrl(String bankProofFileUrl) {
        this.bankProofFileUrl = bankProofFileUrl;
    }

    public String getSignatureFileUrl() {
        return signatureFileUrl;
    }

    public void setSignatureFileUrl(String signatureFileUrl) {
        this.signatureFileUrl = signatureFileUrl;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedDate() {
        return submittedDate;
    }

    public void setSubmittedDate(LocalDateTime submittedDate) {
        this.submittedDate = submittedDate;
    }

    public LocalDateTime getReviewedDate() {
        return reviewedDate;
    }

    public void setReviewedDate(LocalDateTime reviewedDate) {
        this.reviewedDate = reviewedDate;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public List<Nominee> getNominees() {
        return nominees;
    }

    public void setNominees(List<Nominee> nominees) {
        this.nominees = nominees;
    }

    public Integer getNomineesCount() {
        return nomineesCount;
    }

    public void setNomineesCount(Integer nomineesCount) {
        this.nomineesCount = nomineesCount;
    }
}
