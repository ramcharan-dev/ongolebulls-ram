/*
package dev.ongolebulls.service;

import dev.ongolebulls.model.Contact;
import dev.ongolebulls.repository.ContactRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final JavaMailSender mailSender;

    public void saveAndSendEmail(Contact contact) throws MessagingException {
        // Save to Database
        contactRepository.save(contact);

        // Send Email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setTo("info@ongolebullsinvest.com"); // Your email
        helper.setSubject("New Contact Submission");
        helper.setText("Name: " + contact.getName() + "\nEmail: " + contact.getEmail() + "\nMessage: " + contact.getMessage());

        mailSender.send(message);
    }
}
*/
package dev.ongolebulls.service;

import dev.ongolebulls.model.Contact;
import dev.ongolebulls.repository.ContactRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j  // Lombok annotation for logging
public class ContactService {

    private final ContactRepository contactRepository;
    private final JavaMailSender mailSender;

    public void saveAndSendEmail(Contact contact) throws MessagingException {
        try {
            // Save to Database
            log.info("Saving contact: {}", contact);
            contactRepository.save(contact);

            // Send Email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo("info@ongolebullsinvest.com"); // Receiver Email
            helper.setSubject("New Contact Submission");
            helper.setText("Name: " + contact.getName() + "\nEmail: " + contact.getEmail() + "\nMessage: " + contact.getMessage());

            mailSender.send(message);
            log.info("Email sent successfully to info@ongolebullsinvest.com");

        } catch (MessagingException e) {
            log.error("Error sending email: {}", e.getMessage());
            throw new MessagingException("Failed to send email", e);
        } catch (Exception e) {
            log.error("Unexpected error occurred: {}", e.getMessage());
            throw new RuntimeException("Error processing contact request", e);
        }
    }
}
