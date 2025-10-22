package dev.ongolebulls.controller;

import dev.ongolebulls.model.CandidateApplication;
import dev.ongolebulls.service.CandidateService;
import dev.ongolebulls.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Path;
import java.nio.file.Paths;

@CrossOrigin(origins = {"http://localhost:8085", "https://www.ongolebullsinvest.com"}) // Allow local and production frontend
@RestController
@RequestMapping("/api/candidate")
public class CandidateController {
    private final CandidateService candidateService;


//    private final CandidateService candidateService;
//
//    @Autowired
//    public CandidateController(CandidateService candidateService) {
//        this.candidateService = candidateService;
//    }




//    @PostMapping("/add")
//    public ResponseEntity<String> addCandidate(@RequestBody CandidateApplication candidate) {
//        try {
//            candidateService.saveCandidate(candidate); // Saving candidate
//            return ResponseEntity.ok("Candidate added successfully!");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Unexpected error: " + e.getMessage());
//        }
//    }

    @GetMapping("/test")
    public String testAPI() {
        return "Candidate API is working!";
    }

    private final EmailService emailService;

//    @Autowired
//    public CandidateController(EmailService emailService, CandidateService candidateService) {
//        this.emailService=  emailService; this.candidateService = candidateService;
//    }

//    @PostMapping("/add")
//    public ResponseEntity<String> addCandidate(@RequestBody CandidateApplication candidate) {
//        try {
//            candidateService.saveCandidate(candidate);
//
//            // Send confirmation email
//            String subject = "Thank you for applying!";
//            String body = "Hi " + candidate.getName() + ",\n\n"
//                    + "We have received your application. Our team will get back to you soon.\n\n"
//                    + "Best Regards,\nRecruitment Team";
//
//            emailService.sendMail(candidate.getEmail(), subject, body);
//
//            return ResponseEntity.ok("Candidate added successfully and email sent!");
//        } catch (Exception e) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//                    .body("Unexpected error: " + e.getMessage());
//        }
 //   }
//private final EmailService emailService;

    @Autowired
    public CandidateController(CandidateService candidateService, EmailService emailService) {
        this.candidateService = candidateService;
        this.emailService=  emailService;
    }

    @PostMapping("/add")
    public ResponseEntity<String> addCandidate(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("phone") String phone,
            @RequestParam("gradYear") String gradYearStr,
            @RequestParam("skills") String skills,
            @RequestParam("designationAppliedFor") String designationAppliedFor,
            @RequestParam(name="anything_else_to_share", required=false) String anythingElseToShare,
            @RequestParam("resume") MultipartFile resume
    ) {
        // Field validation
        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill the Name field.");
        }
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill the Email field.");
        }
        if (phone == null || phone.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill the Phone field.");
        }
        if (gradYearStr == null || gradYearStr.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill the Graduation Year field.");
        }
        if (skills == null || skills.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill the Skills field.");
        }
        if (designationAppliedFor == null || designationAppliedFor.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill the Designation Applied For field.");
        }
        if (resume == null || resume.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please upload your Resume.");
        }

        // Continue with the rest of your logic here...
        try {
            Integer graduationYear = null;
            try {
                graduationYear = Integer.parseInt(gradYearStr);
            } catch (NumberFormatException ex) {
                graduationYear = null;
            }

            String resumePath = null;
            if (resume != null && !resume.isEmpty()) {
                // Define uploads folder path - You can customize this path as needed
                String uploadDir = "uploads/";
                File uploadFolder = new File(uploadDir);
                if (!uploadFolder.exists()) {
                    uploadFolder.mkdirs();  // Create folder if not exists
                }

                // Get original filename
                String originalFileName = resume.getOriginalFilename();

                // To avoid name collision, you can prepend timestamp or UUID (optional)
                String savedFileName = System.currentTimeMillis() + "_" + originalFileName;

                // Full path where file will be saved
                Path filePath = Paths.get(uploadDir, savedFileName);

                // Save the file locally
                resume.transferTo(filePath);

                resumePath = filePath.toString();
            }

            CandidateApplication candidate = new CandidateApplication();
            candidate.setName(name);
            candidate.setEmail(email);
            candidate.setPhone(phone);
            candidate.setGraduationYear(graduationYear);
            candidate.setSkills(skills);
            candidate.setDesignationAppliedFor(designationAppliedFor);
            candidate.setResumePath(resumePath);
            candidate.setAdditionalComments(anythingElseToShare);

            candidateService.saveCandidate(candidate);

            String subject = "Thank You for Applying — OngoleBulls Invest";
            String body = String.format(
                    "%s,\n\n" +
                            "We truly appreciate your application for the position %s at OngoleBulls Invest!\n\n" +
                            "Our HR team is currently reviewing your application, and we will reach out to you shortly with an update on the status of your submission.\n\n" +
                            "During the recruitment process, you may be invited to complete certain assessments or share additional information. All updates and next steps will be communicated directly to your registered email.\n\n" +
                            "Thank you once again for considering a career with OngoleBulls Invest. We value your time and interest in joining our team.\n\n" +
                            "Best regards,\n" +
                            "OngoleBulls Invest — Recruitment Team\n" +
                            "📩 hr@ongolebullsinvest.com\n\n" +
                            "🌐 www.ongolebullsinvest.com",
                    name,
                    designationAppliedFor
            );

            emailService.sendMail(email, subject, body);

            return ResponseEntity.ok("Candidate added successfully and email sent!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Unexpected error: " + e.getMessage());
        }
    }




}
