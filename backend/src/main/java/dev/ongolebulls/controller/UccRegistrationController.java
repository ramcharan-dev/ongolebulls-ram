package dev.ongolebulls.controller;

import dev.ongolebulls.dto.UccDraftRequest;
import dev.ongolebulls.dto.UccStatusResponse;
import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.service.UccRegistrationService;
import dev.ongolebulls.util.ApiResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ucc")
@CrossOrigin(originPatterns = "*")
@RequiredArgsConstructor
@Slf4j
public class UccRegistrationController {

    private final UccRegistrationService service;

    @PostMapping("/save-draft")
    public ResponseEntity<ApiResponse<UccRegistration>> saveDraft(@RequestBody UccDraftRequest request) {
        log.info("UCC save-draft request received for userId={}", request.getUserId());
        UccRegistration saved = service.saveDraft(request);
        log.info("UCC draft saved successfully, id={}", saved.getId());
        return ResponseEntity.ok(ApiResponse.ok("Draft saved successfully", saved));
    }

    @PostMapping("/submit")
    public ResponseEntity<ApiResponse<UccRegistration>> submit(@RequestBody UccDraftRequest request) {
        log.info("UCC submit request received for userId={}", request.getUserId());
        UccRegistration submitted = service.submitRegistration(request);
        log.info("UCC submitted successfully, id={}, status={}", submitted.getId(), submitted.getStatus());
        return ResponseEntity.ok(ApiResponse.ok(
                "UCC registration submitted successfully. It will be processed shortly.", submitted));
    }

    @PostMapping("/retry/{userId}")
    public ResponseEntity<ApiResponse<UccRegistration>> retry(@PathVariable Long userId) {
        log.info("UCC retry request for userId={}", userId);
        UccRegistration retried = service.retrySubmission(userId);
        return ResponseEntity.ok(ApiResponse.ok("UCC registration resubmitted for processing", retried));
    }

    @GetMapping("/status/{userId}")
    public ResponseEntity<ApiResponse<UccStatusResponse>> getStatus(@PathVariable Long userId) {
        log.info("UCC status request for userId={}", userId);
        return service.getStatus(userId)
                .map(status -> ResponseEntity.ok(ApiResponse.ok("UCC status retrieved", status)))
                .orElse(ResponseEntity.ok(ApiResponse.ok("No UCC registration found", null)));
    }
}
