package dev.ongolebulls.bse.elog.dto;

import lombok.Builder;

@Builder
public record ElogResult(
        boolean success,
        int httpStatus,
        String bseStatusCode,
        String authUrl,
        String errorDesc,
        String intRefNo,
        String rawResponse
) {}
