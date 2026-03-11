package dev.ongolebulls.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "document_nominees")
public class DocumentNominee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submission_id", nullable = false)
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

    // All getters and setters...
    // (Copy from the previous Nominee.java)
}
