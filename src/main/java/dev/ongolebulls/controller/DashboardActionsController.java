package dev.ongolebulls.controller;


import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.*;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import java.lang.reflect.Field;

@RestController
@RequestMapping("/api")
public class DashboardActionsController {

        private final InvestmentRequestRepo investRepo;
        private final RedemptionRequestRepo redeemRepo;
        private final SIPRequestRepo sipRepo;
        private final NomineeRepo nomineeRepo;
        private final UserRepository userRepository;

    // Explicit constructor for dependency injection
    public DashboardActionsController(
            InvestmentRequestRepo investRepo,
            RedemptionRequestRepo redeemRepo,
            SIPRequestRepo sipRepo,
            NomineeRepo nomineeRepo,
            UserRepository userRepository) {
        this.investRepo = investRepo;
        this.redeemRepo = redeemRepo;
        this.sipRepo = sipRepo;
        this.nomineeRepo = nomineeRepo;
        this.userRepository = userRepository;
    }



    // Helper method to set field using reflection
    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore if field doesn't exist or can't be set
        }
    }

    // ---- INVEST MORE ----
        @PostMapping("/investments/request")
        public InvestmentRequest invest(@RequestBody Map<String, Object> requestMap){
            InvestmentRequest req = new InvestmentRequest();
            setField(req, "userId", Long.valueOf(requestMap.get("userId").toString()));
            // Handle both fundName and schemeName for backward compatibility
            String fundName = null;
            if (requestMap.containsKey("fundName")) {
                fundName = requestMap.get("fundName").toString();
            } else if (requestMap.containsKey("schemeName")) {
                fundName = requestMap.get("schemeName").toString();
            }
            if (fundName != null) {
                setField(req, "fundName", fundName);
            }
            if (requestMap.containsKey("amount")) {
                setField(req, "amount", Double.valueOf(requestMap.get("amount").toString()));
            }
            return investRepo.save(req);
        }

        // ---- REDEEM ----
        @PostMapping("/redeem/request")
        public RedemptionRequest redeem(@RequestBody Map<String, Object> requestMap){
            RedemptionRequest req = new RedemptionRequest();
            setField(req, "userId", Long.valueOf(requestMap.get("userId").toString()));
            // Handle both fundName and schemeName for backward compatibility
            String fundName = null;
            if (requestMap.containsKey("fundName")) {
                fundName = requestMap.get("fundName").toString();
            } else if (requestMap.containsKey("schemeName")) {
                fundName = requestMap.get("schemeName").toString();
            }
            if (fundName != null) {
                setField(req, "fundName", fundName);
            }
            if (requestMap.containsKey("amount")) {
                setField(req, "amount", Double.valueOf(requestMap.get("amount").toString()));
            }
            return redeemRepo.save(req);
        }

        // ---- START SIP ----
        @PostMapping("/sip/request")
        public SIPRequest startSIP(@RequestBody Map<String, Object> requestMap){
            SIPRequest req = new SIPRequest();
            setField(req, "userId", Long.valueOf(requestMap.get("userId").toString()));
            // Handle both fundName and schemeName for backward compatibility
            String fundName = null;
            if (requestMap.containsKey("fundName")) {
                fundName = requestMap.get("fundName").toString();
            } else if (requestMap.containsKey("schemeName")) {
                fundName = requestMap.get("schemeName").toString();
            }
            if (fundName != null) {
                setField(req, "fundName", fundName);
            }
            if (requestMap.containsKey("amount")) {
                setField(req, "amount", Double.valueOf(requestMap.get("amount").toString()));
            }
            String frequency = requestMap.containsKey("frequency") 
                ? requestMap.get("frequency").toString() 
                : "MONTHLY";
            setField(req, "frequency", frequency);
            if (requestMap.containsKey("startDate")) {
                java.time.LocalDate startDate = java.time.LocalDate.parse(requestMap.get("startDate").toString());
                setField(req, "startDate", startDate);
                setField(req, "nextSIPDate", startDate);
            }
            return sipRepo.save(req);
        }

        // ---- NOMINEE ----
        @PostMapping("/nominee")
        public Nominee saveNominee(@RequestBody Nominee n){
            return nomineeRepo.save(n);
        }

        // ---- OPTIONAL: GET USER DATA ----
        @GetMapping("/dashboard/requests/{userId}")
        public Map<String,Object> getRequests(@PathVariable Long userId){
            Map<String,Object> map = new HashMap<>();
            map.put("investments", investRepo.findByUserId(userId));
            map.put("redemptions", redeemRepo.findByUserId(userId));
            map.put("sips", sipRepo.findByUserId(userId));
            map.put("nominees", nomineeRepo.findByUserId(userId));
            return map;
        }
    // Helper method to get field using reflection
    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }
    
        @GetMapping("/user/{userId}")
        @ResponseBody
        public ResponseEntity<?> getUser(@PathVariable Long userId) {
            try {
            return userRepository.findById(userId)
                        .map(user -> {
                            // Create a safe response object using reflection
                            Map<String, Object> response = new HashMap<>();
                            Object id = getField(user, "id");
                            Object fullName = getField(user, "fullName");
                            Object email = getField(user, "email");
                            Object mobileNumber = getField(user, "mobileNumber");
                            
                            response.put("id", id != null ? id : userId);
                            response.put("fullName", fullName != null ? fullName.toString() : "Demo User");
                            response.put("username", email != null ? email.toString() : "user" + userId);
                            response.put("email", email != null ? email.toString() : "demo" + userId + "@ongolebulls.com");
                            response.put("mobileNumber", mobileNumber != null ? mobileNumber.toString() : "9876543210");
                            
                            return ResponseEntity.ok(response);
                        })
                        .orElse(ResponseEntity.ok(createDefaultUserResponse(userId)));
            } catch (Exception e) {
                return ResponseEntity.ok(createDefaultUserResponse(userId));
            }
        }
        
        private Map<String, Object> createDefaultUserResponse(Long userId) {
            Map<String, Object> response = new HashMap<>();
            response.put("id", userId);
            response.put("fullName", "Demo User");
            response.put("username", "user" + userId);
            response.put("email", "demo" + userId + "@ongolebulls.com");
            response.put("mobileNumber", "9876543210");
            return response;
        }




}


