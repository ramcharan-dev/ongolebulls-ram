package dev.ongolebulls.service;

import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.repository.UccRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class UccWorkerService {

    private final UccRegistrationRepository repository;
    private final BseStarMfService bseService;

    private static final int MAX_RETRIES = 3;

    /**
     * Scheduled job that picks up PENDING UCC registrations
     * and submits them to the exchange API.
     * Runs every 30 seconds.
     */
    @Scheduled(fixedDelay = 30000, initialDelay = 10000)
    public void processPendingRegistrations() {
        List<UccRegistration> pending = repository.findByStatus("PENDING");

        if (pending.isEmpty()) return;

        log.info("Found {} pending UCC registrations to process", pending.size());

        for (UccRegistration reg : pending) {
            processRegistration(reg);
        }
    }

    @Transactional
    public void processRegistration(UccRegistration reg) {
        try {
            log.info("Processing UCC registration id={}, userId={}, attempt={}",
                    reg.getId(), reg.getUserId(), reg.getRetryCount() + 1);

            Map<String, Object> result = bseService.createUcc(reg);

            boolean success = Boolean.TRUE.equals(result.get("success"));
            String response = result.get("response") != null ? result.get("response").toString() : null;
            String errorMsg = result.get("errorMessage") != null ? result.get("errorMessage").toString() : null;

            reg.setBseResponse(response);

            if (success) {
                reg.setStatus("SUCCESS");
                reg.setErrorMessage(null);
                // Extract client code from BSE response if available
                if (reg.getClientCode() == null || reg.getClientCode().isBlank()) {
                    reg.setClientCode(extractClientCode(response));
                }
                log.info("UCC registration SUCCESS for userId={}", reg.getUserId());
            } else {
                reg.setRetryCount(reg.getRetryCount() + 1);

                if (reg.getRetryCount() >= MAX_RETRIES) {
                    reg.setStatus("FAILED");
                    reg.setErrorMessage(errorMsg != null ? errorMsg : "Max retries exceeded");
                    log.warn("UCC registration FAILED after {} retries for userId={}", MAX_RETRIES, reg.getUserId());
                } else {
                    // Keep as PENDING for next retry cycle
                    reg.setErrorMessage(errorMsg);
                    log.info("UCC registration attempt {} failed for userId={}, will retry", reg.getRetryCount(), reg.getUserId());
                }
            }

            repository.save(reg);

        } catch (Exception e) {
            log.error("Error processing UCC registration id={}", reg.getId(), e);
            reg.setRetryCount(reg.getRetryCount() + 1);
            reg.setErrorMessage("Processing error: " + e.getMessage());
            if (reg.getRetryCount() >= MAX_RETRIES) {
                reg.setStatus("FAILED");
            }
            repository.save(reg);
        }
    }

    private String extractClientCode(String response) {
        // Parse the BSE response to extract generated client code
        // This depends on actual BSE API response format
        if (response == null) return null;
        try {
            if (response.contains("ClientCode")) {
                int idx = response.indexOf("ClientCode");
                // Basic extraction — adapt to actual BSE response format
                return response.substring(idx).replaceAll("[^A-Z0-9]", "").substring(0, Math.min(10, response.length()));
            }
        } catch (Exception e) {
            log.warn("Could not extract client code from response", e);
        }
        return null;
    }
}
