package dev.ongolebulls.bse.common.exception;

import lombok.Getter;

import java.util.List;

@Getter
public class BseValidationException extends RuntimeException {

    private final String apiName;
    private final Long investorId;
    private final List<String> validationErrors;

    public BseValidationException(String apiName, Long investorId, List<String> validationErrors) {
        super("Validation failed for " + apiName + ": " + String.join("; ", validationErrors));
        this.apiName = apiName;
        this.investorId = investorId;
        this.validationErrors = validationErrors;
    }
}
