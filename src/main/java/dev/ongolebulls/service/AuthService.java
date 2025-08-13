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
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;
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

    public String registerClient(String fullName, String email, String phone, String password, String profileFor, String relation, String relativeName, String pan, String dob, String gender, String address, String pincode, String city, String state, MultipartFile addressProof, String accountHolder, String bankName, String accountNumber, String ifsc, MultipartFile bankProof, String risk1, String risk2, String risk3, String risk4, String risk5, Map<String, String> allParams) {
    }
}
*//*

package dev.ongolebulls.service;

import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.Optional;
import java.util.Random;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Autowired
    public AuthService(UserRepository userRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public String loginUser(String username, String password, String code) {
        Optional<User> userOptional = userRepository.findByUsernameOrEmail(username, username);

        if (userOptional.isEmpty()) {
            return "User not found!";
        }

        User user = userOptional.get();

        // If not verified, check code
        if (!user.isVerified()) {
            if (code == null || !code.equals(user.getVerificationCode())) {
                return "Invalid verification code or account not verified.";
            }
        }

        // Check password
        if (!passwordEncoder.matches(password, user.getPassword())) {
            return "Incorrect password.";
        }

        return "Login successful!";
    }

    public String registerUser(RegisterRequest request,
                               MultipartFile addressProofFile,
                               MultipartFile cancelledChequeFile) {

        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            return "Username already exists.";
        }
        if (userRepository.findByUsername(request.getEmail()).isPresent()) {
            return "Email already registered.";
        }

        String uploadDir = "/uploads/";
        String addressProofPath = null;
        String chequePath = null;

        try {
            if (addressProofFile != null && !addressProofFile.isEmpty()) {
                addressProofPath = uploadDir + "address_" + request.getUsername() + "_" + addressProofFile.getOriginalFilename();
                addressProofFile.transferTo(new File(addressProofPath));
            }

            if (cancelledChequeFile != null && !cancelledChequeFile.isEmpty()) {
                chequePath = uploadDir + "cheque_" + request.getUsername() + "_" + cancelledChequeFile.getOriginalFilename();
                cancelledChequeFile.transferTo(new File(chequePath));
            }
        } catch (IOException e) {
            return "File upload failed: " + e.getMessage();
        }

        String otp = String.format("%06d", new Random().nextInt(999999));

        User user = new User();
        user.setUsername(request.getUsername());
        user.setFirstName(request.getFname());
        user.setLastName(request.getLname());
        user.setEmail(request.getEmail());
        user.setMobile(request.getMobile());
        user.setPan(request.getPan());
        user.setAadhaar(request.getAadhaar());
        user.setDob(request.getDob());
        user.setGender(request.getGender());
        user.setAddress(request.getAddress());
        user.setOccupation(request.getOccupation());
        user.setIncomeBracket(request.getIncomeBracket());
        user.setAccountHolderName(request.getAccountHolderName());
        user.setBankName(request.getBankName());
        user.setIfscCode(request.getIfscCode());
        user.setAccountNumber(request.getAccountNumber());
        user.setNomineeName(request.getNomineeName());
        user.setNomineeRelation(request.getNomineeRelation());
        user.setNomineeAge(request.getNomineeAge());
        user.setRole(request.getRole());
        user.setAddressProofPath(addressProofPath);
        user.setChequeProofPath(chequePath);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setIsActive(false);
        user.setVerificationCode(otp);
        user.setVerified(false);

        userRepository.save(user);

        String subject = "Verify your account - Ongolebulls Invest";
        String body = "Dear " + user.getFirstName() + ",<br><br>" +
                "Thank you for registering.<br>" +
                "Your 6-digit verification code is: <strong>" + otp + "</strong><br><br>" +
                "Please enter this code on the registration page to complete your verification.<br><br>" +
                "Regards,<br>Ongolebulls Team";

        try {
            emailService.sendEmail(user.getEmail(), subject, body);
        } catch (Exception e) {
            return "Registration failed: Could not send verification email.";
        }

        return "Registration successful. Check your email for the verification code.";
    }

    public String verifyUser(String username, String code) {
        Optional<User> userOptional = userRepository.findByUsername(username);

        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getVerificationCode() != null && user.getVerificationCode().equals(code)) {
                user.setIsActive(true);
                user.setVerified(true); // set verified to true
                user.setVerificationCode(null); // clear code after successful verification
                userRepository.save(user);
                return "Account verified successfully!";
            } else {
                return "Invalid verification code.";
            }
        }
        return "User not found.";
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

