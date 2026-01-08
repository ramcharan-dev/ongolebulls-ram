package dev.ongolebulls.dto;


import dev.ongolebulls.model.AppointmentType;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalTime;


public record AppointmentRequest(
        @NotBlank(message = "Full name is required") String fullName,
        @Email @NotBlank(message = "Email is required") String email,
        @Pattern(regexp = "^[0-9]{10}$", message = "Mobile must be 10 digits") String mobile,
        @NotBlank(message = "Employment type is required") String employmentType,
        @NotBlank(message = "Employment sector is required") String employmentSector,
        @NotBlank(message = "Country is required") String country,
        @NotBlank(message = "State is required") String state,
        @NotBlank(message = "City is required") String city,
        @NotNull AppointmentType type,
        String notes,
        LocalDate preferredDate,
        LocalTime preferredTime
) {}