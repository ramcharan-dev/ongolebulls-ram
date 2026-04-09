package dev.ongolebulls.dto.partner;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArnSubmitRequest {

    @NotBlank(message = "ARN number is required")
    private String arnNumber;

    @NotBlank(message = "PAN is required")
    @Pattern(regexp = "^[A-Z]{5}[0-9]{4}[A-Z]{1}$", message = "Invalid PAN format. Expected: ABCDE1234F")
    private String pan;

    private String euin;
}