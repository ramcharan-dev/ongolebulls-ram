package dev.ongolebulls.service;

import dev.ongolebulls.model.AdminUser;
import dev.ongolebulls.repository.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminAuthService {

    @Autowired
    private AdminUserRepository adminRepo;

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // Dynamic login: create admin if not exists
    public boolean dynamicLogin(String email, String password) {
        Optional<AdminUser> userOpt = adminRepo.findByEmail(email);

        if (userOpt.isEmpty()) {
            // Auto-create admin dynamically
            AdminUser newAdmin = new AdminUser();
            newAdmin.setEmail(email);
            newAdmin.setPassword(encoder.encode(password));
            adminRepo.save(newAdmin);
            return true; // first-time login success
        }

        // Admin exists → check password
        AdminUser user = userOpt.get();
        return encoder.matches(password, user.getPassword());
    }
}
