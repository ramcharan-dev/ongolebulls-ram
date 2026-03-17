package dev.ongolebulls.bse.ucc.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UccGenerationResult {
    private boolean success;
    private String clientCode;
    private String errorMessage;
    private String bseStatusCode;
    private String bseRemarks;
}
