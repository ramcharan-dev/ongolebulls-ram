package dev.ongolebulls.bse.ucc.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BseUccResponse {
    private int httpStatus;
    private String statusCode;
    private String statusMessage;
    private String clientCode;
    private String remarks;
    private String rawResponse;
}
