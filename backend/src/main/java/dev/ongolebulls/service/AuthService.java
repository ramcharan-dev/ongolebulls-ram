/*
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
}*//*

package dev.ongolebulls.service;

import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

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
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFname());
        user.setLastName(request.getLname());
        user.setMobile(request.getMobile());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        // extra fields
        user.setPanNumber(request.getPanNumber());
        user.setAadhaarNumber(request.getAadhaarNumber());
        user.setEmail(request.getEmail());

        user.setAccountHolderName(request.getAccountHolderName());
        user.setBankName(request.getBankName());
        user.setIfscCode(request.getIfscCode());
        user.setAccountNumberEncrypted(request.getAccountNumberEncrypted());

        user.setOccupation(request.getOccupation());
        user.setEmployerName(request.getEmployerName());
        user.setIncomeRange(request.getIncomeRange());

        user.setDeclarationAccepted(request.isDeclarationAccepted());

        userRepository.save(user);
        return "Registration successful!";
    }

    public String resetPassword(ResetPasswordRequest request) {
        Optional<User> userOptional = userRepository.findByUsernameOrMobile(
                request.getResetUsername(), request.getResetUsername());

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            userRepository.save(user);
            return "Password reset successfully!";
        }

        return "User not found.";
    }
}
*/
package dev.ongolebulls.service;

import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.PasswordResetTokenRepository;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
    private final PasswordResetTokenRepository tokenRepository;    // ✅ final

    // 🔹 Login with email OR mobileNumber
    public String loginUser(LoginRequest request) {
        Optional<User> userOptional = userRepository.findByEmailOrMobileNumber(
                request.getLoginId(), request.getLoginId()
        );

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
                return "Login successful!";
            }
        }
        return "Invalid email/mobile or password.";
    }

    // 🔹 Registration
    public String registerUser(RegisterRequest request) {
        // Check if email or mobileNumber already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists.";
        }
        if (userRepository.findByMobileNumber(request.getMobile()).isPresent()) {
            return "Mobile number already exists.";
        }

        User user = new User();

        // ✅ Full name instead of firstName + lastName
        user.setFullName(request.getFname() + " " + request.getLname());

        // ✅ Use correct field names
        user.setMobileNumber(request.getMobile());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword())); // Encrypt password

        // ✅ Handle optional KYC & Bank details via embedded entities
        KycDetails kyc = new KycDetails();
        kyc.setPanNumber(request.getPanNumber());
        kyc.setAadhaarNumber(request.getAadhaarNumber());
        kyc.setOccupation(request.getOccupation());
        kyc.setEmployerName(request.getEmployerName());
        kyc.setIncomeRange(request.getIncomeRange());
        user.setKycDetails(kyc);

        BankDetails bank = new BankDetails();
        bank.setAccountHolderName(request.getAccountHolderName());
        bank.setBankName(request.getBankName());
        bank.setIfscCode(request.getIfscCode());
        bank.setAccountNumberEncrypted(request.getAccountNumberEncrypted());
        user.setBankDetails(bank);

        // ✅ Terms/declaration
        user.setDeclarationAccepted(request.isDeclarationAccepted());
        user.setTermsAccepted(true);

        userRepository.save(user);
        return "Registration successful!";
    }

    /**
     * Validate whether a reset token exists and is not expired.
     */
    public boolean isResetTokenValid(String token) {
        Optional<PasswordResetToken> optionalToken = tokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            return false;
        }
        PasswordResetToken resetToken = optionalToken.get();
        return !resetToken.getExpiryDate().isBefore(LocalDateTime.now());
    }

    /**
     * Consume a reset token and update the user's password.
     */
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> optionalToken = tokenRepository.findByToken(token);
        if (optionalToken.isEmpty()) {
            return false;
        }

        PasswordResetToken resetToken = optionalToken.get();

        // Check expiry (30 minutes logic is enforced here)
        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        // Fetch user by email
        Optional<User> optionalUser = userRepository.findByEmail(resetToken.getEmail());
        if (optionalUser.isEmpty()) {
            return false;
        }

        User user = optionalUser.get();
        // Encode password and save in the correct column
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Optionally delete token after successful reset
        tokenRepository.delete(resetToken);

        return true;
    }

}
