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
@CrossOrigin(origins = "*")
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
}
