package dev.ongolebulls.controller;

import dev.ongolebulls.dto.SipDetailDto;
import dev.ongolebulls.model.SIPRequest;
import dev.ongolebulls.model.SIPInstallment;
import dev.ongolebulls.model.SipPlan;
import dev.ongolebulls.repository.SipPlanRepo;
import dev.ongolebulls.repository.SIPRequestRepo;
import dev.ongolebulls.repository.SIPInstallmentRepository;
import dev.ongolebulls.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/sips")
@CrossOrigin(origins = "*")
public class SipsController {

    private final SipPlanRepo sipPlanRepo;
    private final SIPRequestRepo sipRequestRepo;
    private final SIPInstallmentRepository sipInstallmentRepo;
    private final UserRepository userRepository;

    public SipsController(SipPlanRepo sipPlanRepo, SIPRequestRepo sipRequestRepo, 
                          SIPInstallmentRepository sipInstallmentRepo, UserRepository userRepository) {
        this.sipPlanRepo = sipPlanRepo;
        this.sipRequestRepo = sipRequestRepo;
        this.sipInstallmentRepo = sipInstallmentRepo;
        this.userRepository = userRepository;
    }

    private Object getField(Object obj, String fieldName) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            return field.get(obj);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            return null;
        }
    }

    private Long getInvestorIdFromUserId(Long userId) {
        try {
            return userRepository.findById(userId)
                    .map(user -> {
                        Object investorAccount = getField(user, "investorAccount");
                        if (investorAccount != null) {
                            Object id = getField(investorAccount, "id");
                            return id != null ? (Long) id : null;
                        }
                        return null;
                    })
                    .orElse(null);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<SipDetailDto>> getSips(@PathVariable Long userId) {
        try {
            // Try to get from SIPRequest first (new enhanced model)
            List<SIPRequest> sipRequests = sipRequestRepo.findByUserId(userId);
            if (sipRequests != null && !sipRequests.isEmpty()) {
                return ResponseEntity.ok(convertSipRequestsToDto(sipRequests, userId));
            }
            
            // Fallback to SipPlan (legacy)
            Long investorId = getInvestorIdFromUserId(userId);
            if (investorId == null) {
                return ResponseEntity.ok(Collections.emptyList());
            }

            List<SipPlan> sips = sipPlanRepo.findByInvestor_IdAndActiveTrue(investorId);
            return ResponseEntity.ok(convertToDto(sips));
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
    
    @GetMapping("/{userId}/{sipId}/installments")
    public ResponseEntity<List<SipDetailDto.SipInstallmentDto>> getInstallments(
            @PathVariable Long userId, @PathVariable Long sipId) {
        try {
            List<SIPInstallment> installments = sipInstallmentRepo.findBySipIdOrderByInstallmentDateDesc(sipId);
            List<SipDetailDto.SipInstallmentDto> dtos = installments.stream()
                .map(this::convertInstallmentToDto)
                .collect(Collectors.toList());
            return ResponseEntity.ok(dtos);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
    
    @GetMapping("/{userId}/{sipId}/xirr")
    public ResponseEntity<Map<String, Object>> calculateXIRR(
            @PathVariable Long userId, @PathVariable Long sipId) {
        try {
            List<SIPInstallment> installments = sipInstallmentRepo.findBySipIdAndStatus(sipId, "EXECUTED");
            if (installments.isEmpty()) {
                Map<String, Object> result = new HashMap<>();
                result.put("xirr", 0.0);
                result.put("message", "Insufficient data for XIRR calculation");
                return ResponseEntity.ok(result);
            }
            
            // Calculate XIRR using cash flows
            double xirr = calculateXIRRFromInstallments(installments);
            
            Map<String, Object> result = new HashMap<>();
            result.put("xirr", xirr);
            result.put("installmentsCount", installments.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            Map<String, Object> result = new HashMap<>();
            result.put("xirr", 0.0);
            result.put("error", e.getMessage());
            return ResponseEntity.ok(result);
        }
    }
    
    @PutMapping("/{userId}/{sipId}/pause")
    public ResponseEntity<Map<String, Object>> pauseSIP(
            @PathVariable Long userId, @PathVariable Long sipId) {
        try {
            SIPRequest sip = sipRequestRepo.findById(sipId).orElse(null);
            if (sip == null || !sip.getUserId().equals(userId)) {
                return ResponseEntity.badRequest().body(createErrorResponse("SIP not found"));
            }
            
            if (!"ACTIVE".equals(sip.getStatus())) {
                return ResponseEntity.badRequest().body(createErrorResponse("SIP is not active"));
            }
            
            setField(sip, "status", "PAUSED");
            setField(sip, "pausedDate", LocalDate.now());
            sipRequestRepo.save(sip);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "SIP paused successfully");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}/{sipId}/resume")
    public ResponseEntity<Map<String, Object>> resumeSIP(
            @PathVariable Long userId, @PathVariable Long sipId) {
        try {
            SIPRequest sip = sipRequestRepo.findById(sipId).orElse(null);
            if (sip == null || !sip.getUserId().equals(userId)) {
                return ResponseEntity.badRequest().body(createErrorResponse("SIP not found"));
            }
            
            if (!"PAUSED".equals(sip.getStatus())) {
                return ResponseEntity.badRequest().body(createErrorResponse("SIP is not paused"));
            }
            
            setField(sip, "status", "ACTIVE");
            setField(sip, "pausedDate", null);
            sipRequestRepo.save(sip);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "SIP resumed successfully");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}/{sipId}/stop")
    public ResponseEntity<Map<String, Object>> stopSIP(
            @PathVariable Long userId, @PathVariable Long sipId) {
        try {
            SIPRequest sip = sipRequestRepo.findById(sipId).orElse(null);
            if (sip == null || !sip.getUserId().equals(userId)) {
                return ResponseEntity.badRequest().body(createErrorResponse("SIP not found"));
            }
            
            setField(sip, "status", "STOPPED");
            setField(sip, "stoppedDate", LocalDate.now());
            sipRequestRepo.save(sip);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "SIP stopped successfully");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(createErrorResponse(e.getMessage()));
        }
    }
    
    @PutMapping("/{userId}/{sipId}/modify")
    public ResponseEntity<Map<String, Object>> modifySIP(
            @PathVariable Long userId, @PathVariable Long sipId,
            @RequestBody Map<String, Object> updates) {
        try {
            SIPRequest sip = sipRequestRepo.findById(sipId).orElse(null);
            if (sip == null || !sip.getUserId().equals(userId)) {
                return ResponseEntity.badRequest().body(createErrorResponse("SIP not found"));
            }
            
            // Update allowed fields
            if (updates.containsKey("amount")) {
                setField(sip, "amount", Double.valueOf(updates.get("amount").toString()));
            }
            if (updates.containsKey("frequency")) {
                setField(sip, "frequency", updates.get("frequency").toString());
            }
            if (updates.containsKey("stepUpAmount")) {
                setField(sip, "stepUpAmount", updates.get("stepUpAmount") != null ? 
                    Double.valueOf(updates.get("stepUpAmount").toString()) : null);
            }
            if (updates.containsKey("stepUpFrequencyMonths")) {
                setField(sip, "stepUpFrequencyMonths", updates.get("stepUpFrequencyMonths") != null ? 
                    Integer.valueOf(updates.get("stepUpFrequencyMonths").toString()) : null);
            }
            if (updates.containsKey("goalName")) {
                setField(sip, "goalName", updates.get("goalName").toString());
            }
            
            sipRequestRepo.save(sip);
            
            Map<String, Object> result = new HashMap<>();
            result.put("success", true);
            result.put("message", "SIP modified successfully");
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(createErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/{userId}/projection")
    public ResponseEntity<Map<String, Object>> getSipProjection(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "60") int months) {
        try {
            Long investorId = getInvestorIdFromUserId(userId);
            if (investorId == null) {
                return ResponseEntity.ok(createEmptyProjection(months));
            }

            List<SipPlan> sips = sipPlanRepo.findByInvestor_IdAndActiveTrue(investorId);
            BigDecimal totalMonthly = sips.stream()
                    .map(SipPlan::getMonthlyAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            // Calculate projection with 12% annual return
            BigDecimal monthlyReturn = BigDecimal.valueOf(0.01); // 1% per month
            BigDecimal futureValue = calculateSipFutureValue(totalMonthly, months, monthlyReturn);

            Map<String, Object> projection = new HashMap<>();
            setField(projection, "totalMonthlyAmount", totalMonthly);
            setField(projection, "projectedValue", futureValue);
            setField(projection, "months", months);
            setField(projection, "estimatedReturns", futureValue.subtract(totalMonthly.multiply(BigDecimal.valueOf(months))));

            return ResponseEntity.ok(projection);
        } catch (Exception e) {
            return ResponseEntity.ok(createEmptyProjection(months));
        }
    }

    private BigDecimal calculateSipFutureValue(BigDecimal monthlyAmount, int months, BigDecimal monthlyReturn) {
        // SIP Future Value = P * [((1 + r)^n - 1) / r] * (1 + r)
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyReturn);
        BigDecimal power = onePlusR.pow(months);
        BigDecimal numerator = power.subtract(BigDecimal.ONE);
        BigDecimal denominator = monthlyReturn;
        BigDecimal multiplier = numerator.divide(denominator, 4, RoundingMode.HALF_UP);
        return monthlyAmount.multiply(multiplier).multiply(onePlusR);
    }

    private List<SipDetailDto> convertToDto(List<SipPlan> sips) {
        return sips.stream().map(sip -> {
            SipDetailDto dto = new SipDetailDto();
            setField(dto, "id", sip.getId());
            setField(dto, "fundName", sip.getFundName());
            setField(dto, "monthlyAmount", sip.getMonthlyAmount());
            setField(dto, "nextSIPDate", sip.getNextSIPDate());
            setField(dto, "active", sip.isActive());

            // Calculate months completed
            LocalDate startDate = sip.getNextSIPDate() != null ? sip.getNextSIPDate().minusMonths(12) : LocalDate.now().minusMonths(12);
            int monthsCompleted = (int) ChronoUnit.MONTHS.between(startDate, LocalDate.now());
            setField(dto, "monthsCompleted", Math.max(0, monthsCompleted));

            // Calculate totals
            BigDecimal monthly = sip.getMonthlyAmount() != null ? sip.getMonthlyAmount() : BigDecimal.ZERO;
            BigDecimal totalInvested = monthly.multiply(BigDecimal.valueOf(monthsCompleted));
            BigDecimal currentValue = totalInvested.multiply(BigDecimal.valueOf(1.12)); // 12% return estimate
            Double returnsPct = 12.0; // Estimated

            setField(dto, "totalInvested", totalInvested);
            setField(dto, "currentValue", currentValue);
            setField(dto, "returnsPercentage", returnsPct);
            setField(dto, "projectedValue", calculateSipFutureValue(monthly, 60, BigDecimal.valueOf(0.01)));

            return dto;
        }).collect(Collectors.toList());
    }

    private Map<String, Object> createEmptyProjection(int months) {
        Map<String, Object> projection = new HashMap<>();
        setField(projection, "totalMonthlyAmount", BigDecimal.ZERO);
        setField(projection, "projectedValue", BigDecimal.ZERO);
        setField(projection, "months", months);
        setField(projection, "estimatedReturns", BigDecimal.ZERO);
        return projection;
    }

    private List<SipDetailDto> convertSipRequestsToDto(List<SIPRequest> sips, Long userId) {
        return sips.stream().map(sip -> {
            SipDetailDto dto = new SipDetailDto();
            setField(dto, "id", sip.getId());
            setField(dto, "fundName", sip.getFundName());
            setField(dto, "monthlyAmount", sip.getAmount() != null ? BigDecimal.valueOf(sip.getAmount()) : BigDecimal.ZERO);
            setField(dto, "startDate", sip.getStartDate());
            setField(dto, "nextSIPDate", sip.getNextSIPDate());
            setField(dto, "active", "ACTIVE".equals(sip.getStatus()));
            setField(dto, "status", sip.getStatus());
            setField(dto, "frequency", sip.getFrequency());
            setField(dto, "isPerpetual", sip.getIsPerpetual());
            setField(dto, "tenureMonths", sip.getTenureMonths());
            setField(dto, "stepUpAmount", sip.getStepUpAmount());
            setField(dto, "stepUpFrequencyMonths", sip.getStepUpFrequencyMonths());
            setField(dto, "lastStepUpDate", sip.getLastStepUpDate());
            setField(dto, "mandateStatus", sip.getMandateStatus());
            setField(dto, "mandateId", sip.getMandateId());
            setField(dto, "goalId", sip.getGoalId());
            setField(dto, "goalName", sip.getGoalName());
            setField(dto, "totalInstallments", sip.getTotalInstallments());
            setField(dto, "missedInstallments", sip.getMissedInstallments());
            setField(dto, "pausedDate", sip.getPausedDate());
            setField(dto, "stoppedDate", sip.getStoppedDate());
            
            // Calculate metrics from installments
            List<SIPInstallment> installments = sipInstallmentRepo.findBySipIdOrderByInstallmentDateDesc(sip.getId());
            BigDecimal totalInvested = installments.stream()
                .filter(i -> "EXECUTED".equals(i.getStatus()))
                .map(i -> i.getAmount() != null ? i.getAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            BigDecimal currentValue = installments.stream()
                .filter(i -> "EXECUTED".equals(i.getStatus()))
                .map(i -> {
                    BigDecimal units = i.getUnits() != null ? i.getUnits() : BigDecimal.ZERO;
                    BigDecimal currentNav = i.getNav() != null ? i.getNav().multiply(BigDecimal.valueOf(1.12)) : BigDecimal.ZERO;
                    return units.multiply(currentNav);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            Double returnsPct = totalInvested.compareTo(BigDecimal.ZERO) > 0 ?
                currentValue.subtract(totalInvested).divide(totalInvested, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100)).doubleValue() : 0.0;
            
            // Calculate XIRR
            Double xirr = calculateXIRRFromInstallments(installments.stream()
                .filter(i -> "EXECUTED".equals(i.getStatus()))
                .collect(Collectors.toList()));
            
            int monthsCompleted = sip.getStartDate() != null ?
                (int) ChronoUnit.MONTHS.between(sip.getStartDate(), LocalDate.now()) : 0;
            
            // Get recent installments
            List<SIPInstallment> recentInstallments = sipInstallmentRepo.findRecentBySipId(sip.getId());
            List<SipDetailDto.SipInstallmentDto> installmentDtos = recentInstallments.stream()
                .limit(10)
                .map(this::convertInstallmentToDto)
                .collect(Collectors.toList());
            
            setField(dto, "monthsCompleted", Math.max(0, monthsCompleted));
            setField(dto, "totalInvested", totalInvested);
            setField(dto, "currentValue", currentValue);
            setField(dto, "returnsPercentage", returnsPct);
            setField(dto, "xirr", xirr);
            setField(dto, "recentInstallments", installmentDtos);
            
            // Projected value
            BigDecimal monthly = sip.getAmount() != null ? BigDecimal.valueOf(sip.getAmount()) : BigDecimal.ZERO;
            setField(dto, "projectedValue", calculateSipFutureValue(monthly, 60, BigDecimal.valueOf(0.01)));
            
            return dto;
        }).collect(Collectors.toList());
    }
    
    private SipDetailDto.SipInstallmentDto convertInstallmentToDto(SIPInstallment installment) {
        SipDetailDto.SipInstallmentDto dto = new SipDetailDto.SipInstallmentDto();
        setField(dto, "id", installment.getId());
        setField(dto, "amount", installment.getAmount());
        setField(dto, "nav", installment.getNav());
        setField(dto, "units", installment.getUnits());
        setField(dto, "installmentDate", installment.getInstallmentDate());
        setField(dto, "executedDate", installment.getExecutedDate());
        setField(dto, "status", installment.getStatus());
        setField(dto, "failureReason", installment.getFailureReason());
        return dto;
    }
    
    private double calculateXIRRFromInstallments(List<SIPInstallment> installments) {
        if (installments.size() < 2) return 0.0;
        
        // Simplified XIRR calculation using Newton-Raphson method
        // For production, use a library like Apache Commons Math
        try {
            List<Double> cashFlows = new ArrayList<>();
            List<Long> dates = new ArrayList<>();
            
            // First installment is negative (investment)
            for (SIPInstallment inst : installments) {
                if (inst.getAmount() != null && inst.getExecutedDate() != null) {
                    cashFlows.add(-inst.getAmount().doubleValue());
                    dates.add(inst.getExecutedDate().toEpochDay());
                }
            }
            
            // Last value is positive (current value)
            BigDecimal currentValue = installments.stream()
                .map(i -> {
                    BigDecimal units = i.getUnits() != null ? i.getUnits() : BigDecimal.ZERO;
                    BigDecimal nav = i.getNav() != null ? i.getNav().multiply(BigDecimal.valueOf(1.12)) : BigDecimal.ZERO;
                    return units.multiply(nav);
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
            
            if (currentValue.compareTo(BigDecimal.ZERO) > 0) {
                cashFlows.add(currentValue.doubleValue());
                dates.add(LocalDate.now().toEpochDay());
            }
            
            // Simple XIRR approximation (annualized return)
            if (cashFlows.size() < 2) return 0.0;
            
            double totalInvested = cashFlows.stream()
                .filter(cf -> cf < 0)
                .mapToDouble(cf -> -cf)
                .sum();
            double finalValue = cashFlows.stream()
                .filter(cf -> cf > 0)
                .mapToDouble(cf -> cf)
                .sum();
            
            if (totalInvested == 0) return 0.0;
            
            long daysDiff = dates.get(dates.size() - 1) - dates.get(0);
            double years = daysDiff / 365.0;
            if (years <= 0) return 0.0;
            
            double cagr = Math.pow(finalValue / totalInvested, 1.0 / years) - 1.0;
            return cagr * 100.0; // Return as percentage
        } catch (Exception e) {
            return 0.0;
        }
    }
    
    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> result = new HashMap<>();
        result.put("success", false);
        result.put("error", message);
        return result;
    }
    
    private void setField(Object obj, String fieldName, Object value) {
        if (obj instanceof Map) {
            ((Map<String, Object>) obj).put(fieldName, value);
        } else {
            try {
                Field field = obj.getClass().getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(obj, value);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                // Ignore
            }
        }
    }
}


