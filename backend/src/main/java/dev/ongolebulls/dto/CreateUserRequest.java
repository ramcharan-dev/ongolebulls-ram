package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String role;
    private String password;

    // Optional RM service area — only meaningful when role = RELATIONSHIP_MANAGER.
    // If assignedDistrict is null but assignedState is set, the RM is treated
    // as a state-level RM (covers the whole state as a fallback).
    private String assignedState;
    private String assignedDistrict;
}
