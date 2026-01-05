package dev.ongolebulls.controller;

import dev.ongolebulls.dto.*;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Helper methods for reflection
    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }

    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore
        }
    }

    private String maskSensitiveData(String data) {
        if (data == null || data.length() <= 4) return "****";
        return "****" + data.substring(data.length() - 4);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getHeader("X-Real-IP");
        }
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        return ip;
    }

    // GET /api/profile/{userId} - Get complete profile
    @GetMapping("/{userId}")
    public ResponseEntity<?> getProfile(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        ProfileCompleteDto dto = convertToProfileDto(user);
        return ResponseEntity.ok(dto);
    }

    // PUT /api/profile/{userId}/personal - Update personal details
    @PutMapping("/{userId}/personal")
    public ResponseEntity<?> updatePersonalDetails(
            @PathVariable Long userId,
            @Valid @RequestBody PersonalDetailsUpdateDto updateDto,
            HttpServletRequest request) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        
        // Update fields (restricted: email, dob, pan are not updated here)
        if (updateDto.getFullName() != null) {
            setField(user, "fullName", updateDto.getFullName());
        }
        if (updateDto.getMobileNumber() != null) {
            setField(user, "mobileNumber", updateDto.getMobileNumber());
        }
        if (updateDto.getGender() != null) {
            setField(user, "gender", updateDto.getGender());
        }
        if (updateDto.getAddress() != null) {
            setField(user, "address", updateDto.getAddress());
        }
        if (updateDto.getCity() != null) {
            setField(user, "city", updateDto.getCity());
        }
        if (updateDto.getState() != null) {
            setField(user, "state", updateDto.getState());
        }
        if (updateDto.getPincode() != null) {
            setField(user, "pincode", updateDto.getPincode());
        }
        setField(user, "isForSelf", updateDto.isForSelf());
        if (updateDto.getRelativeFullName() != null) {
            setField(user, "relativeFullName", updateDto.getRelativeFullName());
        }
        if (updateDto.getRelativeRelation() != null) {
            setField(user, "relativeRelation", updateDto.getRelativeRelation());
        }

        // Log update
        String ip = getClientIp(request);
        // Store IP in a field if available, or log separately
        System.out.println("Profile updated for user " + userId + " from IP: " + ip + " at " + Instant.now());

        user = userRepository.save(user);
        ProfileCompleteDto dto = convertToProfileDto(user);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Personal details updated successfully",
                "data", dto
        ));
    }

    // PUT /api/profile/{userId}/bank - Update bank details
    @PutMapping("/{userId}/bank")
    public ResponseEntity<?> updateBankDetails(
            @PathVariable Long userId,
            @Valid @RequestBody BankDetailsUpdateDto updateDto,
            HttpServletRequest request) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        BankDetails bankDetails = (BankDetails) getField(user, "bankDetails");
        
        if (bankDetails == null) {
            bankDetails = new BankDetails();
        }

        if (updateDto.getBankName() != null) {
            setField(bankDetails, "bankName", updateDto.getBankName());
        }
        if (updateDto.getAccountHolderName() != null) {
            setField(bankDetails, "accountHolderName", updateDto.getAccountHolderName());
        }
        if (updateDto.getAccountNumber() != null) {
            // Encrypt account number (in production, use proper encryption)
            setField(bankDetails, "accountNumberEncrypted", updateDto.getAccountNumber());
        }
        if (updateDto.getIfsc() != null) {
            setField(bankDetails, "ifsc", updateDto.getIfsc());
        }

        setField(user, "bankDetails", bankDetails);
        
        // Log update
        String ip = getClientIp(request);
        System.out.println("Bank details updated for user " + userId + " from IP: " + ip + " at " + Instant.now());

        user = userRepository.save(user);
        ProfileCompleteDto dto = convertToProfileDto(user);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Bank details updated successfully. Re-verification may be required.",
                "data", dto
        ));
    }

    // PUT /api/profile/{userId}/nominee - Update nominee details
    @PutMapping("/{userId}/nominee")
    public ResponseEntity<?> updateNomineeDetails(
            @PathVariable Long userId,
            @Valid @RequestBody NomineeUpdateDto updateDto,
            HttpServletRequest request) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        KycDetails kycDetails = (KycDetails) getField(user, "kycDetails");
        
        if (kycDetails == null) {
            kycDetails = new KycDetails();
        }

        if (updateDto.getNomineeName() != null) {
            setField(kycDetails, "nomineeName", updateDto.getNomineeName());
        }
        if (updateDto.getNomineeRelation() != null) {
            setField(kycDetails, "nomineeRelation", updateDto.getNomineeRelation());
        }
        if (updateDto.getNomineeDob() != null) {
            setField(kycDetails, "nomineeDob", updateDto.getNomineeDob());
        }

        setField(user, "kycDetails", kycDetails);
        
        // Log update
        String ip = getClientIp(request);
        System.out.println("Nominee details updated for user " + userId + " from IP: " + ip + " at " + Instant.now());

        user = userRepository.save(user);
        ProfileCompleteDto dto = convertToProfileDto(user);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Nominee details updated successfully",
                "data", dto
        ));
    }

    // PUT /api/profile/{userId}/password - Change password
    @PutMapping("/{userId}/password")
    public ResponseEntity<?> changePassword(
            @PathVariable Long userId,
            @Valid @RequestBody PasswordChangeDto passwordDto,
            HttpServletRequest request) {
        
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "User not found"));
        }

        User user = userOpt.get();
        String currentPasswordHash = (String) getField(user, "passwordHash");
        
        // Verify current password
        if (!passwordEncoder.matches(passwordDto.getCurrentPassword(), currentPasswordHash)) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Current password is incorrect"));
        }

        // Validate new password matches confirm password
        if (!passwordDto.getNewPassword().equals(passwordDto.getConfirmPassword())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "New password and confirm password do not match"));
        }

        // Update password
        String newPasswordHash = passwordEncoder.encode(passwordDto.getNewPassword());
        setField(user, "passwordHash", newPasswordHash);
        
        // Log update
        String ip = getClientIp(request);
        System.out.println("Password changed for user " + userId + " from IP: " + ip + " at " + Instant.now());

        user = userRepository.save(user);
        
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password changed successfully"
        ));
    }

    // Helper method to convert User to ProfileCompleteDto
    private ProfileCompleteDto convertToProfileDto(User user) {
        ProfileCompleteDto dto = new ProfileCompleteDto();
        
        // Personal Details
        Object id = getField(user, "id");
        if (id != null) dto.setId((Long) id);
        
        Object fullName = getField(user, "fullName");
        if (fullName != null) dto.setFullName(fullName.toString());
        
        Object email = getField(user, "email");
        if (email != null) dto.setEmail(email.toString());
        
        Object mobileNumber = getField(user, "mobileNumber");
        if (mobileNumber != null) dto.setMobileNumber(mobileNumber.toString());
        
        Object gender = getField(user, "gender");
        if (gender != null) dto.setGender(gender.toString());
        
        Object dob = getField(user, "dob");
        if (dob != null) dto.setDob(dob.toString());
        
        Object address = getField(user, "address");
        if (address != null) dto.setAddress(address.toString());
        
        Object city = getField(user, "city");
        if (city != null) dto.setCity(city.toString());
        
        Object state = getField(user, "state");
        if (state != null) dto.setState(state.toString());
        
        Object pincode = getField(user, "pincode");
        if (pincode != null) dto.setPincode(pincode.toString());
        
        Object isForSelf = getField(user, "isForSelf");
        if (isForSelf != null) dto.setForSelf((Boolean) isForSelf);
        
        Object relativeFullName = getField(user, "relativeFullName");
        if (relativeFullName != null) dto.setRelativeFullName(relativeFullName.toString());
        
        Object relativeRelation = getField(user, "relativeRelation");
        if (relativeRelation != null) dto.setRelativeRelation(relativeRelation.toString());
        
        Object createdAt = getField(user, "createdAt");
        if (createdAt != null) dto.setCreatedAt((Instant) createdAt);
        
        // KYC Details
        KycDetails kycDetails = (KycDetails) getField(user, "kycDetails");
        if (kycDetails != null) {
            Object panNumber = getField(kycDetails, "panNumber");
            if (panNumber != null) dto.setPanNumber(maskSensitiveData(panNumber.toString()));
            
            Object aadhaarNumber = getField(kycDetails, "aadhaarNumber");
            if (aadhaarNumber != null) dto.setAadhaarNumber(maskSensitiveData(aadhaarNumber.toString()));
            
            Object occupation = getField(kycDetails, "occupation");
            if (occupation != null) dto.setOccupation(occupation.toString());
            
            Object employerName = getField(kycDetails, "employerName");
            if (employerName != null) dto.setEmployerName(employerName.toString());
            
            Object annualIncomeRange = getField(kycDetails, "annualIncomeRange");
            if (annualIncomeRange != null) dto.setAnnualIncomeRange(annualIncomeRange.toString());
            
            Object riskTolerance = getField(kycDetails, "riskTolerance");
            if (riskTolerance != null) dto.setRiskTolerance(riskTolerance.toString());
            
            Object verified = getField(kycDetails, "verified");
            if (verified != null) dto.setKycVerified((Boolean) verified);
            
            Object verifiedAt = getField(kycDetails, "verifiedAt");
            if (verifiedAt != null) dto.setKycVerifiedAt((LocalDateTime) verifiedAt);
            
            Object nomineeName = getField(kycDetails, "nomineeName");
            if (nomineeName != null) dto.setNomineeName(nomineeName.toString());
            
            Object nomineeRelation = getField(kycDetails, "nomineeRelation");
            if (nomineeRelation != null) dto.setNomineeRelation(nomineeRelation.toString());
            
            Object nomineeDob = getField(kycDetails, "nomineeDob");
            if (nomineeDob != null) dto.setNomineeDob((LocalDate) nomineeDob);
        }
        
        // Bank Details
        BankDetails bankDetails = (BankDetails) getField(user, "bankDetails");
        if (bankDetails != null) {
            Object bankName = getField(bankDetails, "bankName");
            if (bankName != null) dto.setBankName(bankName.toString());
            
            Object accountNumber = getField(bankDetails, "accountNumberEncrypted");
            if (accountNumber != null) dto.setAccountNumber(maskSensitiveData(accountNumber.toString()));
            
            Object ifsc = getField(bankDetails, "ifsc");
            if (ifsc != null) dto.setIfsc(ifsc.toString());
            
            Object accountHolderName = getField(bankDetails, "accountHolderName");
            if (accountHolderName != null) dto.setAccountHolderName(accountHolderName.toString());
            
            Object nameMatchesPan = getField(bankDetails, "nameMatchesPan");
            if (nameMatchesPan != null) dto.setNameMatchesPan((Boolean) nameMatchesPan);
        }
        
        // Risk Profile
        RiskProfile riskProfile = (RiskProfile) getField(user, "riskProfile");
        if (riskProfile != null) {
            Object category = getField(riskProfile, "category");
            if (category != null) dto.setRiskCategory(category.toString());
            
            Object score = getField(riskProfile, "score");
            if (score != null) dto.setRiskScore((Integer) score);
        }
        
        // Consents
        Object termsAccepted = getField(user, "termsAccepted");
        if (termsAccepted != null) dto.setTermsAccepted((Boolean) termsAccepted);
        
        Object declarationAccepted = getField(user, "declarationAccepted");
        if (declarationAccepted != null) dto.setDeclarationAccepted((Boolean) declarationAccepted);
        
        Object consentComm = getField(user, "consentComm");
        if (consentComm != null) dto.setConsentComm((Boolean) consentComm);
        
        Object consentShareDocs = getField(user, "consentShareDocs");
        if (consentShareDocs != null) dto.setConsentShareDocs((Boolean) consentShareDocs);
        
        Object consentShareWithProviders = getField(user, "consentShareWithProviders");
        if (consentShareWithProviders != null) dto.setConsentShareWithProviders((Boolean) consentShareWithProviders);
        
        Object consentShareWithAmc = getField(user, "consentShareWithAmc");
        if (consentShareWithAmc != null) dto.setConsentShareWithAmc((Boolean) consentShareWithAmc);
        
        Object understoodMarketRisk = getField(user, "understoodMarketRisk");
        if (understoodMarketRisk != null) dto.setUnderstoodMarketRisk((Boolean) understoodMarketRisk);
        
        return dto;
    }
}

