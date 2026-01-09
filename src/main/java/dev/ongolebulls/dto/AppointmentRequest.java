package dev.ongolebulls.dto;


import dev.ongolebulls.model.AppointmentType;
import jakarta.validation.constraints.*;


public record AppointmentRequest(
        @NotBlank(message = "Full name is required") String fullName,
        @Email @NotBlank(message = "Email is required") String email,
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be 10 digits") String mobile,
        @NotNull LocalDate preferredDate,
        @NotNull LocalTime preferredTime,
        @NotNull AppointmentType type,
        String notes
) {}