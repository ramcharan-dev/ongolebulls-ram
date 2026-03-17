package dev.ongolebulls.bse.common;

import dev.ongolebulls.bse.common.exception.BseApiException;
import dev.ongolebulls.bse.common.exception.BseTimeoutException;
import dev.ongolebulls.bse.common.exception.BseValidationException;
import dev.ongolebulls.util.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice(basePackages = "dev.ongolebulls.bse")
@Slf4j
public class BseExceptionHandler {

    @ExceptionHandler(BseValidationException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidation(BseValidationException ex) {
        log.warn("BSE validation failed: api={}, investorId={}, errors={}",
                ex.getApiName(), ex.getInvestorId(), ex.getValidationErrors());
        return ResponseEntity.badRequest()
                .body(ApiResponse.fail("Validation failed: " + String.join("; ", ex.getValidationErrors())));
    }

    @ExceptionHandler(BseTimeoutException.class)
    public ResponseEntity<ApiResponse<Object>> handleTimeout(BseTimeoutException ex) {
        log.error("BSE API timeout: api={}, investorId={}", ex.getApiName(), ex.getInvestorId(), ex);
        return ResponseEntity.status(HttpStatus.GATEWAY_TIMEOUT)
                .body(ApiResponse.fail("BSE API request timed out. Please try again later."));
    }

    @ExceptionHandler(BseApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleBseApi(BseApiException ex) {
        log.error("BSE API error: api={}, investorId={}, status={}",
                ex.getApiName(), ex.getInvestorId(), ex.getBseStatusCode(), ex);
        return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                .body(ApiResponse.fail("BSE API error: " + ex.getMessage()));
    }
}
