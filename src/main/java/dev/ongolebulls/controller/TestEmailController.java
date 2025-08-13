package dev.ongolebulls.controller;

import dev.ongolebulls.service.OTPService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/otp")
@RequiredArgsConstructor
public class TestEmailController {

    private final OTPService otpService;

    // --- Generate Email OTP ---
    @PostMapping("/generate-email")
    public Map<String, Object> generateEmailOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        otpService.generateEmailOtp(email);
        return Map.of(
                "success", true,
                "message", "OTP sent to email: " + email
        );
    }

    // --- Verify Email OTP ---
    @PostMapping("/verify-email")
    public Map<String, Object> verifyEmailOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        boolean valid = otpService.verifyEmailOtp(email, otp);
        return Map.of(
                "success", valid,
                "message", valid ? "Email OTP verified successfully" : "Invalid or expired OTP"
        );
    }

    // --- Generate Mobile OTP ---
    @PostMapping("/generate-mobile")
    public Map<String, Object> generateMobileOtp(@RequestBody Map<String, String> payload) {
        String mobile = payload.get("mobile");
        otpService.generateMobileOtp(mobile);
        return Map.of(
                "success", true,
                "message", "OTP sent to mobile: " + mobile
        );
    }

    // --- Verify Mobile OTP ---
    @PostMapping("/verify-mobile")
    public Map<String, Object> verifyMobileOtp(@RequestBody Map<String, String> payload) {
        String mobile = payload.get("mobile");
        String otp = payload.get("otp");
        boolean valid = otpService.verifyMobileOtp(mobile, otp);
        return Map.of(
                "success", valid,
                "message", valid ? "Mobile OTP verified successfully" : "Invalid or expired OTP"
        );
    }
}
