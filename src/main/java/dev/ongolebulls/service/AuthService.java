package dev.ongolebulls.service;

import dev.ongolebulls.model.LoginRequest;
import dev.ongolebulls.model.RegisterRequest;
import dev.ongolebulls.model.ResetPasswordRequest;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();  // Secure password hashing
    }

    public String loginUser(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByUsername(request.getUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                return "Login successful!";
            }
        }

        return "Invalid username or password.";
    }

    public String registerUser(RegisterRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists.";
        }

        User user = new User();
        user.setUsername(request.getUsername()); // Critical fix - ensure username is set
        user.setFirstName(request.getFname());
        user.setLastName(request.getLname());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword())); // Password encryption

        userRepository.save(user);
        return "Registration successful!";
    }

    public String resetPassword(ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByUsernameOrMobile(
                request.getResetUsername(), request.getResetUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(request.getNewPassword())); // Encrypt new password
            userRepository.save(user);
            return "Password reset successfully!";
        }

        return "User not found.";
    }
}
