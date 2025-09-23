package dev.ongolebulls.controller;

import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/login")
@RequiredArgsConstructor
public class LoginController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @PostMapping
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        return userRepository.findByEmail(email).map(user -> {
            // Check if account is enabled
            if (!user.isEnabled()) {
                return ResponseEntity.status(403).body("Account not activated");
            }

            // Correct check (use hashed password from DB)
            if (!passwordEncoder.matches(password, user.getPasswordHash())) {
                return ResponseEntity.status(401).body("Invalid credentials");
            }


            // Hide sensitive fields before returning
            user.setPasswordHash(null);

            // Optional: Return only necessary fields instead of full entity
            Map<String, Object> response = new HashMap<>();
            response.put("id", user.getId());
            response.put("fullName", user.getFullName());
            response.put("email", user.getEmail());
            response.put("mobileNumber", user.getMobileNumber());
            response.put("termsAccepted", user.isTermsAccepted());
            response.put("declarationAccepted", user.isDeclarationAccepted());

            return ResponseEntity.ok(response);
        }).orElse(ResponseEntity.status(404).body("User not found"));
    }

}
