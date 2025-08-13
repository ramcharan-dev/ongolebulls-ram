/*
package dev.ongolebulls.controller;

import dev.ongolebulls.model.Blog;
import dev.ongolebulls.model.LoginRequest;
import dev.ongolebulls.model.RegisterRequest;
import dev.ongolebulls.model.ResetPasswordRequest;
import dev.ongolebulls.service.AuthService;

import dev.ongolebulls.service.BlogService;
import dev.ongolebulls.service.BlogServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        String response = authService.loginUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        String response = authService.registerUser(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody ResetPasswordRequest request) {
        String response = authService.resetPassword(request);
        return ResponseEntity.ok(response);
    }


}
*//*

//working code
package dev.ongolebulls.controller;

import dev.ongolebulls.model.LoginRequest;
import dev.ongolebulls.model.RegisterRequest;
import dev.ongolebulls.model.ResetPasswordRequest;
import dev.ongolebulls.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@Valid @RequestBody LoginRequest request) {
        // Extract username, password, and verification code from the request
        String username = request.getUsername();
        String password = request.getPassword();
        String code = request.getVerificationCode();

        // Call AuthService to validate all 3 inputs
        String response = authService.loginUser(username, password, code);

        return response.equalsIgnoreCase("Login successful!")
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }


    // JSON registration (no files)
    @PostMapping(value = "/register", consumes = "application/json")
    public ResponseEntity<String> registerJson(@Valid @RequestBody RegisterRequest request) {
        String response = authService.registerUser(request, null, null);
        return response.startsWith("Registration successful")
                ? ResponseEntity.status(HttpStatus.CREATED).body(response)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    // Multipart registration (with files)
    @PostMapping(value = "/register", consumes = "multipart/form-data")
    public ResponseEntity<String> registerWithFiles(
            @RequestPart("data") @Valid RegisterRequest request,
            @RequestPart(value = "addressProof", required = false) MultipartFile addressProofFile,
            @RequestPart(value = "cancelledCheque", required = false) MultipartFile cancelledChequeFile) {

        // Optional: return early if both files are missing (depends on your business rules)
        if ((addressProofFile == null || addressProofFile.isEmpty()) &&
                (cancelledChequeFile == null || cancelledChequeFile.isEmpty())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Please upload address proof and/or cancelled cheque.");
        }

        String response = authService.registerUser(request, addressProofFile, cancelledChequeFile);
        return response.startsWith("Registration successful")
                ? ResponseEntity.status(HttpStatus.CREATED).body(response)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verifyAccount(@RequestParam String username, @RequestParam String code) {
        String result = authService.verifyUser(username, code);
        return result.equalsIgnoreCase("Account verified successfully!")
                ? ResponseEntity.ok(result)
                : ResponseEntity.status(HttpStatus.BAD_REQUEST).body(result);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        String response = authService.resetPassword(request);
        return response.equalsIgnoreCase("Password reset successfully!")
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }
}
*/

