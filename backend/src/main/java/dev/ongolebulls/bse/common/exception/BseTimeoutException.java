package dev.ongolebulls.bse.common.exception;

import lombok.Data;
import lombok.Getter;

@Getter
public class BseTimeoutException extends BseApiException {

    public BseTimeoutException(String apiName, Long investorId, String message) {
        super(apiName, investorId, message, null);
    }

    public BseTimeoutException(String apiName, Long investorId, String message, Throwable cause) {
        super(apiName, investorId, message, String.valueOf(cause));
    }
}
