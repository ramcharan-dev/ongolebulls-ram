package dev.ongolebulls.controller;

import dev.ongolebulls.dto.SipDetailDto;
import dev.ongolebulls.model.SipPlan;
import dev.ongolebulls.repository.SipPlanRepo;
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
public class SipsController {

    private final SipPlanRepo sipPlanRepo;
    private final UserRepository userRepository;

    public SipsController(SipPlanRepo sipPlanRepo, UserRepository userRepository) {
        this.sipPlanRepo = sipPlanRepo;
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


