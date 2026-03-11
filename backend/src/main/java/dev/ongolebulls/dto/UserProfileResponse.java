package dev.ongolebulls.dto;

import lombok.Data;


import lombok.Data;
import java.time.Instant;
@Data
public class UserProfileResponse {

        // --- Basic Info ---
        private String fullName;
        private String email;
        private String mobileNumber;
        private String gender;
        private String dob;
        private String address;
        private String city;
        private String state;
        private String pincode;

        // --- Bank Details ---
        private String bankName;
        private String accountNumber;
        private String ifsc;
        private String accountHolderName;

        // --- KYC Details ---
        private String panNumber;
        private String aadhaarNumber;
        private String occupation;
        private String annualIncomeRange;
        private String riskTolerance;
        private boolean kycVerified;

        // --- Profile ---
        private String riskCategory;
        private int riskScore;

        // --- Meta Info ---
        private Instant createdAt;
}


