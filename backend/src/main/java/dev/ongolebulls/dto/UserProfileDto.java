package dev.ongolebulls.dto;

import lombok.Data;
import java.time.LocalDate;
@Data
public class UserProfileDto {
    private Long id;
    private String username;
    private String email;
    private String mobile;
    private String fullName;
    private LocalDate dateOfBirth;
    private String panNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String profileImageUrl;
    private LocalDate memberSince;
    private String riskProfile;
    private String kycStatus;
}