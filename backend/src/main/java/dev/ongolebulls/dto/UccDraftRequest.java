package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class UccDraftRequest {
    private Long userId;
    private int currentStep;

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
