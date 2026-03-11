package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "document_submissions")
public class DocumentSubmission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Basic Investor Details
    @Column(nullable = false)
    private String investorName;

    @Column(nullable = false)
    private String investorEmail;

    @Column(nullable = false, length = 15)
    private String investorPhone;

    @Column(nullable = false)
    private LocalDate investorDob;

    @Column(nullable = false, length = 10, unique = true)
    private String panNumber;

    @Column(nullable = false, length = 12)
    private String aadhaarNumber;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String investorAddress;

    // Bank Details
    @Column(nullable = false)
    private String bankAccountName;

    @Column(nullable = false)
    private String bankName;

    @Column(nullable = false)
    private String bankAccountNumber;

    @Column(nullable = false, length = 11)
    private String bankIfsc;

    @Column(nullable = false)
    private String bankBranch;

    @Column(nullable = false, length = 20)
    private String bankAccountType;

    @Column(nullable = false, length = 50)
    private String bankProofType;

    // Declarations
    @Column(nullable = false)
    private String taxResidencyCountry;

    @Column(nullable = false, length = 50)
    private String riskProfile;

    // File URLs (stored in cloud storage or local)
    @Column(length = 500)
    private String panCardFileUrl;

    @Column(length = 500)
    private String aadhaarCardFileUrl;

    @Column(length = 500)
    private String photographFileUrl;

    @Column(length = 500)
    private String bankProofFileUrl;

    @Column(length = 500)
    private String signatureFileUrl;

    // Status tracking
    @Column(nullable = false, length = 50)
    private String status = "Pending";

    @Column(nullable = false, updatable = false)
    private LocalDateTime submittedDate = LocalDateTime.now();

    private LocalDateTime reviewedDate;

    private Long reviewedBy;

    @Column(columnDefinition = "TEXT")
    private String rejectionReason;

    // Nominees relationship
    @OneToMany(mappedBy = "documentSubmission", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Nominee> nominees = new ArrayList<>();

    // Constructors
    public DocumentSubmission() {}

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

    public Long getReviewedBy() {
        return reviewedBy;
    }

    public void setReviewedBy(Long reviewedBy) {
        this.reviewedBy = reviewedBy;
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

    public void addNominee(Nominee nominee) {
        nominees.add(nominee);
        nominee.setDocumentSubmission(this);
    }

    public void removeNominee(Nominee nominee) {
        nominees.remove(nominee);
        nominee.setDocumentSubmission(null);
    }



}
