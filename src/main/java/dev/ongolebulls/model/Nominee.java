package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "nominees")
public class Nominee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)  // ✅ ADD THIS LINE
    private Long id;

    // For User Dashboard (existing relationship)
    @Column(name = "user_id")
    private Long userId;

    // For Document Submissions (new relationship)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id")
    private DocumentSubmission documentSubmission;

    @Column(nullable = false)
    private String nomineeName;

    @Column(nullable = false, length = 50)
    private String relationship;

    @Column(nullable = false)
    private LocalDate dateOfBirth;

    @Column(nullable = false)
    private Integer allocationPercentage;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String nomineeAddress;

    // Guardian details for minors
    @Column(nullable = false)
    private Boolean isMinor = false;

    private String guardianName;

    private String guardianRelationship;

    @Column(length = 10)
    private String guardianPan;

    @Column(length = 500)
    private String guardianIdProofUrl;

    // Constructors
    public Nominee() {}

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public DocumentSubmission getDocumentSubmission() {
        return documentSubmission;
    }

    public void setDocumentSubmission(DocumentSubmission documentSubmission) {
        this.documentSubmission = documentSubmission;
    }

    public String getNomineeName() {
        return nomineeName;
    }

    public void setNomineeName(String nomineeName) {
        this.nomineeName = nomineeName;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public Integer getAllocationPercentage() {
        return allocationPercentage;
    }

    public void setAllocationPercentage(Integer allocationPercentage) {
        this.allocationPercentage = allocationPercentage;
    }

    public String getNomineeAddress() {
        return nomineeAddress;
    }

    public void setNomineeAddress(String nomineeAddress) {
        this.nomineeAddress = nomineeAddress;
    }

    public Boolean getIsMinor() {
        return isMinor;
    }

    public void setIsMinor(Boolean isMinor) {
        this.isMinor = isMinor;
    }

    public String getGuardianName() {
        return guardianName;
    }

    public void setGuardianName(String guardianName) {
        this.guardianName = guardianName;
    }

    public String getGuardianRelationship() {
        return guardianRelationship;
    }

    public void setGuardianRelationship(String guardianRelationship) {
        this.guardianRelationship = guardianRelationship;
    }

    public String getGuardianPan() {
        return guardianPan;
    }

    public void setGuardianPan(String guardianPan) {
        this.guardianPan = guardianPan;
    }

    public String getGuardianIdProofUrl() {
        return guardianIdProofUrl;
    }

    public void setGuardianIdProofUrl(String guardianIdProofUrl) {
        this.guardianIdProofUrl = guardianIdProofUrl;
    }
}
