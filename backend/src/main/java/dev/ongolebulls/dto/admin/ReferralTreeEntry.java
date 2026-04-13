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
public class ReferralTreeEntry {
    private Long referrerId;
    private String referrerName;
    private String referrerType;
    private Long referredUserId;
    private String referredUserName;
    private String referredUserRole;
    private boolean referredUserActivated;
    private Instant referredAt;
}
