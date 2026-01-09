package dev.ongolebulls.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;


@Entity
@Table(name = "appointments")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class Appointment {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @Column(nullable = false)
    private String fullName;


    @Column(nullable = false)
    private String email;


    @Column(nullable = false, length = 20)
    private String mobile;

    @Column(nullable = false, length = 20)
    private String employmentType;

    @Column(nullable = false, length = 50)
    private String employmentSector;

    @Column(nullable = false, length = 50)
    private String country;

    @Column(nullable = false, length = 50)
    private String state;

    @Column(nullable = false, length = 50)
    private String city;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private AppointmentType type;


    @Column(columnDefinition = "TEXT")
    private String notes;


    @Column(nullable = false)
    private OffsetDateTime createdAt;
}