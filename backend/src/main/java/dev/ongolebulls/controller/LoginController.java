package dev.ongolebulls.controller;

import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.security.JwtUtil;
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
    private final JwtUtil jwtUtil;

    // Explicit constructor for dependency injection
    public LoginController(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
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
    @Deprecated(since = "JWT-migration", forRemoval = false)
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");

        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Missing email or password"));
        }

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
            Map<String, Object> userPayload = new HashMap<>();
            Object id = getField(user, "id");
            Object fullName = getField(user, "fullName");
            Object userEmail = getField(user, "email");
            Object mobileNumber = getField(user, "mobileNumber");
            Object termsAccepted = getField(user, "termsAccepted");
            Object declarationAccepted = getField(user, "declarationAccepted");

            userPayload.put("id", id != null ? id : 0);
            userPayload.put("fullName", fullName != null ? fullName.toString() : "");
            userPayload.put("email", userEmail != null ? userEmail.toString() : email);
            userPayload.put("mobileNumber", mobileNumber != null ? mobileNumber.toString() : "");
            userPayload.put("username", userEmail != null ? userEmail.toString() : email);
            userPayload.put("termsAccepted", termsAccepted != null ? termsAccepted : false);
            userPayload.put("declarationAccepted", declarationAccepted != null ? declarationAccepted : false);

            Map<String, Object> response = new HashMap<>(userPayload);
            response.put("success", true);
            response.put("message", "Login successful");
            response.put("token", jwtUtil.generateToken(email));
            response.put("user", userPayload);

            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.status(404).body("User not found"));
    }

}
