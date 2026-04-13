package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserSummaryResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private boolean isActivated;
    private Instant createdAt;

    // RM service area (only populated for RELATIONSHIP_MANAGER rows).
    private String assignedState;
    private String assignedDistrict;
    private String assignedCity;
}
