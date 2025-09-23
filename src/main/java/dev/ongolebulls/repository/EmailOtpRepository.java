package dev.ongolebulls.repository;
import dev.ongolebulls.model.EmailOtp;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EmailOtpRepository extends JpaRepository<EmailOtp, Long> {
    Optional<EmailOtp> findFirstByEmailAndOtpAndUsedIsFalseOrderByIdDesc(String email, String otp);
}
