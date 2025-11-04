package dev.ongolebulls.controller;

import dev.ongolebulls.dto.DocumentStatsDTO;
import dev.ongolebulls.dto.DocumentSubmissionDTO;
import dev.ongolebulls.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/documents")
@CrossOrigin(origins = "*")
public class AdminDocumentController {

    @Autowired
    private DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<DocumentSubmissionDTO>> getAllDocuments(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search
    ) {
        List<DocumentSubmissionDTO> documents = documentService.getAllDocuments(status, search);
        return ResponseEntity.ok(documents);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DocumentSubmissionDTO> getDocumentById(@PathVariable Long id) {
        DocumentSubmissionDTO document = documentService.getDocumentById(id);
        return ResponseEntity.ok(document);
    }

    @GetMapping("/stats")
    public ResponseEntity<DocumentStatsDTO> getStatistics() {
        DocumentStatsDTO stats = documentService.getStatistics();
        return ResponseEntity.ok(stats);
    }

    @PostMapping("/{id}/approve")
    public ResponseEntity<?> approveDocument(@PathVariable Long id) {
        try {
            documentService.approveDocument(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document approved successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @PostMapping("/{id}/reject")
    public ResponseEntity<?> rejectDocument(
            @PathVariable Long id,
            @RequestBody Map<String, String> request
    ) {
        try {
            String reason = request.get("reason");
            if (reason == null || reason.trim().isEmpty()) {
                throw new RuntimeException("Rejection reason is required");
            }
            documentService.rejectDocument(id, reason);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Document rejected successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
