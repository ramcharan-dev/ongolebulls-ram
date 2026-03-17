package dev.ongolebulls.bse.nominee.dto;

public record NomineeResponse(
        Long registrationId,
        String clientCode,
        String status,
        String message
) {}