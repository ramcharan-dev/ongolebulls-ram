package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;

@Entity
@Table(name = "email_otps")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class EmailOtp {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String otp;
    private Instant expiresAt;
    private boolean used;
}
