package dev.ongolebulls.bse.common.exception;

import lombok.Getter;

@Getter
public class BseApiException extends RuntimeException {

    private final String apiName;
    private final Long investorId;
    private final String bseStatusCode;

    public BseApiException(String apiName, Long investorId, String bseStatusCode, String message) {
        super(message);
        this.apiName = apiName;
        this.investorId = investorId;
        this.bseStatusCode = bseStatusCode;
    }

    /**
     * Generic API failure without a specific BSE status code.
     */
    public BseApiException(String apiName, Long investorId, Throwable cause) {
        super(cause.getMessage(), cause);
        this.apiName = apiName;
        this.investorId = investorId;
        this.bseStatusCode = null;
    }
}
