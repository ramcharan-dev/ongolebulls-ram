package dev.ongolebulls.controller;

import dev.ongolebulls.model.Job;
import dev.ongolebulls.model.JobApplication;
import dev.ongolebulls.repository.JobApplicationRepository;
import dev.ongolebulls.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/api")
public class JobApplicationController {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private JobApplicationRepository jobApplicationRepository;

    // Endpoint for submitting job applications
    @PostMapping("/apply")
    public ResponseEntity<String> applyForJob(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("resume") MultipartFile resume,
            @RequestParam("jobId") Long jobId) {

        try {
            // Retrieve the job based on the jobId
            Job job = jobRepository.findById(jobId).orElseThrow(() -> new Exception("Job not found"));

            // Save the resume file to a directory
            String resumePath = saveResume(resume);

            // Create and save the application
            JobApplication application = new JobApplication();
            application.setName(name);
            application.setEmail(email);
            application.setPhone(phone);
            application.setResumePath(resumePath);
            application.setJob(job);


            jobApplicationRepository.save(application);

            return ResponseEntity.ok("Application submitted successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error submitting application.");
        }
    }

    // Helper method to save the resume
    private String saveResume(MultipartFile resume) throws IOException {
        String resumeDir = "uploads/resumes/";
        Path path = Path.of(resumeDir, resume.getOriginalFilename());

        // Ensure the directory exists
        Files.createDirectories(path.getParent());

        // Save the file
        Files.copy(resume.getInputStream(), path, StandardCopyOption.REPLACE_EXISTING);

        return path.toString();
    }
}
