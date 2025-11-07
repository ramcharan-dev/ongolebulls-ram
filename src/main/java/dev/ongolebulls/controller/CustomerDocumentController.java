package dev.ongolebulls.controller;

import dev.ongolebulls.model.DocumentSubmission;
import dev.ongolebulls.model.Nominee;
import dev.ongolebulls.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/customer-documents")
@CrossOrigin(origins = "*")
public class CustomerDocumentController {

    @Autowired
    private DocumentService documentService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;


    @PostMapping("/submit")
    public ResponseEntity<?> submitDocuments(
            // Basic investor details
            @RequestParam("investorName") String investorName,
            @RequestParam("investorEmail") String investorEmail,
            @RequestParam("investorPhone") String investorPhone,
            @RequestParam("investorDOB") String investorDOB,
            @RequestParam("panNumber") String panNumber,  // ✅ THIS MUST BE HERE
            @RequestParam("aadhaarNumber") String aadhaarNumber,
            @RequestParam("investorAddress") String investorAddress,

            // Bank details
            @RequestParam("bankAccountName") String bankAccountName,
            @RequestParam("bankName") String bankName,
            @RequestParam("bankAccountNumber") String bankAccountNumber,
            @RequestParam("bankIFSC") String bankIFSC,
            @RequestParam("bankBranch") String bankBranch,
            @RequestParam("bankAccountType") String bankAccountType,
            @RequestParam("bankProofType") String bankProofType,

            // Declarations
            @RequestParam("taxResidencyCountry") String taxResidencyCountry,
            @RequestParam("riskProfile") String riskProfile,

            // Files - MADE OPTIONAL with required = false
            @RequestParam(value = "panCardFile", required = false) MultipartFile panCardFile,
            @RequestParam(value = "aadhaarCardFile", required = false) MultipartFile aadhaarCardFile,
            @RequestParam(value = "photographFile", required = false) MultipartFile photographFile,
            @RequestParam(value = "bankProofFile", required = false) MultipartFile bankProofFile,
            @RequestParam(value = "signatureFile", required = false) MultipartFile signatureFile,

            // Nominees (optional)
            @RequestParam(value = "nominees[0].nomineeName", required = false) String nominee1Name,
            @RequestParam(value = "nominees[0].relationship", required = false) String nominee1Relationship,
            @RequestParam(value = "nominees[0].dateOfBirth", required = false) String nominee1DOB,
            @RequestParam(value = "nominees[0].allocationPercentage", required = false) Integer nominee1Allocation,
            @RequestParam(value = "nominees[0].nomineeAddress", required = false) String nominee1Address,
            @RequestParam(value = "nominees[0].guardianName", required = false) String nominee1GuardianName,
            @RequestParam(value = "nominees[0].guardianRelationship", required = false) String nominee1GuardianRelationship,
            @RequestParam(value = "nominees[0].guardianPan", required = false) String nominee1GuardianPan,

            @RequestParam(value = "nominees[1].nomineeName", required = false) String nominee2Name,
            @RequestParam(value = "nominees[1].relationship", required = false) String nominee2Relationship,
            @RequestParam(value = "nominees[1].dateOfBirth", required = false) String nominee2DOB,
            @RequestParam(value = "nominees[1].allocationPercentage", required = false) Integer nominee2Allocation,
            @RequestParam(value = "nominees[1].nomineeAddress", required = false) String nominee2Address,
            @RequestParam(value = "nominees[1].guardianName", required = false) String nominee2GuardianName,
            @RequestParam(value = "nominees[1].guardianRelationship", required = false) String nominee2GuardianRelationship,
            @RequestParam(value = "nominees[1].guardianPan", required = false) String nominee2GuardianPan,

            @RequestParam(value = "nominees[2].nomineeName", required = false) String nominee3Name,
            @RequestParam(value = "nominees[2].relationship", required = false) String nominee3Relationship,
            @RequestParam(value = "nominees[2].dateOfBirth", required = false) String nominee3DOB,
            @RequestParam(value = "nominees[2].allocationPercentage", required = false) Integer nominee3Allocation,
            @RequestParam(value = "nominees[2].nomineeAddress", required = false) String nominee3Address,
            @RequestParam(value = "nominees[2].guardianName", required = false) String nominee3GuardianName,
            @RequestParam(value = "nominees[2].guardianRelationship", required = false) String nominee3GuardianRelationship,
            @RequestParam(value = "nominees[2].guardianPan", required = false) String nominee3GuardianPan
    ) {
        try {
            // TRIM the PAN number - NOW panNumber is available!
            String cleanPanNumber = panNumber.trim().toUpperCase();

            // CHECK IF PAN ALREADY EXISTS
            if (documentService.panNumberExists(cleanPanNumber)) {
                Map<String, Object> errorResponse = new HashMap<>();
                errorResponse.put("success", false);
                errorResponse.put("message", "A document submission with PAN number '" + cleanPanNumber + "' already exists. Please use a different PAN or contact support.");
                return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
            }

            // Create DocumentSubmission entity
            DocumentSubmission submission = new DocumentSubmission();
            submission.setInvestorName(investorName.trim());
            submission.setInvestorEmail(investorEmail.trim());
            submission.setInvestorPhone(investorPhone.trim());
            submission.setInvestorDob(parseDate(investorDOB, "investorDOB"));
            submission.setPanNumber(cleanPanNumber);
            submission.setAadhaarNumber(aadhaarNumber.trim());
            submission.setInvestorAddress(investorAddress.trim());
            submission.setBankAccountName(bankAccountName.trim());
            submission.setBankName(bankName.trim());
            submission.setBankAccountNumber(bankAccountNumber.trim());
            submission.setBankIfsc(bankIFSC.trim().toUpperCase());
            submission.setBankBranch(bankBranch.trim());
            submission.setBankAccountType(bankAccountType.trim());
            submission.setBankProofType(bankProofType.trim());
            submission.setTaxResidencyCountry(taxResidencyCountry.trim());
            submission.setRiskProfile(riskProfile.trim());
            submission.setStatus("Pending");

            // Prepare file map
            Map<String, MultipartFile> files = new HashMap<>();
            if (panCardFile != null && !panCardFile.isEmpty()) {
                files.put("panCardFile", panCardFile);
            }
            if (aadhaarCardFile != null && !aadhaarCardFile.isEmpty()) {
                files.put("aadhaarCardFile", aadhaarCardFile);
            }
            if (photographFile != null && !photographFile.isEmpty()) {
                files.put("photographFile", photographFile);
            }
            if (bankProofFile != null && !bankProofFile.isEmpty()) {
                files.put("bankProofFile", bankProofFile);
            }
            if (signatureFile != null && !signatureFile.isEmpty()) {
                files.put("signatureFile", signatureFile);
            }

            // Prepare nominees list
            List<Nominee> nominees = new ArrayList<>();

            // Nominee 1
            if (nominee1Name != null && !nominee1Name.trim().isEmpty()) {
                Nominee nominee1 = new Nominee();
                nominee1.setNomineeName(nominee1Name.trim());
                nominee1.setRelationship(nominee1Relationship.trim());
                nominee1.setDateOfBirth(parseDate(nominee1DOB, "nominees[0].dateOfBirth"));
                nominee1.setAllocationPercentage(nominee1Allocation);
                nominee1.setNomineeAddress(nominee1Address.trim());
                nominee1.setGuardianName(nominee1GuardianName != null ? nominee1GuardianName.trim() : null);
                nominee1.setGuardianRelationship(nominee1GuardianRelationship != null ? nominee1GuardianRelationship.trim() : null);
                nominee1.setGuardianPan(nominee1GuardianPan != null ? nominee1GuardianPan.trim().toUpperCase() : null);
                nominees.add(nominee1);
            }

            // Nominee 2
            if (nominee2Name != null && !nominee2Name.trim().isEmpty()) {
                Nominee nominee2 = new Nominee();
                nominee2.setNomineeName(nominee2Name.trim());
                nominee2.setRelationship(nominee2Relationship.trim());
                nominee2.setDateOfBirth(parseDate(nominee2DOB, "nominees[1].dateOfBirth"));
                nominee2.setAllocationPercentage(nominee2Allocation);
                nominee2.setNomineeAddress(nominee2Address.trim());
                nominee2.setGuardianName(nominee2GuardianName != null ? nominee2GuardianName.trim() : null);
                nominee2.setGuardianRelationship(nominee2GuardianRelationship != null ? nominee2GuardianRelationship.trim() : null);
                nominee2.setGuardianPan(nominee2GuardianPan != null ? nominee2GuardianPan.trim().toUpperCase() : null);
                nominees.add(nominee2);
            }

            // Nominee 3
            if (nominee3Name != null && !nominee3Name.trim().isEmpty()) {
                Nominee nominee3 = new Nominee();
                nominee3.setNomineeName(nominee3Name.trim());
                nominee3.setRelationship(nominee3Relationship.trim());
                nominee3.setDateOfBirth(parseDate(nominee3DOB, "nominees[2].dateOfBirth"));
                nominee3.setAllocationPercentage(nominee3Allocation);
                nominee3.setNomineeAddress(nominee3Address.trim());
                nominee3.setGuardianName(nominee3GuardianName != null ? nominee3GuardianName.trim() : null);
                nominee3.setGuardianRelationship(nominee3GuardianRelationship != null ? nominee3GuardianRelationship.trim() : null);
                nominee3.setGuardianPan(nominee3GuardianPan != null ? nominee3GuardianPan.trim().toUpperCase() : null);
                nominees.add(nominee3);
            }

            // Save to database
            DocumentSubmission savedSubmission = documentService.saveDocumentSubmission(submission, nominees, files);

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Documents submitted successfully");
            response.put("id", savedSubmission.getId());

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", "Failed to submit documents: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    private LocalDate parseDate(String dateString, String fieldName) {
        if (dateString == null || dateString.trim().isEmpty()) {
            throw new IllegalArgumentException(fieldName + " is required");
        }
        try {
            return LocalDate.parse(dateString.trim(), DATE_FORMATTER);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException(fieldName + " must be in yyyy-MM-dd format (e.g., 1990-05-15)");
        }
    }


}
