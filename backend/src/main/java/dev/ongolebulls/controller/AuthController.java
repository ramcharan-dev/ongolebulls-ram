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


}*/
package dev.ongolebulls.controller;

import dev.ongolebulls.model.PasswordResetToken;
import dev.ongolebulls.model.User;
import dev.ongolebulls.model.RiskProfile;
import dev.ongolebulls.repository.PasswordResetTokenRepository;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.service.AuthService;
import dev.ongolebulls.service.OtpService;
import dev.ongolebulls.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.ui.Model;                // ✅ correct one
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.HttpServletRequest;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Objects;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final OtpService otpService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final JavaMailSender mailSender;
    private final AuthService authService;


    // ==================== OTP ====================

    @PostMapping("/send-email-otp")
    public ResponseEntity<?> sendEmailOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing email"));
        }

        try {
            otpService.generateAndSend(email);
            return ResponseEntity.ok(Map.of("status", "otp-sent"));
        } catch (Exception e) {
            log.error("❌ Failed to send OTP to {}: {}", email, e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Failed to send OTP"));
        }
    }

    @PostMapping("/verify-email-otp")
    public ResponseEntity<?> verifyEmailOtp(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String otp = body.get("otp");
        if (email == null || otp == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing email or OTP"));
        }

        boolean ok = otpService.verify(email, otp);
        return ok
                ? ResponseEntity.ok(Map.of("status", "verified"))
                : ResponseEntity.status(400).body(Map.of("status", "invalid-otp"));
    }

    // ==================== REGISTRATION ====================

    @PostMapping(value = "/register-client", consumes = {"multipart/form-data"})
    public ResponseEntity<?> registerClient(
            @RequestPart("data") Map<String, Object> data,
            @RequestPart(value = "kycFile", required = false) MultipartFile kycFile,
            @RequestPart(value = "chequeFile", required = false) MultipartFile chequeFile,
            HttpServletRequest req
    ) {
        try {
            if (data == null) return ResponseEntity.badRequest().body("Missing registration data");

            String ip = req.getRemoteAddr();
            String deviceId = req.getHeader("X-Device-Id");

            // Handle RiskProfile safely
            if (data.get("riskProfile") instanceof Map<?, ?> riskMapRaw) {
                @SuppressWarnings("unchecked")
                Map<String, Object> riskMap = (Map<String, Object>) riskMapRaw;
                String riskCatStr = ((String) riskMap.getOrDefault("riskCategory", "CONSERVATIVE")).toUpperCase();
                RiskProfile.RiskCategory category;
                try {
                    category = RiskProfile.RiskCategory.valueOf(riskCatStr);
                } catch (IllegalArgumentException e) {
                    category = RiskProfile.RiskCategory.CONSERVATIVE;
                }
                int score = (int) riskMap.getOrDefault("riskScore", 0);
                String answersJson = (String) riskMap.getOrDefault("riskAnswersJson", "");

                RiskProfile riskProfile = RiskProfile.builder()
                        .score(score)
                        .category(category)
                        .answersJson(answersJson)
                        .build();
                data.put("riskProfileObj", riskProfile);
            }

            User saved = (User) userService.register(data, kycFile, chequeFile, ip, deviceId);

            return ResponseEntity.ok(Map.of(
                    "id", saved.getId(),
                    "email", saved.getEmail(),
                    "createdAt", saved.getCreatedAt()
            ));

        } catch (Exception ex) {
            log.error("❌ Registration failed: {}", ex.getMessage(), ex);
            return ResponseEntity.status(500).body(Map.of("error", ex.getMessage()));
        }
    }

    // ==================== LOGIN ====================

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || password == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing email or password"));
        }

        return userService.login(email, password)
                .map(user -> {
                    // Use reflection to get fields (Lombok IDE issue workaround)
                    java.lang.reflect.Field idField, emailField, fullNameField, mobileField;
                    try {
                        idField = user.getClass().getDeclaredField("id");
                        emailField = user.getClass().getDeclaredField("email");
                        fullNameField = user.getClass().getDeclaredField("fullName");
                        mobileField = user.getClass().getDeclaredField("mobileNumber");
                        idField.setAccessible(true);
                        emailField.setAccessible(true);
                        fullNameField.setAccessible(true);
                        mobileField.setAccessible(true);
                        
                        Map<String, Object> response = new HashMap<>();
                        response.put("id", idField.get(user));
                        response.put("email", emailField.get(user));
                        response.put("fullName", fullNameField.get(user));
                        Object mobile = mobileField.get(user);
                        response.put("mobileNumber", mobile != null ? mobile.toString() : "");
                        response.put("username", emailField.get(user));
                        return ResponseEntity.ok(response);
                    } catch (Exception e) {
                        // Fallback to basic response
                        Map<String, Object> response = new HashMap<>();
                        response.put("id", 0);
                        response.put("email", email);
                        response.put("fullName", "");
                        response.put("mobileNumber", "");
                        response.put("username", email);
                        return ResponseEntity.ok(response);
                    }
                })
                .orElseGet(() -> ResponseEntity.status(401).body(Map.of("error", "Invalid credentials")));
    }

    // ==================== FORGOT PASSWORD ====================

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "User not found"));
        }

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setEmail(email);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);

        // Send professional HTML reset mail
        try {
            // Link first hits backend, which then redirects to React app on :5173
            String resetLink = "http://localhost:8080/reset-password?token=" + token;

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            String html = """
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <title>Password Reset Request - OngoleBulls Invest</title>
                </head>
                <body style="margin:0; padding:0; background-color:#f5f7fa;">
                    <table role="presentation" cellpadding="0" cellspacing="0" width="100%%" style="background-color:#f5f7fa; padding:24px 0;">
                        <tr>
                            <td align="center">
                                <table role="presentation" cellpadding="0" cellspacing="0" width="600" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 8px rgba(0,0,0,0.06); font-family:Arial,Helvetica,sans-serif; color:#333333;">
                                    <tr>
                                        <td style="padding:24px 32px; background:linear-gradient(90deg,#004225,#007b55); color:#ffffff;">
                                            <h1 style="margin:0; font-size:22px; font-weight:600;">OngoleBulls Invest</h1>
                                            <p style="margin:4px 0 0; font-size:14px; opacity:0.9;">Password Reset Request</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:24px 32px 8px 32px;">
                                            <p style="margin:0 0 12px 0; font-size:14px;">Dear Investor,</p>
                                            <p style="margin:0 0 12px 0; font-size:14px;">
                                                We received a request to reset the password for your
                                                <strong>OngoleBulls Invest</strong> account.
                                            </p>
                                            <p style="margin:0 0 20px 0; font-size:14px;">
                                                If you made this request, please click the button below to securely set a new password.
                                            </p>
                                            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px 0;">
                                                <tr>
                                                    <td align="center">
                                                        <a href="%s"
                                                           style="display:inline-block; background-color:#007b55; color:#ffffff; text-decoration:none;
                                                                  padding:12px 28px; border-radius:4px; font-size:14px; font-weight:600;">
                                                            Reset Password
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            <p style="margin:0 0 12px 0; font-size:13px; color:#555555;">
                                                This link will expire in <strong>30 minutes</strong>. If it expires, you can always request a new password reset link from the login page.
                                            </p>
                                            <p style="margin:16px 0 0 0; font-size:13px; color:#555555;">
                                                If you did not request this change, you can safely ignore this email &mdash; your current password will remain unchanged.
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding:16px 32px 8px 32px;">
                                            <p style="margin:0 0 4px 0; font-size:13px; color:#333333;">
                                                Warm Regards,<br>
                                                <strong>OngoleBulls Invest Team</strong>
                                            </p>
                                            <p style="margin:8px 0 0 0; font-size:12px; color:#888888;">
                                                <a href="http://www.ongolebullsinvest.com"
                                                   style="color:#007b55; text-decoration:none;">
                                                    www.ongolebullsinvest.com
                                                </a>
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
                """.formatted(resetLink);

            helper.setFrom(Objects.requireNonNull("info@ongolebullsinvest.com", "Sender email cannot be null"));
            helper.setTo(Objects.requireNonNull(email, "Recipient email cannot be null"));
            helper.setSubject("Password Reset Request");
            helper.setText(Objects.requireNonNull(html, "Email content cannot be null"), true);

            mailSender.send(message);

        } catch (Exception e) {
            log.error("❌ Failed to send reset link: {}", e.getMessage(), e);
            return ResponseEntity.status(500).body(Map.of("error", "Error sending reset link"));
        }

        return ResponseEntity.ok(Map.of("status", "reset-link-sent"));
    }


    // ==================== RESET PASSWORD (API) ====================

    /**
     * Validate a password reset token before showing the reset form.
     * GET /api/auth/reset-password/validate?token=...
     */
    @GetMapping("/reset-password/validate")
    public ResponseEntity<?> validateResetToken(@RequestParam("token") String token) {
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "valid", false,
                    "message", "Missing token"
            ));
        }

        boolean valid = authService.isResetTokenValid(token);
        return ResponseEntity.ok(Map.of(
                "valid", valid,
                "token", token,
                "message", valid ? "Valid reset link" : "Invalid or expired reset link"
        ));
    }

    /**
     * Perform the actual password reset.
     * POST /api/auth/reset-password
     * Body: { "token": "...", "newPassword": "..." }
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPasswordApi(@RequestBody Map<String, String> body) {
        String token = body.get("token");
        String newPassword = body.get("newPassword");

        if (token == null || token.isBlank() || newPassword == null || newPassword.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Token and newPassword are required"
            ));
        }

        if (newPassword.length() < 6) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Password must be at least 6 characters"
            ));
        }

        boolean ok = authService.resetPassword(token, newPassword);
        if (!ok) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "success", false,
                    "message", "Invalid or expired reset token"
            ));
        }

        return ResponseEntity.ok(Map.of(
            "success", true,
            "message", "Password reset successfully"
        ));
    }


    // Profile page
    @GetMapping("/profile")
    public String profile(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        model.addAttribute("user", user);
        return "profile"; // profile.html
    }

    // Settings page
    @GetMapping("/settings")
    public String settings(Model model, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElse(null);
        model.addAttribute("user", user);
        return "settings"; // settings.html
    }

    // Update settings
    @PostMapping("/update")
    public String updateSettings(@ModelAttribute User user, Principal principal) {
        User existingUser = userRepository.findByEmail(principal.getName()).orElse(null);
        if (existingUser != null) {
            existingUser.setFullName(user.getFullName());
            existingUser.setAddress(user.getAddress());
            userRepository.save(existingUser);
        }
        return "redirect:/user/profile";
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
        // Invalidate the session
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }

        // Remove authentication cookies if any
        Cookie cookie = new Cookie("JSESSIONID", null);
        cookie.setPath("/");
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        response.addCookie(cookie);

        return ResponseEntity.ok("Logged out successfully");
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<User> userOpt = userService.getUserById(id);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
        }
    }

    @PutMapping("/profile/update/{id}")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @RequestBody User updatedUser) {
        Optional<User> existingUser = userService.getUserById(id);
        if (existingUser.isPresent()) {
            User user = existingUser.get();

            // Basic Info
            user.setFullName(updatedUser.getFullName());
            user.setEmail(updatedUser.getEmail());
            user.setMobileNumber(updatedUser.getMobileNumber());
            user.setDob(updatedUser.getDob());
            user.setGender(updatedUser.getGender());
            user.setAddress(updatedUser.getAddress());
            user.setCity(updatedUser.getCity());
            user.setState(updatedUser.getState());
            user.setPincode(updatedUser.getPincode());

            // Bank Details
            if (user.getBankDetails() != null && updatedUser.getBankDetails() != null) {
                user.getBankDetails().setBankName(updatedUser.getBankDetails().getBankName());
                user.getBankDetails().setIfsc(updatedUser.getBankDetails().getIfsc());
                user.getBankDetails().setAccountNumberEncrypted(updatedUser.getBankDetails().getAccountNumberEncrypted());
            }

            // KYC / Risk Details
            if (user.getKycDetails() != null && updatedUser.getKycDetails() != null) {
                user.getKycDetails().setPanNumber(updatedUser.getKycDetails().getPanNumber());
                user.getKycDetails().setAadhaarNumber(updatedUser.getKycDetails().getAadhaarNumber());
                user.getKycDetails().setOccupation(updatedUser.getKycDetails().getOccupation());
                user.getKycDetails().setAnnualIncomeRange(updatedUser.getKycDetails().getAnnualIncomeRange());
                user.getRiskProfile().setCategory(updatedUser.getRiskProfile().getCategory());
                user.getRiskProfile().setScore(updatedUser.getRiskProfile().getScore());
            }

            userService.saveUser(user);
            return ResponseEntity.ok("Profile updated successfully!");
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found");
    }



}
