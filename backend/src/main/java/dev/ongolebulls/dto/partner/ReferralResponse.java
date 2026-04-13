package dev.ongolebulls.dto.partner;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralResponse {
    private Long id;
    private String referralType;
    private LocalDateTime clickedAt;
    private boolean converted;
    private String registeredUserName;
    private LocalDateTime registeredAt;
    private Long registeredUserId;
    private String partnerStatus;
}
