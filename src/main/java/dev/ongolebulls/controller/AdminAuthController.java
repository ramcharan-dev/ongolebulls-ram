package dev.ongolebulls.controller;

import dev.ongolebulls.model.AdminUser;
import dev.ongolebulls.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = {"http://localhost:8080", "https://www.ongolebullsinvest.com", "https://ongolebullsinvest.com"})
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


    @GetMapping("/{adminId}")
    public Map<String, Object> getAdmin(@PathVariable Long adminId) {
        Map<String, Object> response = new HashMap<>();

        Optional<AdminUser> optionalUser = adminUserRepository.findById(adminId);

        if (optionalUser.isEmpty()) {
            response.put("success", false);
            response.put("message", "Admin not found");
            return response;
        }

        AdminUser user = optionalUser.get();

        response.put("success", true);
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());

        return response;
    }

    @PutMapping("/{adminId}")
    public Map<String, Object> updateAdmin(
            @PathVariable Long adminId,
            @RequestBody Map<String, String> body
    ) {
        Map<String, Object> response = new HashMap<>();

        Optional<AdminUser> optionalUser = adminUserRepository.findById(adminId);

        if (optionalUser.isEmpty()) {
            response.put("success", false);
            response.put("message", "Admin not found");
            return response;
        }

        AdminUser user = optionalUser.get();

        if (body.containsKey("name")) user.setName(body.get("name"));
        if (body.containsKey("email")) user.setEmail(body.get("email"));

        if (body.containsKey("password") && body.get("password") != null && !body.get("password").isBlank()) {
            user.setPassword(body.get("password")); // later: hash it
        }

        adminUserRepository.save(user);

        response.put("success", true);
        response.put("message", "Profile updated successfully");
        return response;
    }



}
