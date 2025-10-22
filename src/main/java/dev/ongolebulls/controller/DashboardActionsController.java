package dev.ongolebulls.controller;


import dev.ongolebulls.model.*;
import dev.ongolebulls.repository.*;
import dev.ongolebulls.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DashboardActionsController {

        private final InvestmentRequestRepo investRepo;
        private final RedemptionRequestRepo redeemRepo;
        private final SIPRequestRepo sipRepo;
        private final NomineeRepo nomineeRepo;
        private final DashboardService dashboardService;
        private final UserRepository userRepository;
        private Long userId; // <-- important, must match exactly


    // ---- INVEST MORE ----
        @PostMapping("/investments/request")
        public InvestmentRequest invest(@RequestBody InvestmentRequest req){
            return investRepo.save(req);
        }

        // ---- REDEEM ----
        @PostMapping("/redeem/request")
        public RedemptionRequest redeem(@RequestBody RedemptionRequest req){
            return redeemRepo.save(req);
        }

        // ---- START SIP ----
        @PostMapping("/sip/request")
        public SIPRequest startSIP(@RequestBody SIPRequest req){
            req.setNextSIPDate(req.getStartDate());
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
        @GetMapping("/user/{userId}")
        @ResponseBody
        public User getUser(@PathVariable Long userId) {
            return userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));
        }




}


