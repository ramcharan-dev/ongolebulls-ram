package dev.ongolebulls.dto.partner;

import lombok.Data;

@Data
public class AddClientRequest {
    private String fullName;
    private String email;
    private String mobile;
}
