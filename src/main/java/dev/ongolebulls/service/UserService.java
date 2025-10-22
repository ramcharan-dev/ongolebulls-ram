package dev.ongolebulls.service;

import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.InvestorAccountRepo;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.*;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

        private final UserRepository userRepo;
        private final EncryptionService encService;
        private final InvestorAccountRepo investorAccountRepo;

        private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        private final Path uploadRoot = Paths.get("uploads");

    public User register(Map<String, Object> dto,
                         MultipartFile kycFile,
                         MultipartFile chequeFile,
                         String ip,
                         String deviceId) throws Exception {

        User user = new User();

        user.setFullName((String) dto.get("fullName"));
        user.setEmail((String) dto.get("email"));
        user.setMobileNumber((String) dto.get("mobileNumber"));
        user.setPasswordHash(passwordEncoder.encode((String) dto.get("password")));

        user.setIsForSelf(Boolean.parseBoolean("" + dto.getOrDefault("isForSelf", "true")));
        user.setRelativeRelation((String) dto.get("relativeRelation"));
        user.setRelativeFullName((String) dto.get("relativeFullName"));

        // --- KYC ---
        KycDetails kyc = KycDetails.builder()
                .panNumber(encService.encrypt((String) dto.get("panNumber")))
                .aadhaarNumber((String) dto.get("aadhaarNumber"))
                .occupation((String) dto.get("occupation"))
                .annualIncomeRange((String) dto.get("annualIncomeRange"))
                .riskTolerance((String) dto.get("riskTolerance"))
                .nomineeName((String) dto.get("nomineeName"))
                .nomineeRelation((String) dto.get("nomineeRelation"))
                .nomineeDob(null)
                .verified(false)
                .build();
        user.setKycDetails(kyc);

        user.setDob((String) dto.get("dob"));
        user.setGender((String) dto.get("gender"));
        user.setAddress((String) dto.get("address"));
        user.setPincode((String) dto.get("pincode"));
        user.setCity((String) dto.get("city"));
        user.setState((String) dto.get("state"));

        // --- Bank ---
        String accountHolderName = (String) dto.get("accountHolderName");
        if (accountHolderName == null || accountHolderName.isBlank()) {
            throw new IllegalArgumentException("Account holder name is required");
        }

        BankDetails bank = BankDetails.builder()
                .accountHolderName(accountHolderName)
                .bankName((String) dto.get("bankName"))
                .accountNumberEncrypted(encService.encrypt((String) dto.get("accountNumber")))
                .ifsc((String) dto.get("ifsc"))
                .nameMatchesPan(Boolean.parseBoolean("" + dto.getOrDefault("nameMatchesPan", "false")))
                .build();
        user.setBankDetails(bank);

        // --- RiskProfile ---
        if (dto.get("riskProfileObj") instanceof RiskProfile riskProfile) {
            user.setRiskProfile(riskProfile);
        } else {
            String riskCatStr = ((String) dto.getOrDefault("riskCategory", "CONSERVATIVE")).toUpperCase();
            RiskProfile.RiskCategory category;
            try {
                category = RiskProfile.RiskCategory.valueOf(riskCatStr);
            } catch (IllegalArgumentException e) {
                category = RiskProfile.RiskCategory.CONSERVATIVE;
            }

            RiskProfile r = RiskProfile.builder()
                    .score(Integer.parseInt("" + dto.getOrDefault("riskScore", "0")))
                    .category(category)
                    .answersJson((String) dto.getOrDefault("riskAnswersJson", ""))
                    .build();
            user.setRiskProfile(r);
        }

        // --- Consent & Metadata ---
        user.setConsentDeclared(Boolean.parseBoolean("" + dto.getOrDefault("consentDeclared", "false")));
        user.setConsentShareWithProviders(Boolean.parseBoolean("" + dto.getOrDefault("consentShareWithProviders", "false")));
        user.setConsentShareDocs(Boolean.parseBoolean("" + dto.getOrDefault("consentShareDocs", "false")));
        user.setConsentComm(Boolean.parseBoolean("" + dto.getOrDefault("consentComm", "false")));
        user.setUnderstoodMarketRisk(Boolean.parseBoolean("" + dto.getOrDefault("understoodMarketRisk", "false")));
        user.setConsentShareWithAmc(Boolean.parseBoolean("" + dto.getOrDefault("consentShareWithAmc", "false")));


        user.setConsentTimestamp(Instant.now());
        user.setConsentIp(ip);
        user.setConsentDeviceId(deviceId);

        // --- File uploads ---
        Files.createDirectories(uploadRoot);
        if (kycFile != null && !kycFile.isEmpty()) {
            Path p = uploadRoot.resolve("kyc_" + System.currentTimeMillis() + "_" + kycFile.getOriginalFilename());
            Files.copy(kycFile.getInputStream(), p, StandardCopyOption.REPLACE_EXISTING);
            user.setKycProofPath(p.toString());
        }
        if (chequeFile != null && !chequeFile.isEmpty()) {
            Path p = uploadRoot.resolve("cheque_" + System.currentTimeMillis() + "_" + chequeFile.getOriginalFilename());
            Files.copy(chequeFile.getInputStream(), p, StandardCopyOption.REPLACE_EXISTING);
            user.setChequePath(p.toString());
        }

        user.setCreatedAt(Instant.now());

        // --- NEW: Create and link InvestorAccount ---
        InvestorAccount investorAccount = new InvestorAccount();
        investorAccount.setFullName(user.getFullName());
        investorAccount.setEmail(user.getEmail());
        if (user.getRiskProfile() != null) {
            investorAccount.setRiskCategory(user.getRiskProfile().getCategory());
        }
        investorAccount = investorAccountRepo.save(investorAccount);

        // Link the investorAccount to the user (make sure this field or relation exists in User entity)
        user.setInvestorAccount(investorAccount);

        return userRepo.save(user);
    }

    public Optional<User> login(String email, String rawPassword) {
        return userRepo.findByEmail(email)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
    }


}

