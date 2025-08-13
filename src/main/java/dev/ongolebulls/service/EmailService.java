//package dev.ongolebulls.service;
//
//import jakarta.mail.MessagingException;
//import jakarta.mail.internet.MimeMessage;
//import lombok.RequiredArgsConstructor;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.mail.javamail.MimeMessageHelper;
//import org.springframework.stereotype.Service;
//
//@Service
//@RequiredArgsConstructor
//public class EmailService {
//
//    private final JavaMailSender mailSender;
//
//    public void sendEmail(String to, String subject, String text) throws MessagingException {
//        MimeMessage message = mailSender.createMimeMessage();
//        MimeMessageHelper helper = new MimeMessageHelper(message, true);
//        helper.setTo(to);
//        helper.setSubject(subject);
//        helper.setText(text, true);
//        mailSender.send(message);
//    }
//}
package dev.ongolebulls.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    private static final String DEFAULT_FROM = "info@ongolebullsinvest.com";

    /**
     * Send an email with HTML content.
     *
     * @param to      Recipient email address
     * @param subject Email subject
     * @param text    Email body in HTML format
     * @return true if email sent successfully, false otherwise
     */
    public boolean sendEmail(String to, String subject, String text) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(DEFAULT_FROM);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true); // true = HTML

            mailSender.send(message);
            return true;
        } catch (MessagingException ex) {
            // Log the error, you can use a logger here
            ex.printStackTrace();
            return false;
        }
    }

    /**
     * Overloaded method to support CC and BCC.
     */
    public boolean sendEmail(String to, String subject, String text, String[] cc, String[] bcc) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setFrom(DEFAULT_FROM);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(text, true);

            if (cc != null) {
                helper.setCc(cc);
            }
            if (bcc != null) {
                helper.setBcc(bcc);
            }

            mailSender.send(message);
            return true;
        } catch (MessagingException ex) {
            ex.printStackTrace();
            return false;
        }
    }
}
