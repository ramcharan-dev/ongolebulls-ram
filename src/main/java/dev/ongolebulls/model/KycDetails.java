package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "kyc_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String panNumber;  // ✅ matches AuthService's .panNumber(...)
    private LocalDate dob;     // ✅ matches LocalDate.parse(...) in AuthService
    private String gender;

    @Column(length = 1000)
    private String address;

    private String pincode;
    private String city;
    private String state;

    private String addressProofPath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    public void setPan(String pan) {
    }
}
