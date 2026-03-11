package dev.ongolebulls.controller;

import dev.ongolebulls.model.AMC;
import dev.ongolebulls.model.Scheme;
import dev.ongolebulls.repository.AMCRepository;
import dev.ongolebulls.repository.SchemeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calculator")
public class CalculatorController {

    @Autowired
    private AMCRepository amcRepo;

    @Autowired
    private SchemeRepository schemeRepo;

    @GetMapping("/amcs")
    public List<AMC> getAllAMCs() {
        return amcRepo.findAll();
    }

    @GetMapping("/schemes/{amcId}")
    public List<Scheme> getSchemesByAmc(@PathVariable Long amcId) {
        return schemeRepo.findByAmcId(amcId);
    }

    @GetMapping("/sip")
    public Map<String, Object> calculateSIP(
            @RequestParam double monthlyInvestment,
            @RequestParam double annualReturn,
            @RequestParam int years) {

        double r = annualReturn / 12.0 / 100.0;
        int n = years * 12;
        double maturityValue = monthlyInvestment * ((Math.pow(1 + r, n) - 1) * (1 + r) / r);
        double investedAmount = monthlyInvestment * n;
        double estimatedReturns = maturityValue - investedAmount;

        Map<String, Object> response = new HashMap<>();
        response.put("maturityValue", maturityValue);
        response.put("investedAmount", investedAmount);
        response.put("estimatedReturns", estimatedReturns);
        return response;
    }

    @GetMapping("/lumpsum")
    public Map<String, Object> calculateLumpsum(
            @RequestParam double amount,
            @RequestParam double annualReturn,
            @RequestParam double years) {

        double r = annualReturn / 100.0;          // annual rate in decimal
        double t = years;                          // years (can be fractional)
        double maturityValue = amount * Math.pow(1 + r, t);
        double investedAmount = amount;
        double estimatedReturns = maturityValue - investedAmount;

        Map<String, Object> response = new HashMap<>();
        response.put("maturityValue", maturityValue);
        response.put("investedAmount", investedAmount);
        response.put("estimatedReturns", estimatedReturns);
        return response;
    }

}
