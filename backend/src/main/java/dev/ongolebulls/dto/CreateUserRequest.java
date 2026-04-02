package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String role;
    private String password;
}
