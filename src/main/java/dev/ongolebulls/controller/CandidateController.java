package dev.ongolebulls.controller;

import dev.ongolebulls.model.CandidateApplication;
import dev.ongolebulls.service.CandidateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@CrossOrigin(origins = "http://localhost:8085") // Allow frontend access (optional)
@RestController
@RequestMapping("/api/candidate")
public class CandidateController {

    private final CandidateService candidateService;

    @Autowired
    public CandidateController(CandidateService candidateService) {
        this.candidateService = candidateService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCandidate(@RequestBody CandidateApplication candidate) {
        try {
            candidateService.saveCandidate(candidate); // Saving candidate
            return ResponseEntity.ok("Candidate added successfully!");
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
