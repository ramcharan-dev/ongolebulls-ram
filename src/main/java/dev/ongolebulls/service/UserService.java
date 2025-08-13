package dev.ongolebulls.service;

import dev.ongolebulls.dto.RegisterRequest;
import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.UserRepository;
import dev.ongolebulls.util.PanValidator;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.Instant;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public UserService(UserRepository userRepository, FileStorageService fileStorageService) {
        this.userRepository = userRepository;
        this.fileStorageService = fileStorageService;
    }

    public User register(RegisterRequest req, MultipartFile addressProof, MultipartFile chequeProof) {
        // basic duplicates
        if (userRepository.existsByEmail(req.getBasic().getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        if (userRepository.existsByMobile(req.getBasic().getMobile())) {
            throw new IllegalArgumentException("Mobile already registered");
        }


        // PAN validation
        if (!PanValidator.isValidPan(req.getKyc().getPan())) {
            throw new IllegalArgumentException("Invalid PAN format");
        }

        User u = new User();
        u.setFullName(req.getBasic().getFullName());
        u.setEmail(req.getBasic().getEmail());
        u.setMobile(req.getBasic().getMobile()); // ✅ matches new field
        u.setPasswordHash(passwordEncoder.encode(req.getBasic().getPassword()));

        // KYC
        KycDetails k = new KycDetails();
        k.setPan(req.getKyc().getPan());
        k.setDob(req.getKyc().getDob()); // ✅ type must match KycDetails
        k.setGender(req.getKyc().getGender());
        k.setAddress(req.getKyc().getAddress());
        k.setPincode(req.getKyc().getPincode());
        k.setCity(req.getKyc().getCity());
        k.setState(req.getKyc().getState());
        if (addressProof != null) {
            String p = fileStorageService.storeFile(addressProof, "addressProof");
            k.setAddressProofPath(p);
        }
        u.setKycDetails(k);

        // Bank
        BankDetails b = new BankDetails();
        b.setAccountHolder(req.getBank().getAccountHolder()); // ✅ match BankDetails field name
        b.setBankName(req.getBank().getBankName());
        b.setAccountNumber(req.getBank().getAccountNumber());
        b.setIfsc(req.getBank().getIfsc());
        if (chequeProof != null) {
            String p = fileStorageService.storeFile(chequeProof, "chequeProof");
            b.setChequeProofPath(p);
        }
        u.setBankDetails(b);

        // Risk
        RiskProfile r = new RiskProfile();
        r.setScore(req.getRiskProfile().getScore());
        r.setCategory(req.getRiskProfile().getCategory());
        u.setRiskProfile(r);

        // Consent
        Consent c = new Consent();
        c.setC1(req.getConsents().isC1());
        c.setC2(req.getConsents().isC2());
        c.setC3(req.getConsents().isC3());
        c.setC4(req.getConsents().isC4());
        c.setC5(req.getConsents().isC5());
        c.setConsentTimestamp(Instant.parse(req.getConsents().getConsentTimestamp()));
        c.setUserAgent(req.getConsents().getUserAgent());
        u.setConsent(c);

        // persist
        return userRepository.save(u);
    }
}
