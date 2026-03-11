package dev.ongolebulls.service;

import dev.ongolebulls.model.Blog;
import dev.ongolebulls.model.Subscriber;
import dev.ongolebulls.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;

@Service
public class SubscriberService {

    @Autowired
    private SubscriberRepository subscriberRepository;

    @Autowired
    private EmailService emailService;

    private final String BASE_URL = "https://ongolebullsinvest.com";

    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$"
    );

    @Transactional
    public String subscribe(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }

        email = email.trim().toLowerCase();

        if (!EMAIL_PATTERN.matcher(email).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }

        // Check if email exists and handle resubscription
        Optional<Subscriber> existingSubscriber = subscriberRepository.findByEmail(email);
        if (existingSubscriber.isPresent()) {
            Subscriber existing = existingSubscriber.get();
            if (existing.getStatus() == Subscriber.Status.ACTIVE) {
                throw new IllegalArgumentException("Email is already subscribed!");
            }
            // If UNSUBSCRIBED, reactivate the subscription
            existing.setStatus(Subscriber.Status.ACTIVE);
            existing.setUnsubscribeToken(UUID.randomUUID().toString());
            existing.setSubscribedAt(java.time.LocalDateTime.now());
            Subscriber savedSubscriber = subscriberRepository.save(existing);
            
            // Send emails in separate thread
            final String finalEmail = savedSubscriber.getEmail();
            final String finalToken = savedSubscriber.getUnsubscribeToken();

            new Thread(() -> {
                try {
                    sendConfirmationEmailToSubscriber(finalEmail, finalToken);
                    sendEmailNotificationToAdmin(finalEmail);
                } catch (Exception e) {
                    System.err.println("Error sending emails: " + e.getMessage());
                    e.printStackTrace();
                }
            }).start();

            return "Subscription reactivated! Please check your email for confirmation.";
        }

        try {
            Subscriber subscriber = new Subscriber();
            subscriber.setEmail(email);
            subscriber.setUnsubscribeToken(UUID.randomUUID().toString());
            subscriber.setStatus(Subscriber.Status.ACTIVE);
            subscriber.setSubscribedAt(java.time.LocalDateTime.now());

            Subscriber savedSubscriber = subscriberRepository.save(subscriber);
            System.out.println("✓ Subscriber saved: " + savedSubscriber.getEmail());

            // Send emails in separate thread
            final String finalEmail = savedSubscriber.getEmail();
            final String finalToken = savedSubscriber.getUnsubscribeToken();

            new Thread(() -> {
                try {
                    sendConfirmationEmailToSubscriber(finalEmail, finalToken);
                    sendEmailNotificationToAdmin(finalEmail);
                } catch (Exception e) {
                    System.err.println("Error sending emails: " + e.getMessage());
                    e.printStackTrace();
                }
            }).start();

            return "Subscription successful! Please check your email for confirmation.";
        } catch (Exception e) {
            System.err.println("Subscription error: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to subscribe. Please try again later.");
        }
    }

    private void sendConfirmationEmailToSubscriber(String subscriberEmail, String token) {
        try {
            String subject = "Welcome to Ongolebulls Invest Updates! 🎉";

            String htmlBody = String.format(
                    "<html>" +
                            "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                            "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                            "<h2 style='color: #bb281e;'>Welcome to Ongolebulls Invest! 🎉</h2>" +
                            "<p>Dear Subscriber,</p>" +
                            "<p>Thank you for subscribing to Ongolebulls Invest updates!</p>" +
                            "<p><strong>You will now receive:</strong></p>" +
                            "<ul>" +
                            "<li>✓ Latest blog posts and articles</li>" +
                            "<li>✓ Market insights and analysis</li>" +
                            "<li>✓ Exclusive investment tips</li>" +
                            "<li>✓ Company news and updates</li>" +
                            "</ul>" +
                            "<p>We're excited to have you as part of our community!</p>" +
                            "<hr style='border: 1px solid #eee; margin: 20px 0;'>" +
                            "<p style='font-size: 14px; color: #666;'>To unsubscribe at any time, <a href='%s/unsubscribe.html?token=%s' style='color: #bb281e; text-decoration: underline;'>click here</a>.</p>" +
                            "<br>" +
                            "<p><strong>Best regards,</strong><br>" +
                            "Ongolebulls Invest Team<br>" +
                            "📩 <a href='mailto:info@ongolebullsinvest.com'>info@ongolebullsinvest.com</a><br>" +
                            "📞 +91-9281111730</p>" +
                            "<p>🌐 <a href='https://www.ongolebullsinvest.com' style='color: #bb281e;'>www.ongolebullsinvest.com</a></p>" +
                            "</div>" +
                            "</body>" +
                            "</html>",
                    BASE_URL, token
            );

            emailService.sendHtmlMail(subscriberEmail, subject, htmlBody);
            System.out.println("✓ Confirmation email sent to: " + subscriberEmail);
        } catch (Exception e) {
            System.err.println("✗ Failed to send confirmation email: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private void sendEmailNotificationToAdmin(String subscriberEmail) {
        try {
            String subject = "🔔 New Subscriber Alert!";
            String body = String.format(
                    "Good news!\n\n" +
                            "A new user has subscribed to Ongolebulls Invest updates.\n\n" +
                            "📧 Email: %s\n" +
                            "🕒 Timestamp: %s\n\n" +
                            "📊 Total Subscribers: %d\n\n" +
                            "Keep up the great work!\n\n" +
                            "Best regards,\n" +
                            "Ongolebulls Invest System",
                    subscriberEmail,
                    java.time.LocalDateTime.now(),
                    subscriberRepository.count()
            );

            emailService.sendMail("info@ongolebullsinvest.com", subject, body);
            System.out.println("✓ Admin notification sent");
        } catch (Exception e) {
            System.err.println("✗ Failed to send admin notification: " + e.getMessage());
            e.printStackTrace();
        }
    }

    @Transactional
    public boolean unsubscribe(String token) {
        if (token == null || token.trim().isEmpty()) {
            return false;
        }

        return subscriberRepository.findByUnsubscribeToken(token)
                .map(subscriber -> {
                    String email = subscriber.getEmail();
                    subscriber.setStatus(Subscriber.Status.UNSUBSCRIBED);
                    subscriberRepository.save(subscriber);

                    try {
                        sendUnsubscribeConfirmation(email);
                    } catch (Exception e) {
                        System.err.println("Failed to send unsubscribe confirmation: " + e.getMessage());
                    }

                    return true;
                })
                .orElse(false);
    }

    private void sendUnsubscribeConfirmation(String email) {
        try {
            String subject = "You've Been Unsubscribed — Ongolebulls Invest";

            String htmlBody = String.format(
                    "<html>" +
                            "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                            "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                            "<h2 style='color: #666;'>You've Been Unsubscribed</h2>" +
                            "<p>Hello,</p>" +
                            "<p>You have been successfully unsubscribed from Ongolebulls Invest updates.</p>" +
                            "<p>We're sorry to see you go! If you change your mind, you can always subscribe again at:</p>" +
                            "<p><a href='%s' style='color: #bb281e; font-weight: bold;'>%s</a></p>" +
                            "<p>Thank you for being part of our community.</p>" +
                            "<br>" +
                            "<p><strong>Best regards,</strong><br>" +
                            "Ongolebulls Invest Team<br>" +
                            "📩 <a href='mailto:info@ongolebullsinvest.com'>info@ongolebullsinvest.com</a></p>" +
                            "<p>🌐 <a href='https://www.ongolebullsinvest.com' style='color: #bb281e;'>www.ongolebullsinvest.com</a></p>" +
                            "</div>" +
                            "</body>" +
                            "</html>",
                    BASE_URL, BASE_URL
            );

            emailService.sendHtmlMail(email, subject, htmlBody);
            System.out.println("✓ Unsubscribe confirmation sent to: " + email);
        } catch (Exception e) {
            System.err.println("✗ Failed to send unsubscribe confirmation: " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void notifySubscribersAboutBlog(Blog blog) {
        List<Subscriber> subscribers = subscriberRepository.findByStatus(Subscriber.Status.ACTIVE);

        if (subscribers.isEmpty()) {
            System.out.println("No active subscribers to notify");
            return;
        }

        System.out.println("📧 Sending blog notifications to " + subscribers.size() + " active subscribers...");

        int successCount = 0;
        int failureCount = 0;

        for (Subscriber subscriber : subscribers) {
            try {
                String subject = "📰 New Blog: " + blog.getTitle();

                String htmlBody = String.format(
                        "<html>" +
                                "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                                "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                                "<h2 style='color: #bb281e;'>📰 New Blog Post!</h2>" +
                                "<p>Hello,</p>" +
                                "<p>We've just published a new blog post on Ongolebulls Invest!</p>" +
                                "<div style='background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;'>" +
                                "<h3 style='color: #333; margin-top: 0;'>%s</h3>" +
                                "<p><strong>✍️ Author:</strong> %s</p>" +
                                "<p><strong>Summary:</strong></p>" +
                                "<p>%s</p>" +
                                "<a href='%s/blog-details.html?id=%d' style='display: inline-block; background: #bb281e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 10px;'>Read Full Article →</a>" +
                                "</div>" +
                                "<hr style='border: 1px solid #eee; margin: 20px 0;'>" +
                                "<p style='font-size: 14px; color: #666;'>Don't want to receive these emails anymore? <a href='%s/unsubscribe.html?token=%s' style='color: #bb281e; text-decoration: underline;'>Unsubscribe</a>.</p>" +
                                "<br>" +
                                "<p><strong>Best regards,</strong><br>" +
                                "Ongolebulls Invest Team<br>" +
                                "📩 <a href='mailto:info@ongolebullsinvest.com'>info@ongolebullsinvest.com</a></p>" +
                                "<p>🌐 <a href='https://www.ongolebullsinvest.com' style='color: #bb281e;'>www.ongolebullsinvest.com</a></p>" +
                                "</div>" +
                                "</body>" +
                                "</html>",
                        blog.getTitle(),
                        blog.getAuthor(),
                        blog.getShortDescription(),
                        BASE_URL,
                        blog.getId(),
                        BASE_URL,
                        subscriber.getUnsubscribeToken()
                );

                emailService.sendHtmlMail(subscriber.getEmail(), subject, htmlBody);
                successCount++;
                System.out.println("✓ Blog notification sent to: " + subscriber.getEmail());

                // Small delay to avoid overwhelming email server
                Thread.sleep(100);

            } catch (Exception e) {
                failureCount++;
                System.err.println("✗ Failed to send to " + subscriber.getEmail() + ": " + e.getMessage());
            }
        }

        System.out.println("📧 Blog notifications complete - Success: " + successCount + ", Failed: " + failureCount);
    }

    public long getSubscriberCount() {
        return subscriberRepository.count();
    }

    public void testEmailConfiguration() throws Exception {
        String subject = "Test Email — Configuration Check";
        String htmlBody =
                "<html>" +
                        "<body style='font-family: Arial, sans-serif; line-height: 1.6; color: #333;'>" +
                        "<div style='max-width: 600px; margin: 0 auto; padding: 20px;'>" +
                        "<h2 style='color: #28a745;'>✓ Email Configuration Test</h2>" +
                        "<p>This is a test email to verify email configuration is working correctly.</p>" +
                        "<p>If you received this, your email system is <strong>properly configured</strong>!</p>" +
                        "<br>" +
                        "<p><strong>Best regards,</strong><br>" +
                        "Ongolebulls Invest Team</p>" +
                        "</div>" +
                        "</body>" +
                        "</html>";

        emailService.sendHtmlMail("info@ongolebullsinvest.com", subject, htmlBody);
        System.out.println("✓ Test email sent successfully");
    }
}