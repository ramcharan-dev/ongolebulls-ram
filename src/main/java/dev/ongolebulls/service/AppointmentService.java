package dev.ongolebulls.service;

import dev.ongolebulls.dto.AppointmentRequest;
import dev.ongolebulls.model.Appointment;
import dev.ongolebulls.repository.AppointmentRepository;
import dev.ongolebulls.service.EmailService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository repository;
    private final JavaMailSender mailSender;

    /**
     * Uses app.mail.from if available, otherwise falls back to spring.mail.username.
     */
    @Value("${app.mail.from:${spring.mail.username}}")
    private String fromAddress;

    @Transactional
    public Appointment book(AppointmentRequest req) {
        Appointment entity = Appointment.builder()
                .fullName(req.fullName())
                .email(req.email())
                .mobile(req.mobile())
                .employmentType(req.employmentType())
                .employmentSector(req.employmentSector())
                .country(req.country())
                .state(req.state())
                .city(req.city())
                .type(req.type())
                .notes(req.notes())
                .createdAt(OffsetDateTime.now())
                .build();

        Appointment saved = repository.save(entity);
        sendConfirmationEmail(saved);
        return saved;
    }

    private void sendConfirmationEmail(Appointment appt) {
        String subject = "Ongolebulls Invest – Appointment Confirmation";
        String body = "Hello " + appt.getFullName() + ",\n\n" +
                "Thank you for booking an appointment with Ongolebulls Invest.\n" +
                "Your appointment has been successfully scheduled for " + appt.getPreferredDate() +
                " at " + appt.getPreferredTime() + ".\n\n" +
                "Our team will get back to you shortly with further details.\n\n" +
                "Best regards,\nTeam Ongolebulls Invest";

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(appt.getEmail());
        message.setSubject(subject);
        message.setText(body);

        try {
            mailSender.send(message);
            System.out.println("✅ Confirmation email sent to " + appt.getEmail());
        } catch (Exception e) {
            System.err.println("❌ Failed to send confirmation email: " + e.getMessage());
        }
    }
}
