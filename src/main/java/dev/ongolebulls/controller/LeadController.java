package dev.ongolebulls.controller;

import dev.ongolebulls.dto.LeadRequest;
import dev.ongolebulls.model.Lead;
import dev.ongolebulls.service.LeadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leads")
@CrossOrigin(origins = {"http://localhost:8080", "https://www.ongolebullsinvest.com", "https://ongolebullsinvest.com"}, allowedHeaders = "*")
public class LeadController {

    private static final Logger log = LoggerFactory.getLogger(LeadController.class);

    @Autowired
    private LeadService leadService;

    @PostMapping
    public ResponseEntity<?> saveLead(@RequestBody(required = false) LeadRequest request) {
        if (request == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Request body is required"));
        }
        String fullName = request.getFullName();
        String mobile = request.getMobile();
        String email = request.getEmail();
        if (fullName == null || fullName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Full name is required"));
        }
        if (mobile == null || mobile.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Mobile is required"));
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        }
        try {
            Lead lead = new Lead();
            lead.setFullName(fullName.trim());
            lead.setMobile(mobile.trim());
            lead.setEmail(email.trim());
            String invAmt = request.getInvestmentAmount();
            lead.setInvestmentAmount(invAmt != null && !invAmt.trim().isEmpty() ? invAmt.trim() : null);
            lead.setCreatedAt(LocalDateTime.now());
            Lead saved = leadService.saveLead(lead);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (Exception e) {
            log.error("Failed to save lead", e);
            Map<String, Object> err = new HashMap<>();
            err.put("message", "Failed to save lead. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllLeads() {
        try {
            List<Lead> leads = leadService.getAllLeads();
            return ResponseEntity.ok(leads);
        } catch (Exception e) {
            log.error("Failed to fetch leads", e);
            Map<String, Object> err = new HashMap<>();
            err.put("message", "Failed to fetch leads.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
        }
    }
}
