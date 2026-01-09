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
    private final EmailService emailService;

    /**
     * Uses app.mail.from if available, otherwise falls back to spring.mail.username.
     */
    @Value("${app.mail.from:${spring.mail.username}}")
    private String fromAddress;

    @Value("${admin.email:info@ongolebullsinvest.com}")
    private String adminEmail;

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
        sendAdminNotificationEmail(saved);
        return saved;
    }

    private void sendConfirmationEmail(Appointment appt) {
        String subject = "Ongolebulls Invest – Appointment Confirmation";
        String body = "Hello " + appt.getFullName() + ",\n\n" +
                "Thank you for booking an appointment with Ongolebulls Invest.\n" +
                "Your appointment has been successfully scheduled for "
//                + appt.getPreferredDate() +
//                " at " + appt.getPreferredTime() + ".\n\n"
                +
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

    private void sendAdminNotificationEmail(Appointment appt) {
        try {
            String subject = "New Appointment Request - " + appt.getFullName();
            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='background: linear-gradient(135deg, #bd2a1f 0%%, #bb9236 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>" +
                "<h1 style='color: white; margin: 0;'>New Appointment Request</h1>" +
                "</div>" +
                "<div style='background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;'>" +
                "<h2 style='color: #bd2a1f;'>Appointment Details</h2>" +
                "<p>A new appointment request has been received and requires your attention.</p>" +
                "<div style='background: white; border: 2px solid #bd2a1f; border-radius: 8px; padding: 20px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><strong>Full Name:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Email:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Mobile:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Employment Type:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Employment Sector:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Location:</strong> %s, %s, %s</p>" +
                "<p style='margin: 5px 0;'><strong>Appointment Type:</strong> %s</p>" +
                "%s" +
                "<p style='margin: 5px 0;'><strong>Requested Date:</strong> %s</p>" +
                "</div>" +
                "<p style='color: #6b7280; font-size: 14px;'>Please log into the admin dashboard to view and manage this appointment request.</p>" +
                "<div style='background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;'>" +
                "<p style='margin: 0; color: #92400e;'><strong>⚠️ Action Required:</strong> This appointment request is pending review.</p>" +
                "</div>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>" +
                "<p style='color: #6b7280; font-size: 12px; text-align: center;'>© OngoleBulls Invest. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                appt.getFullName(),
                appt.getEmail(),
                appt.getMobile(),
                appt.getEmploymentType(),
                appt.getEmploymentSector(),
                appt.getCity(),
                appt.getState(),
                appt.getCountry(),
                appt.getType().toString().replace("_", " "),
                appt.getNotes() != null && !appt.getNotes().isEmpty() ?
                    "<p style='margin: 5px 0;'><strong>Notes:</strong> " + appt.getNotes() + "</p>" : "",
                appt.getCreatedAt().toString()
            );
            emailService.sendHtmlMail(adminEmail, subject, htmlBody);
            System.out.println("✓ Appointment notification email sent to admin: " + adminEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send appointment notification to admin: " + e.getMessage());
            e.printStackTrace();
        }
    }
}