import dev.ongolebulls.config.AppProperties;
import dev.ongolebulls.dto.SignupPayload;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final KYCRepository kycRepository;
    private final BankRepository bankRepository;
    private final RiskProfileRepository riskRepository;
    private final PasswordEncoder passwordEncoder;  // ✅ Changed from BCryptPasswordEncoder
    private final AppProperties appProps;

    public User register(SignupPayload p, MultipartFile addressProof, MultipartFile chequeProof,
                         boolean emailVerified, boolean mobileVerified, String ipAddress) throws Exception {

        if (p == null || p.getBasic() == null || p.getKyc() == null ||
                p.getBank() == null || p.getRiskProfile() == null || p.getConsents() == null) {
            throw new IllegalArgumentException("Incomplete signup payload");
        }

        if (userRepository.existsByEmail(p.getBasic().getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        String addressProofPath = saveFile(addressProof, "address");
        String chequeProofPath  = saveFile(chequeProof, "bank");

        User user = User.builder()
                .fullName(p.getBasic().getFullName())
                .email(p.getBasic().getEmail())
                .mobile(p.getBasic().getMobile())
                .passwordHash(passwordEncoder.encode(p.getBasic().getPassword()))
                .emailVerified(emailVerified)
                .mobileVerified(mobileVerified)
                .profileFor(parseProfileFor(p))
                .relation(p.getProfileType() != null ? p.getProfileType().getRelation() : null)
                .relativeName(p.getProfileType() != null ? p.getProfileType().getRelativeName() : null)
                .c1(p.getConsents().isC1()).c2(p.getConsents().isC2()).c3(p.getConsents().isC3())
                .c4(p.getConsents().isC4()).c5(p.getConsents().isC5())
                .consentTimestamp(LocalDateTime.now())
                .deviceInfo(p.getConsents().getUserAgent())
                .ipAddress(ipAddress)
                .build();
        userRepository.save(user);

        KycDetails kyc = KycDetails.builder()
                .panNumber(p.getKyc().getPan().toUpperCase())
                .dob(LocalDate.parse(p.getKyc().getDob()))
                .gender(p.getKyc().getGender())
                .address(p.getKyc().getAddress())
                .pincode(p.getKyc().getPincode())
                .city(p.getKyc().getCity())
                .state(p.getKyc().getState())
                .addressProofPath(addressProofPath)
                .user(user)
                .build();
        kycRepository.save(kyc);

        BankDetails bank = BankDetails.builder()
                .accountHolderName(p.getBank().getAccountHolder())
                .bankName(p.getBank().getBankName())
                .ifscCode(p.getBank().getIfsc().toUpperCase())
                .accountNumberEncrypted(passwordEncoder.encode(p.getBank().getAccountNumber()))
                .chequeProofPath(chequeProofPath)
                .user(user)
                .build();
        bankRepository.save(bank);

        RiskProfile rp = RiskProfile.builder()
                .score(p.getRiskProfile().getScore())
                .category(p.getRiskProfile().getCategory())
                .user(user)
                .build();
        riskRepository.save(rp);

        return user;
    }

    public boolean login(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .map(u -> passwordEncoder.matches(rawPassword, u.getPasswordHash()))
                .orElse(false);
    }

    private String saveFile(MultipartFile mf, String subfolder) throws Exception {
        if (mf == null || mf.isEmpty()) return null;
        File folder = new File(appProps.getUploadDir() + File.separator + subfolder);
        if (!folder.exists()) folder.mkdirs();
        String fn = UUID.randomUUID() + "_" + mf.getOriginalFilename();
        File dest = new File(folder, fn);
        Files.copy(mf.getInputStream(), dest.toPath(), StandardCopyOption.REPLACE_EXISTING);
        return dest.getAbsolutePath();
    }

    private User.ProfileFor parseProfileFor(SignupPayload p) {
        if (p.getProfileType() == null) return User.ProfileFor.SELF;
        String val = p.getProfileType().getFor();
        if (val == null || val.isBlank()) return User.ProfileFor.SELF;
        try {
            return User.ProfileFor.valueOf(val.toUpperCase());
        } catch (IllegalArgumentException e) {
            return User.ProfileFor.SELF;
        }
    }
}
