package dev.ongolebulls.service;

import dev.ongolebulls.model.EmailOtp;
import dev.ongolebulls.repository.EmailOtpRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
@Slf4j
public class OtpService {

    private final EmailOtpRepository otpRepo;
    private final EmailService emailService;

    public void generateAndSend(String email) {
        // Generate 6-digit OTP
        String otp = String.valueOf((int) (Math.random() * 900000) + 100000);

        // Save OTP entity
        EmailOtp entity = EmailOtp.builder()
                .email(email)
                .otp(otp)
                .expiresAt(Instant.now().plus(10, ChronoUnit.MINUTES))
                .used(false)
                .build();
        otpRepo.save(entity);

        try {
            // ✅ Send rich HTML OTP by default (falls back to plain text inside EmailService)
            emailService.sendRichOtp(email, otp);
            log.info("✅ OTP generated and sent to {}", email);

        } catch (Exception e) {
            log.error("❌ Failed to send OTP to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to send OTP: " + e.getMessage(), e);
        }
    }

    public boolean verify(String email, String otp) {
        var rec = otpRepo.findFirstByEmailAndOtpAndUsedIsFalseOrderByIdDesc(email, otp);
        if (rec.isEmpty()) {
            log.warn("⚠️ OTP verification failed for {}: no matching record", email);
            return false;
        }

        EmailOtp e = rec.get();
        if (e.getExpiresAt().isBefore(Instant.now())) {
            log.warn("⚠️ OTP for {} expired at {}", email, e.getExpiresAt());
            return false;
        }

        e.setUsed(true);
        otpRepo.save(e);
        log.info("✅ OTP verified successfully for {}", email);
        return true;
    }
}
