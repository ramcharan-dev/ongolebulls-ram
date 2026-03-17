package dev.ongolebulls.bse.nominee.dto;

import lombok.Builder;

@Builder
public record NomineeResult(
        boolean success,
        int httpStatus,
        String bseStatusCode,
        String errorDesc,
        String rawResponse
) {}