package dev.ongolebulls.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.dto.ApiResponse;
import dev.ongolebulls.dto.RegisterRequest;
import dev.ongolebulls.service.EmailService;
import dev.ongolebulls.service.OTPService;
import dev.ongolebulls.service.RecaptchaService;
import dev.ongolebulls.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final OTPService otpService;
    private final UserService userService;
    private final RecaptchaService recaptchaService;
    private final ObjectMapper mapper;
    private final EmailService emailService; // Spring injects this automatically


    public AuthController(OTPService otpService, UserService userService, RecaptchaService recaptchaService, ObjectMapper mapper, EmailService emailService) {
        this.otpService = otpService;
        this.userService = userService;
        this.recaptchaService = recaptchaService;
        this.mapper = mapper;
        this.emailService = emailService;
    }

    // --- Email OTP ---
    @PostMapping("/send-otp/email")
    public ResponseEntity<?> sendEmailOtp(@RequestBody EmailRequest r) {
        if (r == null || r.email == null || r.email.isBlank())
            return ResponseEntity.badRequest().body(new ApiResponse(false,"Invalid email"));
        otpService.createOtp(r.email, "EMAIL");
        return ResponseEntity.ok(new ApiResponse(true, "OTP sent (simulated)."));
    }


    @PostMapping("/verify-otp/email")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody EmailOtpVerifyRequest r) {
        if(r == null || r.email == null || r.otp == null || r.otp.isBlank())
            return ResponseEntity.badRequest().body(new ApiResponse(false,"Invalid request"));
        boolean ok = otpService.verifyOtp(r.email, "EMAIL", r.otp);
        return ok ? ResponseEntity.ok(new ApiResponse(true, "Email verified"))
                : ResponseEntity.status(400).body(new ApiResponse(false,"Invalid email OTP"));
    }

    // --- Mobile OTP (renamed to avoid conflict) ---
    @PostMapping("/send-otp/mobile")
    public ResponseEntity<?> sendMobileOtp(@RequestBody MobileRequest r) {
        if (r == null || r.mobile == null || r.mobile.isBlank())
            return ResponseEntity.badRequest().body(new ApiResponse(false,"Invalid mobile"));
        otpService.createOtp(r.mobile, "MOBILE");
        return ResponseEntity.ok(new ApiResponse(true,"OTP sent (simulated)."));
    }

    // Renamed endpoint to avoid collision with OTPController
    @PostMapping("/verify-otp/mobile-auth")
    public ResponseEntity<?> verifyMobileOtp(@RequestBody MobileOtpVerifyRequest r) {
        if(r == null || r.mobile == null || r.otp == null || r.otp.isBlank())
            return ResponseEntity.badRequest().body(new ApiResponse(false,"Invalid request"));
        boolean ok = otpService.verifyOtp(r.mobile, "MOBILE", r.otp);
        return ok ? ResponseEntity.ok(new ApiResponse(true,"Mobile verified"))
                : ResponseEntity.status(400).body(new ApiResponse(false,"Invalid mobile OTP"));
    }

    @PostMapping("/test-email")
    public String testEmail() {
        boolean sent = emailService.sendEmail(
                "ambikapmethree@gmail.com", // Replace with your email
                "Test Email",
                "<h1>Test Email</h1><p>If you see this, email works!</p>"
        );
        return sent ? "Email Sent" : "Email Failed";
    }

    // --- Registration with server-side OTP verification ---
    @PostMapping(value = "/register", consumes = { MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<?> register(@RequestPart("payload") String payload,
                                      @RequestPart(name = "addressProof", required = false) MultipartFile addressProof,
                                      @RequestPart(name = "chequeProof", required = false) MultipartFile chequeProof) {
        try {
            RegisterRequest req = mapper.readValue(payload, RegisterRequest.class);

            if (!recaptchaService.verify(req.getRecaptcha())) {
                return ResponseEntity.status(400).body(new ApiResponse(false,"Invalid reCAPTCHA"));
            }

            if(!otpService.verifyOtp(req.getEmail(), "EMAIL", req.getEmailOtp())) {
                return ResponseEntity.status(400).body(new ApiResponse(false,"Invalid email OTP"));
            }

            if(!otpService.verifyOtp(req.getMobile(), "MOBILE", req.getMobileOtp())) {
                return ResponseEntity.status(400).body(new ApiResponse(false,"Invalid mobile OTP"));
            }

            var saved = userService.register(req, addressProof, chequeProof);
            return ResponseEntity.ok(new ApiResponse(true,"Registration successful", saved.getId()));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, ex.getMessage()));
        } catch (Exception e) {
            log.error("Error during registration", e);
            return ResponseEntity.status(500).body(new ApiResponse(false,"Server error"));
        }
    }

    // --- DTOs ---
    public static class EmailRequest { public String email; }
    public static class MobileRequest { public String mobile; }
    public static class EmailOtpVerifyRequest { public String email; public String otp; }
    public static class MobileOtpVerifyRequest { public String mobile; public String otp; }
}
