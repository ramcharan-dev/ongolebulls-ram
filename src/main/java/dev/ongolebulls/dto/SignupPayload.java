package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class SignupPayload {
    private Basic basic;
    private ProfileType profileType;
    private Kyc kyc;
    private Bank bank;
    private Risk riskProfile;
    private Consents consents;
    private String recaptcha;

    @Data public static class Basic {
        private String fullName;
        private String email;
        private String mobile;
        private String password;
    }

    @Data public static class ProfileType {
        private String _for; // "SELF" or "RELATIVE" (frontend uses key "for")
        private String relation;
        private String relativeName;

        public String getFor() {
            return relation + " of " + relativeName;
        }

    }

    @Data public static class Kyc {
        private String pan;
        private String dob;   // ISO yyyy-MM-dd
        private String gender;
        private String address;
        private String pincode;
        private String city;
        private String state;
    }

    @Data public static class Bank {
        private String accountHolder;
        private String bankName;
        private String accountNumber;
        private String ifsc;
    }

    @Data public static class Risk {
        private int score;
        private String category;
    }

    @Data public static class Consents {
        private boolean c1, c2, c3, c4, c5;
        private String consentTimestamp; // ISO
        private String userAgent;
    }
}
