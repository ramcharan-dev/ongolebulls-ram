package dev.ongolebulls.service;

import dev.ongolebulls.dto.DocumentStatsDTO;
import dev.ongolebulls.dto.DocumentSubmissionDTO;
import dev.ongolebulls.model.DocumentSubmission;
import dev.ongolebulls.model.Nominee;
import dev.ongolebulls.repository.DocumentSubmissionRepository;
import dev.ongolebulls.repository.NomineeRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.Period;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentSubmissionRepository documentRepository;

    @Autowired
    private NomineeRepo nomineeRepo;

    @Value("${file.upload.directory:uploads/documents}")
    private String uploadDirectory;

    // ADD THIS METHOD - Check if PAN exists
    public boolean panNumberExists(String panNumber) {
        return documentRepository.existsByPanNumber(panNumber);
    }

    @Transactional
    public DocumentSubmission saveDocumentSubmission(DocumentSubmission submission,
                                                     List<Nominee> nominees,
                                                     Map<String, MultipartFile> files) throws IOException {

        // Save files and get URLs
        if (files.containsKey("panCardFile")) {
            submission.setPanCardFileUrl(saveFile(files.get("panCardFile")));
        }
        if (files.containsKey("aadhaarCardFile")) {
            submission.setAadhaarCardFileUrl(saveFile(files.get("aadhaarCardFile")));
        }
        if (files.containsKey("photographFile")) {
            submission.setPhotographFileUrl(saveFile(files.get("photographFile")));
        }
        if (files.containsKey("bankProofFile")) {
            submission.setBankProofFileUrl(saveFile(files.get("bankProofFile")));
        }
        if (files.containsKey("signatureFile")) {
            submission.setSignatureFileUrl(saveFile(files.get("signatureFile")));
        }

        // Save submission first
        DocumentSubmission savedSubmission = documentRepository.save(submission);

        // Save nominees
        if (nominees != null && !nominees.isEmpty()) {
            for (Nominee nominee : nominees) {
                nominee.setDocumentSubmission(savedSubmission);

                // Check if minor
                LocalDate dob = nominee.getDateOfBirth();
                LocalDate today = LocalDate.now();
                int age = Period.between(dob, today).getYears();
                nominee.setIsMinor(age < 18);

                nomineeRepo.save(nominee);
            }
        }

        return savedSubmission;
    }

    private String saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;
        }

        // Create upload directory if not exists
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        String filename = UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(filename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Return URL path (adjust according to your setup)
        return "/uploads/documents/" + filename;
    }

    public List<DocumentSubmissionDTO> getAllDocuments(String status, String search) {
        List<DocumentSubmission> documents;

        if (status != null && !status.isEmpty() && search != null && !search.isEmpty()) {
            documents = documentRepository.searchByStatusAndKeyword(status, search);
        } else if (status != null && !status.isEmpty()) {
            documents = documentRepository.findByStatus(status);
        } else if (search != null && !search.isEmpty()) {
            documents = documentRepository.searchDocuments(search);
        } else {
            documents = documentRepository.findAll();
        }

        return documents.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public DocumentSubmissionDTO getDocumentById(Long id) {
        DocumentSubmission submission = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
        return convertToDTO(submission);
    }

    public DocumentStatsDTO getStatistics() {
        Long pending = documentRepository.countByStatus("Pending");
        Long approved = documentRepository.countByStatus("Approved");
        Long underReview = documentRepository.countByStatus("Under Review");
        Long total = documentRepository.count();

        return new DocumentStatsDTO(pending, approved, underReview, total);
    }

    @Transactional
    public void approveDocument(Long id) {
        DocumentSubmission submission = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        submission.setStatus("Approved");
        submission.setReviewedDate(LocalDateTime.now());
        documentRepository.save(submission);
    }

    @Transactional
    public void rejectDocument(Long id, String reason) {
        DocumentSubmission submission = documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));

        submission.setStatus("Rejected");
        submission.setRejectionReason(reason);
        submission.setReviewedDate(LocalDateTime.now());
        documentRepository.save(submission);
    }

    private DocumentSubmissionDTO convertToDTO(DocumentSubmission submission) {
        DocumentSubmissionDTO dto = new DocumentSubmissionDTO();

        dto.setId(submission.getId());
        dto.setInvestorName(submission.getInvestorName());
        dto.setInvestorEmail(submission.getInvestorEmail());
        dto.setInvestorPhone(submission.getInvestorPhone());
        dto.setInvestorDob(submission.getInvestorDob());
        dto.setPanNumber(submission.getPanNumber());
        dto.setAadhaarNumber(submission.getAadhaarNumber());
        dto.setInvestorAddress(submission.getInvestorAddress());
        dto.setBankAccountName(submission.getBankAccountName());
        dto.setBankName(submission.getBankName());
        dto.setBankAccountNumber(submission.getBankAccountNumber());
        dto.setBankIfsc(submission.getBankIfsc());
        dto.setBankBranch(submission.getBankBranch());
        dto.setBankAccountType(submission.getBankAccountType());
        dto.setBankProofType(submission.getBankProofType());
        dto.setTaxResidencyCountry(submission.getTaxResidencyCountry());
        dto.setRiskProfile(submission.getRiskProfile());
        dto.setPanCardFileUrl(submission.getPanCardFileUrl());
        dto.setAadhaarCardFileUrl(submission.getAadhaarCardFileUrl());
        dto.setPhotographFileUrl(submission.getPhotographFileUrl());
        dto.setBankProofFileUrl(submission.getBankProofFileUrl());
        dto.setSignatureFileUrl(submission.getSignatureFileUrl());
        dto.setStatus(submission.getStatus());
        dto.setSubmittedDate(submission.getSubmittedDate());
        dto.setReviewedDate(submission.getReviewedDate());
        dto.setRejectionReason(submission.getRejectionReason());
        dto.setNominees(submission.getNominees());
        dto.setNomineesCount(submission.getNominees().size());

        return dto;
    }


}
