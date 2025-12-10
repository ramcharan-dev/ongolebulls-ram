package dev.ongolebulls.controller;

import dev.ongolebulls.model.AdminUser;
import dev.ongolebulls.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:8080")
public class AdminAuthController {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();

        try {
            String email = body.get("email");
            String password = body.get("password");

            if (email == null || password == null) {
                response.put("success", false);
                response.put("message", "Email and password are required");
                return response;
            }

            Optional<AdminUser> optionalUser = adminUserRepository.findByEmail(email);

            if (optionalUser.isPresent()) {
                AdminUser user = optionalUser.get();
                if (user.getPassword().equals(password)) {
                    response.put("success", true);
                    response.put("message", "Login successful");
                    response.put("name", user.getName()); // Include admin name in the response
                    return response;
                } else {
                    response.put("success", false);
                    response.put("message", "Invalid password");
                    return response;
                }
            } else {
                response.put("success", false);
                response.put("message", "Email not found");
                return response;
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "Server error: " + e.getMessage());
            return response;
        }
    }


    @PostMapping("/add")
    public Map<String, Object> addAdmin(@RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            String email = body.get("email");
            String password = body.get("password");
            String name = body.get("name");

            if (email == null || password == null || name == null) {
                response.put("success", false);
                response.put("message", "All fields are required");
                return response;
            }

            // Check if email already exists
            if (adminUserRepository.findByEmail(email).isPresent()) {
                response.put("success", false);
                response.put("message", "Admin with this email already exists");
                return response;
            }

            AdminUser newUser = new AdminUser();
            newUser.setEmail(email);
            newUser.setPassword(password); // In production, hash passwords!
            newUser.setName(name);

            adminUserRepository.save(newUser);

            response.put("success", true);
            response.put("message", "Admin created successfully");
            return response;

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Server error: " + e.getMessage());
            return response;
        }
    }


    @PutMapping("/update/{id}")
    public Map<String, Object> updateAdmin(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Map<String, Object> response = new HashMap<>();
        try {
            // Find admin user by id
            Optional<AdminUser> existingUserOpt = adminUserRepository.findById(id);
            if (!existingUserOpt.isPresent()) {
                response.put("success", false);
                response.put("message", "Admin user not found");
                return response;
            }

            AdminUser existingUser = existingUserOpt.get();

            // Get updated fields; keep old value if null
            String email = body.get("email");
            String password = body.get("password");
            String name = body.get("name");

            if (email != null && !email.isEmpty()) {
                // Check if email already exists with another admin
                Optional<AdminUser> foundUser = adminUserRepository.findByEmail(email);
                if (foundUser.isPresent() && !foundUser.get().getId().equals(id)) {
                    response.put("success", false);
                    response.put("message", "Another admin with this email already exists");
                    return response;
                }
                existingUser.setEmail(email);
            }

            if (password != null && !password.isEmpty()) {
                existingUser.setPassword(password); // Remember to hash in production!
            }

            if (name != null && !name.isEmpty()) {
                existingUser.setName(name);
            }

            adminUserRepository.save(existingUser);

            response.put("success", true);
            response.put("message", "Admin updated successfully");
            return response;

        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Server error: " + e.getMessage());
            return response;
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<?> getAdminById(@PathVariable Long id) {
        Optional<AdminUser> admin = adminUserRepository.findById(id);
        if (admin.isPresent()) {
            return ResponseEntity.ok(admin.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Admin user not found"));
        }
    }


}
