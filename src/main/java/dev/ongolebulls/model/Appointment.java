package dev.ongolebulls.model;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;
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


    @Column(nullable = false)
    private LocalDate preferredDate;


    @Column(nullable = false)
    private LocalTime preferredTime;


    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 40)
    private AppointmentType type;


    @Column(columnDefinition = "TEXT")
    private String notes;


    @Column(nullable = false)
    private OffsetDateTime createdAt;
}