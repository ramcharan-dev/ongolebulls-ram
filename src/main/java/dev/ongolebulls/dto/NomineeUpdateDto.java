package dev.ongolebulls.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class NomineeUpdateDto {
    @NotBlank(message = "Nominee name is required")
    @Size(max = 100, message = "Nominee name must not exceed 100 characters")
    private String nomineeName;

    @NotBlank(message = "Relationship is required")
    @Size(max = 50, message = "Relationship must not exceed 50 characters")
    private String nomineeRelation;

    @NotNull(message = "Date of birth is required")
    private LocalDate nomineeDob;

    // Getters and Setters
    public String getNomineeName() { return nomineeName; }
    public void setNomineeName(String nomineeName) { this.nomineeName = nomineeName; }

    public String getNomineeRelation() { return nomineeRelation; }
    public void setNomineeRelation(String nomineeRelation) { this.nomineeRelation = nomineeRelation; }

    public LocalDate getNomineeDob() { return nomineeDob; }
    public void setNomineeDob(LocalDate nomineeDob) { this.nomineeDob = nomineeDob; }
}

