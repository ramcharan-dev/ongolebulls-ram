package dev.ongolebulls.service;

import dev.ongolebulls.model.OtpToken;
import dev.ongolebulls.repository.OtpTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OTPService {

    private final OtpTokenRepository otpRepo;
    private final JavaMailSender mailSender;

    private static final String EMAIL_FROM = "info@ongolebullsinvest.com";

    // --- Create OTP and save to DB ---
    public OtpToken createOtp(String target, String type) {
        String otp = generateNumericOtp(6);
        OtpToken t = new OtpToken();
        t.setTarget(target);
        t.setType(type);
        t.setOtp(otp);
        t.setExpireAt(Instant.now().plus(5, ChronoUnit.MINUTES));
        t.setVerified(false);
        otpRepo.save(t);
        return t;
    }

    // --- Verify OTP ---
    public boolean verifyOtp(String target, String type, String otp) {
        Optional<OtpToken> opt = otpRepo.findTopByTargetAndTypeOrderByIdDesc(target, type);
        if (opt.isEmpty()) return false;
        OtpToken t = opt.get();
        if (t.isVerified()) return true;
        if (t.getExpireAt().isBefore(Instant.now())) return false;
        if (!t.getOtp().equals(otp)) return false;
        t.setVerified(true);
        otpRepo.save(t);
        return true;
    }

    // --- Generate numeric OTP ---
    private String generateNumericOtp(int len) {
        Random rnd = new Random();
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < len; i++) sb.append(rnd.nextInt(10));
        return sb.toString();
    }

    // --- Generate and send Email OTP ---
    public void generateEmailOtp(String email) {
        OtpToken otpToken = createOtp(email, "EMAIL");
        sendEmailOtp(email, otpToken.getOtp());
    }

    public boolean verifyEmailOtp(String email, String otp) {
        return verifyOtp(email, "EMAIL", otp);
    }

    private void sendEmailOtp(String to, String otp) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(EMAIL_FROM); // must match your SMTP username
            msg.setTo(to);
            msg.setSubject("Your OTP Code");
            msg.setText("Your OTP code is: " + otp + "\nValid for 5 minutes.");
            mailSender.send(msg);
            System.out.println("OTP sent to email: " + to + " OTP: " + otp);
        } catch (Exception ex) {
            ex.printStackTrace();
            System.out.println("Failed to send OTP email to: " + to);
        }
    }

    // --- Mobile OTP (placeholder) ---
    public void generateMobileOtp(String mobile) {
        OtpToken otpToken = createOtp(mobile, "MOBILE");
        System.out.println("OTP generated for mobile: " + mobile + " OTP: " + otpToken.getOtp());
        // TODO: Integrate SMS API (Twilio, etc.) to send OTP
    }

    public boolean verifyMobileOtp(String mobile, String otp) {
        return verifyOtp(mobile, "MOBILE", otp);
    }
}
