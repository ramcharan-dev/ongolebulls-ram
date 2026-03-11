package dev.ongolebulls.controller;

import dev.ongolebulls.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Explicit constructor for dependency injection
    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // Helper method to get field using reflection
    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }

    // Helper method to set field using reflection
    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore if field doesn't exist or can't be set
        }
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        return userRepository.findByEmail(email).map(user -> {
            // Check if account is enabled
            Boolean enabled = (Boolean) getField(user, "enabled");
            if (enabled == null || !enabled) {
                return ResponseEntity.status(403).body("Account not activated");
            }

            // Get password hash using reflection
            String passwordHash = (String) getField(user, "passwordHash");
            if (passwordHash == null) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            // Correct check (use hashed password from DB)
            if (!passwordEncoder.matches(password, passwordHash)) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }

            // Hide sensitive fields before returning
            setField(user, "passwordHash", null);

            // Return user data for frontend to store using reflection
            Map<String, Object> response = new HashMap<>();
            Object id = getField(user, "id");
            Object fullName = getField(user, "fullName");
            Object userEmail = getField(user, "email");
            Object mobileNumber = getField(user, "mobileNumber");
            Object termsAccepted = getField(user, "termsAccepted");
            Object declarationAccepted = getField(user, "declarationAccepted");

            response.put("id", id != null ? id : 0);
            response.put("fullName", fullName != null ? fullName.toString() : "");
            response.put("email", userEmail != null ? userEmail.toString() : email);
            response.put("mobileNumber", mobileNumber != null ? mobileNumber.toString() : "");
            response.put("username", userEmail != null ? userEmail.toString() : email);
            response.put("termsAccepted", termsAccepted != null ? termsAccepted : false);
            response.put("declarationAccepted", declarationAccepted != null ? declarationAccepted : false);
            response.put("success", true);
            response.put("message", "Login successful");

            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.status(404).body("User not found"));
    }

}
