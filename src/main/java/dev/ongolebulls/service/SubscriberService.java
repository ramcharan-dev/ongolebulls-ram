package dev.ongolebulls.service;


import dev.ongolebulls.model.Subscriber;
import dev.ongolebulls.repository.SubscriberRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class SubscriberService {
    @Autowired
    private SubscriberRepository subscriberRepository;

    @Autowired
    private JavaMailSender mailSender;

    private final String ADMIN_EMAIL = "info@ongolebullsinvest.com"; // Your email

    public String subscribe(String email) {
        if (subscriberRepository.existsByEmail(email)) {
            return "Email is already subscribed!";
        }

        Subscriber subscriber = new Subscriber();
        subscriber.setEmail(email);
        subscriberRepository.save(subscriber);

        sendEmailNotification(email); // Send an email notification to you
        return "Subscription successful!";
    }

    private void sendEmailNotification(String subscriberEmail) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(ADMIN_EMAIL); // Send to your email
        message.setSubject("New Subscriber Alert!");
        message.setText("A new user has subscribed with the email: " + subscriberEmail);

        mailSender.send(message);
    }
}
