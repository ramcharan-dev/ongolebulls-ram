/*

package dev.ongolebulls.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // Always send from your official email
    private final String fromAddress = "info@ongolebullsinvest.com";


*/
/**
     * Plain Text OTP Mail (multi-line message)
     *//*


    public void sendOtp(String to, String otp, String s) {
        String body = """
                Dear Investor,

                Your One-Time Password (OTP) for OngoleBulls Invest is: %s

                Please use this OTP to complete your verification.
                It is valid for 10 minutes only.

                If you did not request this OTP, please ignore this message or contact our support team immediately.

                Warm Regards,
                OngoleBulls Invest Team
                """.formatted(otp);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setFrom(fromAddress);
        msg.setTo(to);
        msg.setSubject("Your OngoleBulls Signup OTP");
        msg.setText(body);
        mailSender.send(msg);
    }


*/
/**
     * Rich HTML OTP Mail (professional template with logo)
     *//*


    public void sendRichOtp(String to, String otp) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        // HTML content with embedded logo reference (cid:logoImage)
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                <h2 style="color: #006400;">OngoleBulls Invest</h2>
                <p>Dear Investor,</p>
                <p><b>Your One-Time Password (OTP) is:</b></p>
                <h3 style="color: #d9534f;">%s</h3>
                <p>This OTP is valid for <b>10 minutes</b>.</p>
                <p>If you did not request this OTP, please ignore this message or 
                <a href="mailto:support@ongolebullsinvest.com">contact support</a>.</p>
                <br>
                <p>
                    Warm Regards,<br>
                    OngoleBulls Invest Team
                </p>
                <img src="cid:logoImage" alt="OngoleBulls Logo" style="margin-top:10px; max-height:60px;">
                <br>
                <p style="font-size: 12px; color: #888;">
                    <a href="https://www.ongolebullsinvest.com">www.ongolebullsinvest.com</a>
                </p>
            </div>
            """.formatted(otp);

        helper.setFrom(fromAddress);
        helper.setTo(to);
        helper.setSubject("Your OngoleBulls Signup OTP");
        helper.setText(htmlContent, true); // true = HTML enabled

        // Attach logo from resources (e.g., src/main/resources/static/logo.png)
        helper.addInline("logoImage", new ClassPathResource("assets/logo3.png"));

        mailSender.send(message);
    }
}

*/
package dev.ongolebulls.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    // Always send from your official email
    private final String fromAddress = "info@ongolebullsinvest.com";

    /**
     * Plain Text OTP Mail
     */
    public void sendOtp(String to, String otp) {
        try {
            String body = """
                    Dear Investor,

                    Your One-Time Password (OTP) for OngoleBulls Invest is: %s

                    Please use this OTP to complete your verification.
                    It is valid for 10 minutes only.

                    If you did not request this OTP, please ignore this message or contact our support team immediately.

                    Warm Regards,
                    OngoleBulls Invest Team
                    """.formatted(otp);

            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(fromAddress);
            msg.setTo(to);
            msg.setSubject("Your OngoleBulls Signup OTP");
            msg.setText(body);

            mailSender.send(msg);
            log.info("✅ OTP email sent successfully to {}", to);

        } catch (Exception e) {
            log.error("❌ Failed to send plain OTP email to {}: {}", to, e.getMessage(), e);
            throw new RuntimeException("Failed to send OTP: " + e.getMessage(), e);
        }
    }

    /**
     * Rich HTML OTP Mail (professional template with logo)
     */
    public void sendRichOtp(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            // HTML content with embedded logo reference
            String htmlContent = """
                    <div style="font-family: Arial, sans-serif; line-height: 1.5; color: #333;">
                        <h2 style="color: #006400;">OngoleBulls Invest</h2>
                        <p>Dear Investor,</p>
                        <p><b>Your One-Time Password (OTP) is:</b></p>
                        <h3 style="color: #d9534f;">%s</h3>
                        <p>This OTP is valid for <b>10 minutes</b>.</p>
                        <p>If you did not request this OTP, please ignore this message or 
                        <a href="mailto:support@ongolebullsinvest.com">contact support</a>.</p>
                        <br>
                        <p>
                            Warm Regards,<br>
                            OngoleBulls Invest Team
                        </p>
                        <img src="cid:logoImage" alt="OngoleBulls Logo" style="margin-top:10px; max-height:60px;">
                        <br>
                        <p style="font-size: 12px; color: #888;">
                            <a href="https://www.ongolebullsinvest.com">www.ongolebullsinvest.com</a>
                        </p>
                    </div>
                    """.formatted(otp);

            helper.setFrom("ongolebullsinvest@gmail.com");
            helper.setTo(to);
            helper.setSubject("Your OngoleBulls Signup OTP");
            helper.setText(htmlContent, true);

            // Attach logo (make sure this exists in src/main/resources/assets/logo.png)
            helper.addInline("logoImage", new ClassPathResource("assets/logo 3.png"));

            mailSender.send(message);
            log.info("✅ Rich HTML OTP email sent successfully to {}", to);

        } catch (Exception e) {
            log.error("❌ Failed to send rich OTP email to {}: {}", to, e.getMessage(), e);

            // fallback to plain OTP email
            try {
                sendOtp(to, otp);
            } catch (Exception ex) {
                log.error("❌ Fallback plain OTP email also failed for {}: {}", to, ex.getMessage(), ex);
                throw new RuntimeException("Failed to send OTP email: " + ex.getMessage(), ex);
            }
        }
    }

}
