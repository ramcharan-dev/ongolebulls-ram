package dev.ongolebulls.bse.ucc.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class BseUccRequest {
    private String userId;
    private String memberCode;
    private String password;
    private String regnType;
    private String param;
}
