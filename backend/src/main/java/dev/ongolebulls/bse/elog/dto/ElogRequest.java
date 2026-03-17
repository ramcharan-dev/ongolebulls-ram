package dev.ongolebulls.bse.elog.dto;

public record ElogRequest(
        Long investorId,
        String clientCode,
        String documentType,
        String loopbackUrl
) {}
