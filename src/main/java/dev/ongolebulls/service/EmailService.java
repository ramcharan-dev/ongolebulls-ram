package dev.ongolebulls.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    // Always send from your official email
    private final String fromAddress = "info@ongolebullsinvest.com";

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    /**
     * Plain Text OTP Mail
     */
    public void sendOtp(String to, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromAddress);
        message.setTo(to);
        message.setSubject("Your OTP for OngoleBulls Invest");
        message.setText("Your OTP is: " + otp + "\n\nThis OTP is valid for 10 minutes.\n\nDo not share this OTP with anyone.");
        mailSender.send(message);
        System.out.println("✓ Plain OTP email sent to: " + to);
    }

    /**
     * Rich HTML OTP Mail with branding
     */
    public void sendRichOtp(String to, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromAddress);
            helper.setTo(to);
            helper.setSubject("Your OTP for OngoleBulls Invest");

            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='background: linear-gradient(135deg, #bd2a1f 0%%, #bb9236 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>" +
                "<h1 style='color: white; margin: 0;'>OngoleBulls Invest</h1>" +
                "</div>" +
                "<div style='background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;'>" +
                "<h2 style='color: #bd2a1f;'>Your OTP Code</h2>" +
                "<p>Hello,</p>" +
                "<p>Your One-Time Password (OTP) for verification is:</p>" +
                "<div style='background: white; border: 2px dashed #bd2a1f; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;'>" +
                "<h1 style='color: #bd2a1f; font-size: 36px; letter-spacing: 8px; margin: 0; font-family: monospace;'>%s</h1>" +
                "</div>" +
                "<p><strong>This OTP is valid for 10 minutes.</strong></p>" +
                "<p style='color: #6b7280; font-size: 14px;'>If you did not request this OTP, please ignore this email.</p>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>" +
                "<p style='color: #6b7280; font-size: 12px; text-align: center;'>© OngoleBulls Invest. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                otp
            );

            helper.setText(htmlBody, true);
            mailSender.send(message);
            System.out.println("✓ Rich HTML OTP email sent to: " + to);

        } catch (Exception e) {
            System.err.println("❌ Failed to send rich OTP email to " + to + ": " + e.getMessage());
            e.printStackTrace();

            // fallback to plain OTP email
            try {
                sendOtp(to, otp);
            } catch (Exception ex) {
                System.err.println("❌ Fallback plain OTP email also failed for " + to + ": " + ex.getMessage());
                throw new RuntimeException("Failed to send OTP email: " + ex.getMessage(), ex);
            }
        }
    }

    /**
     * Plain text email
     */
    public void sendMail(String toEmail, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject(subject);
        message.setText(body);
        message.setFrom("info@ongolebullsinvest.com");
        mailSender.send(message);
        System.out.println("✓ Email sent to: " + toEmail);
    }

    /**
     * HTML email
     */
    public void sendHtmlMail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("info@ongolebullsinvest.com");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true = HTML

            mailSender.send(message);
            System.out.println("✓ HTML Email sent successfully to: " + to);
        } catch (MessagingException e) {
            System.err.println("✗ Failed to send HTML email to " + to + ": " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to send HTML email", e);
        }
    }

    /**
     * Send ticket acknowledgement email to user
     */
    public void sendTicketAcknowledgement(String to, String userName, String ticketId, String issueType) {
        try {
            String subject = "Support Ticket Created - " + ticketId;
            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='background: linear-gradient(135deg, #bd2a1f 0%%, #bb9236 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>" +
                "<h1 style='color: white; margin: 0;'>OngoleBulls Invest</h1>" +
                "</div>" +
                "<div style='background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;'>" +
                "<h2 style='color: #bd2a1f;'>Support Ticket Created</h2>" +
                "<p>Dear %s,</p>" +
                "<p>Thank you for contacting OngoleBulls Invest support. We have received your ticket and our team will review it shortly.</p>" +
                "<div style='background: white; border: 2px solid #bd2a1f; border-radius: 8px; padding: 20px; margin: 20px 0;'>" +
                "<p style='margin: 0;'><strong>Ticket ID:</strong> <span style='color: #bd2a1f; font-size: 18px; font-weight: bold;'>%s</span></p>" +
                "<p style='margin: 10px 0 0 0;'><strong>Issue Type:</strong> %s</p>" +
                "</div>" +
                "<p>You can track the status of your ticket by logging into your dashboard. We will notify you via email when there are any updates.</p>" +
                "<p>Our support team typically responds within 24-48 hours during business days.</p>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>" +
                "<p style='color: #6b7280; font-size: 12px; text-align: center;'>© OngoleBulls Invest. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                userName, ticketId, issueType
            );
            sendHtmlMail(to, subject, htmlBody);
        } catch (Exception e) {
            System.err.println("❌ Failed to send ticket acknowledgement email: " + e.getMessage());
        }
    }

    /**
     * Send ticket notification email to support team
     */
    public void sendTicketNotificationToSupport(String supportEmail, String ticketId, String userName, String userEmail, String issueType, String description) {
        try {
            String subject = "New Support Ticket - " + ticketId;
            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='background: linear-gradient(135deg, #bd2a1f 0%%, #bb9236 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>" +
                "<h1 style='color: white; margin: 0;'>New Support Ticket</h1>" +
                "</div>" +
                "<div style='background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;'>" +
                "<h2 style='color: #bd2a1f;'>Ticket Details</h2>" +
                "<div style='background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><strong>Ticket ID:</strong> <span style='color: #bd2a1f; font-weight: bold;'>%s</span></p>" +
                "<p style='margin: 5px 0;'><strong>User:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Email:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Issue Type:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Description:</strong></p>" +
                "<div style='background: #f3f4f6; padding: 15px; border-radius: 5px; margin-top: 10px;'>%s</div>" +
                "</div>" +
                "<p style='color: #6b7280; font-size: 14px;'>Please log into the admin dashboard to view and manage this ticket.</p>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>" +
                "<p style='color: #6b7280; font-size: 12px; text-align: center;'>© OngoleBulls Invest. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                ticketId, userName, userEmail, issueType, description.replace("\n", "<br>")
            );
            sendHtmlMail(supportEmail, subject, htmlBody);
        } catch (Exception e) {
            System.err.println("❌ Failed to send ticket notification to support: " + e.getMessage());
        }
    }

    /**
     * Send ticket status update email to user
     */
    public void sendTicketStatusUpdate(String to, String userName, String ticketId, String status, String message) {
        try {
            String subject = "Ticket Update - " + ticketId;
            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='background: linear-gradient(135deg, #bd2a1f 0%%, #bb9236 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>" +
                "<h1 style='color: white; margin: 0;'>OngoleBulls Invest</h1>" +
                "</div>" +
                "<div style='background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;'>" +
                "<h2 style='color: #bd2a1f;'>Ticket Status Update</h2>" +
                "<p>Dear %s,</p>" +
                "<p>Your support ticket has been updated:</p>" +
                "<div style='background: white; border: 2px solid #bd2a1f; border-radius: 8px; padding: 20px; margin: 20px 0;'>" +
                "<p style='margin: 0;'><strong>Ticket ID:</strong> <span style='color: #bd2a1f; font-weight: bold;'>%s</span></p>" +
                "<p style='margin: 10px 0 0 0;'><strong>Status:</strong> <span style='color: #059669; font-weight: bold;'>%s</span></p>" +
                "</div>" +
                "%s" +
                "<p>You can view the full details and reply to this ticket by logging into your dashboard.</p>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>" +
                "<p style='color: #6b7280; font-size: 12px; text-align: center;'>© OngoleBulls Invest. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                userName, ticketId, status,
                message != null && !message.isEmpty() ? 
                    "<div style='background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;'><strong>Message:</strong><br>" + message.replace("\n", "<br>") + "</div>" : ""
            );
            sendHtmlMail(to, subject, htmlBody);
        } catch (Exception e) {
            System.err.println("❌ Failed to send ticket status update email: " + e.getMessage());
        }
    }

    /**
     * Send document submission confirmation email to user
     */
    public void sendDocumentSubmissionConfirmation(String to, String investorName, Long submissionId) {
        try {
            String subject = "Document Submission Confirmation - Reference ID: " + submissionId;
            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='background: linear-gradient(135deg, #bd2a1f 0%%, #bb9236 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>" +
                "<h1 style='color: white; margin: 0;'>OngoleBulls Invest</h1>" +
                "</div>" +
                "<div style='background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;'>" +
                "<h2 style='color: #bd2a1f;'>Document Submission Received</h2>" +
                "<p>Dear %s,</p>" +
                "<p>Thank you for submitting your investment documents. We have successfully received your submission and our team will review it shortly.</p>" +
                "<div style='background: white; border: 2px solid #bd2a1f; border-radius: 8px; padding: 20px; margin: 20px 0;'>" +
                "<p style='margin: 0;'><strong>Reference ID:</strong> <span style='color: #bd2a1f; font-size: 18px; font-weight: bold;'>%d</span></p>" +
                "<p style='margin: 10px 0 0 0;'><strong>Status:</strong> <span style='color: #f59e0b; font-weight: bold;'>Pending Review</span></p>" +
                "</div>" +
                "<p><strong>What happens next?</strong></p>" +
                "<ul style='color: #4b5563; line-height: 1.8;'>" +
                "<li>Our team will review your documents within 2-3 business days</li>" +
                "<li>You will receive an email notification once the review is complete</li>" +
                "<li>If any additional documents are required, we will contact you</li>" +
                "</ul>" +
                "<p style='margin-top: 20px;'>If you have any questions or need assistance, please feel free to contact us.</p>" +
                "<div style='background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><strong>Contact Information:</strong></p>" +
                "<p style='margin: 5px 0;'>📧 Email: invest@ongolebullsinvest.com</p>" +
                "<p style='margin: 5px 0;'>📞 Phone: +91-9281111730</p>" +
                "<p style='margin: 5px 0;'>🌐 Website: <a href='https://www.ongolebullsinvest.com' style='color: #bd2a1f;'>www.ongolebullsinvest.com</a></p>" +
                "</div>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>" +
                "<p style='color: #6b7280; font-size: 12px; text-align: center;'>© OngoleBulls Invest. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                investorName, submissionId
            );
            sendHtmlMail(to, subject, htmlBody);
            System.out.println("✓ Document submission confirmation email sent to: " + to);
        } catch (Exception e) {
            System.err.println("❌ Failed to send document submission confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Send document submission notification email to admin
     */
    public void sendDocumentSubmissionNotificationToAdmin(String adminEmail, String investorName, String investorEmail, 
                                                          String investorPhone, String panNumber, Long submissionId) {
        try {
            String subject = "New Document Submission - Reference ID: " + submissionId;
            String htmlBody = String.format(
                "<!DOCTYPE html>" +
                "<html>" +
                "<head><meta charset='UTF-8'></head>" +
                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                "<div style='background: linear-gradient(135deg, #bd2a1f 0%%, #bb9236 100%%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;'>" +
                "<h1 style='color: white; margin: 0;'>New Document Submission</h1>" +
                "</div>" +
                "<div style='background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;'>" +
                "<h2 style='color: #bd2a1f;'>Document Submission Details</h2>" +
                "<p>A new investment document submission has been received and requires your review.</p>" +
                "<div style='background: white; border: 2px solid #bd2a1f; border-radius: 8px; padding: 20px; margin: 20px 0;'>" +
                "<p style='margin: 5px 0;'><strong>Reference ID:</strong> <span style='color: #bd2a1f; font-weight: bold;'>%d</span></p>" +
                "<p style='margin: 5px 0;'><strong>Investor Name:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Email:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Phone:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>PAN Number:</strong> %s</p>" +
                "<p style='margin: 5px 0;'><strong>Status:</strong> <span style='color: #f59e0b; font-weight: bold;'>Pending Review</span></p>" +
                "<p style='margin: 5px 0;'><strong>Submitted Date:</strong> %s</p>" +
                "</div>" +
                "<p style='color: #6b7280; font-size: 14px;'>Please log into the admin dashboard to review and process this submission.</p>" +
                "<div style='background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px;'>" +
                "<p style='margin: 0; color: #92400e;'><strong>⚠️ Action Required:</strong> This document submission is pending review and approval.</p>" +
                "</div>" +
                "<hr style='border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;'>" +
                "<p style='color: #6b7280; font-size: 12px; text-align: center;'>© OngoleBulls Invest. All rights reserved.</p>" +
                "</div>" +
                "</body>" +
                "</html>",
                submissionId, investorName, investorEmail, investorPhone, panNumber,
                java.time.LocalDateTime.now().format(java.time.format.DateTimeFormatter.ofPattern("dd MMM yyyy, hh:mm a"))
            );
            sendHtmlMail(adminEmail, subject, htmlBody);
            System.out.println("✓ Document submission notification email sent to admin: " + adminEmail);
        } catch (Exception e) {
            System.err.println("❌ Failed to send document submission notification to admin: " + e.getMessage());
            e.printStackTrace();
        }
    }
}

