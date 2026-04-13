package dev.ongolebulls.service;

import dev.ongolebulls.bse.common.BseConstants;
import dev.ongolebulls.bse.common.exception.BseApiException;
import dev.ongolebulls.bse.common.exception.BseTimeoutException;
import dev.ongolebulls.bse.common.exception.BseValidationException;
import dev.ongolebulls.bse.ucc.dto.UccGenerationResult;
import dev.ongolebulls.bse.ucc.service.UccService;
import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.repository.UccRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class UccWorkerService {

    private final UccRegistrationRepository repository;
    private final UccService uccService;

    private static final int MAX_RETRIES = 3;

    /**
     * Scheduled job that picks up PENDING UCC registrations
     * and submits them to the BSE UCC API via the new architecture.
     * Runs every 30 seconds.
     */
    @Scheduled(fixedDelay = 30000, initialDelay = 10000)
    public void processPendingRegistrations() {
        List<UccRegistration> pending = repository.findByStatus(BseConstants.STATUS_PENDING);

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

            // Delegate to the new BSE UCC architecture
            UccGenerationResult result = uccService.generateUcc(reg);

            if (result.isSuccess()) {
                reg.setStatus(BseConstants.STATUS_SUCCESS);
                reg.setErrorMessage(null);
                reg.setBseResponse(result.getBseRemarks());
                if (result.getClientCode() != null) {
                    reg.setClientCode(result.getClientCode());
                }
                log.info("UCC registration SUCCESS for userId={}, clientCode={}",
                        reg.getUserId(), result.getClientCode());
            } else {
                handleFailure(reg, result.getErrorMessage());
            }

            repository.save(reg);

        } catch (BseValidationException e) {
            // Validation errors are not retryable — fail immediately
            log.error("UCC validation failed for userId={}: {}", reg.getUserId(), e.getValidationErrors());
            reg.setStatus(BseConstants.STATUS_FAILED);
            reg.setErrorMessage("Validation failed: " + String.join("; ", e.getValidationErrors()));
            repository.save(reg);

        } catch (BseTimeoutException e) {
            log.warn("BSE API timeout for userId={}", reg.getUserId());
            handleFailure(reg, "BSE API timeout: " + e.getMessage());
            repository.save(reg);

        } catch (BseApiException e) {
            log.error("BSE API error for userId={}: {}", reg.getUserId(), e.getMessage());
            handleFailure(reg, "BSE API error: " + e.getMessage());
            repository.save(reg);

        } catch (Exception e) {
            log.error("Unexpected error processing UCC registration id={}", reg.getId(), e);
            handleFailure(reg, "Processing error: " + e.getMessage());
            repository.save(reg);
        }
    }

    private void handleFailure(UccRegistration reg, String errorMessage) {
        reg.setRetryCount(reg.getRetryCount() + 1);
        reg.setErrorMessage(errorMessage);

        if (reg.getRetryCount() >= MAX_RETRIES) {
            reg.setStatus(BseConstants.STATUS_FAILED);
            log.warn("UCC registration FAILED after {} retries for userId={}", MAX_RETRIES, reg.getUserId());
        } else {
            // Keep as PENDING for next retry cycle
            log.info("UCC registration attempt {} failed for userId={}, will retry",
                    reg.getRetryCount(), reg.getUserId());
        }
    }
}
