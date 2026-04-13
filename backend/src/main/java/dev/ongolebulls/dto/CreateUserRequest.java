package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String role;
    private String password;

    // Optional RM service area — only meaningful when role = RELATIONSHIP_MANAGER.
    // Fallback chain (most → least specific):
    //   1. assignedCity (with assignedState)         — city-level RM
    //   2. assignedDistrict (with assignedState)     — district-level RM
    //   3. assignedState only                         — state-level RM
    // assignedState is required when any of these are set. assignedDistrict
    // and assignedCity are both optional and independent — a city-level RM
    // may or may not also have a district set.
    private String assignedState;
    private String assignedDistrict;
    private String assignedCity;
}
