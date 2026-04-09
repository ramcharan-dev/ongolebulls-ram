package dev.ongolebulls.dto.admin;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArnRequestResponse {
    private Long userId;
    private String fullName;
    private String firmName;
    private String email;
    private String partnerType;
    private String arn;
    private String pan;
    private String euin;
    private String arnStatus;
    private String rejectionReason;
    private Instant createdAt;
}