package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Entity
@Table(name = "candidate_application")
public class CandidateApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String phone;
    private int graduationYear;
    private String skills;
    private String experience;
    private String resumePath;
    private String appliedFor;


    // Correct getter for appliedFor
    public String getAppliedFor() {
        return appliedFor;
    }

    // Correct setter for appliedFor
    public void setAppliedFor(String appliedFor) {
        this.appliedFor = appliedFor;
    }

    // No need to manually add other getters/setters if using Lombok (@Getter/@Setter)
}
