package dev.ongolebulls.controller;

import dev.ongolebulls.model.CandidateApplication;
import dev.ongolebulls.service.CandidateService;
import dev.ongolebulls.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = {"http://localhost:8080", "https://www.ongolebullsinvest.com"}) // Allow local and production frontend
@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final CandidateService candidateService;
    private final EmailService emailService;

    @Autowired
    public CandidateController(CandidateService candidateService, EmailService emailService) {
        this.candidateService = candidateService;
        this.emailService = emailService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCandidate(@RequestBody CandidateApplication candidate) {
        try {
            // 1️⃣ Save candidate details in database
            candidateService.saveCandidate(candidate);

            // 2️⃣ Send confirmation email
            emailService.sendApplicationConfirmation(
                    candidate.getEmail(),
                    candidate.getName(),
                    candidate.getAppliedFor() != null ? (String) candidate.getAppliedFor() : "a suitable position"
            );

            return ResponseEntity.ok("Candidate added successfully and confirmation email sent.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unexpected error: " + e.getMessage());
        }
    }

    @GetMapping("/test")
    public String testAPI() {
        return "Candidate API is working!";
    }
}
