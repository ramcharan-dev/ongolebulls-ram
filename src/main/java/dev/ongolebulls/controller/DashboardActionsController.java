package dev.ongolebulls.controller;


import dev.ongolebulls.model.InvestmentRequest;
import dev.ongolebulls.model.Nominee;
import dev.ongolebulls.model.RedemptionRequest;
import dev.ongolebulls.model.SIPRequest;
import dev.ongolebulls.repository.InvestmentRequestRepo;
import dev.ongolebulls.repository.NomineeRepo;
import dev.ongolebulls.repository.RedemptionRequestRepo;
import dev.ongolebulls.repository.SIPRequestRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;



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
}


