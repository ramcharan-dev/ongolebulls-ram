package dev.ongolebulls.bse.elog.dto;

public record ElogResponse(
        Long elogId,
        String clientCode,
        String intRefNo,
        String elogUrl,
        String status,
        String message
) {}
