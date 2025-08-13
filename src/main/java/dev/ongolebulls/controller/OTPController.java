package dev.ongolebulls.controller;

import dev.ongolebulls.service.OTPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class OTPController {

    private final OTPService otpService;

    // Generate Email OTP
    @PostMapping("/send/email")
    public ResponseEntity<?> sendEmailOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        otpService.generateEmailOtp(email);
        return ResponseEntity.ok(Map.of("success", true, "message", "OTP sent to email"));
    }

    // Verify Email OTP
    @PostMapping("/verify/email")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        boolean valid = otpService.verifyEmailOtp(email, otp);
        return ResponseEntity.ok(Map.of(
                "success", valid,
                "message", valid ? "Email OTP verified" : "Invalid or expired OTP"
        ));
    }

    // Generate Mobile OTP
    @PostMapping("/send/mobile")
    public ResponseEntity<?> sendMobileOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        otpService.generateMobileOtp(mobile);
        return ResponseEntity.ok(Map.of("success", true, "message", "OTP generated for mobile"));
    }

    // Verify Mobile OTP
    @PostMapping("/verify/mobile")
    public ResponseEntity<?> verifyMobileOtp(@RequestBody Map<String, String> request) {
        String mobile = request.get("mobile");
        String otp = request.get("otp");
        boolean valid = otpService.verifyMobileOtp(mobile, otp);
        return ResponseEntity.ok(Map.of(
                "success", valid,
                "message", valid ? "Mobile OTP verified" : "Invalid or expired OTP"
        ));
    }
}
