package dev.ongolebulls.dto;

import lombok.Builder;
import lombok.Data;

import java.time.Instant;

@Data
@Builder
public class UccStatusResponse {
    private Long id;
    private Long userId;
    private String clientCode;
    private String status;
    private String errorMessage;
    private Instant createdAt;
    private Instant updatedAt;

    // All step data for resuming draft
    private Object clientDetails;
    private Object jointHolder;
    private Object guardian;
    private Object panDetails;
    private Object clientType;
    private Object bankDetails;
    private Object address;
    private Object contact;
    private Object communication;
    private Object nriDetails;
    private Object kyc;
    private Object aadhaar;
    private Object declaration;
    private Object nomination;
    private Object nomineeDetails;
}
