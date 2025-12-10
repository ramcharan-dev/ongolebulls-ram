package dev.ongolebulls.controller;

import dev.ongolebulls.service.SubscriberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/subscribers")
@CrossOrigin(origins = {"http://localhost:8080", "https://ongolebullsinvest.com"}, allowedHeaders = "*")
public class SubscriberController {

    @Autowired
    private SubscriberService subscriberService;

    @PostMapping("/subscribe")
    public ResponseEntity<Map<String, Object>> subscribe(@RequestBody Map<String, String> request) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = request.get("email");

            if (email == null || email.trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required");
                return ResponseEntity.badRequest().body(response);
            }

            String message = subscriberService.subscribe(email);
            response.put("success", true);
            response.put("message", message);
            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);

        } catch (Exception e) {
            System.err.println("Subscribe error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Subscription failed. Please try again later.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/unsubscribe")
    public ResponseEntity<Map<String, Object>> unsubscribe(@RequestParam("token") String token) {
        Map<String, Object> response = new HashMap<>();

        try {
            boolean success = subscriberService.unsubscribe(token);

            if (success) {
                response.put("success", true);
                response.put("message", "You have been unsubscribed successfully.");
                return ResponseEntity.ok(response);
            } else {
                response.put("success", false);
                response.put("message", "Invalid or expired unsubscribe link.");
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            System.err.println("Unsubscribe error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "An error occurred. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getSubscriberCount() {
        Map<String, Object> response = new HashMap<>();
        try {
            long count = subscriberService.getSubscriberCount();
            response.put("success", true);
            response.put("count", count);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("Count error: " + e.getMessage());
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Failed to fetch subscriber count");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/test-email")
    public ResponseEntity<Map<String, Object>> testEmail() {
        Map<String, Object> response = new HashMap<>();
        try {
            subscriberService.testEmailConfiguration();
            response.put("success", true);
            response.put("message", "Test email sent successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Email test failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }



}
