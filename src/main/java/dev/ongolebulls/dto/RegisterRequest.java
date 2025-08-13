package dev.ongolebulls.dto;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class RegisterRequest implements Serializable {

    private Basic basic;
    private ProfileType profileType;
    private Kyc kyc;
    private Bank bank;
    private RiskProfileShort riskProfile;
    private Consents consents;
    private String recaptcha;

    // For OTPs
    private String emailOtp;
    private String mobileOtp;

    // ===== Outer class getters/setters =====

    public Basic getBasic() {
        return basic;
    }

    public void setBasic(Basic basic) {
        this.basic = basic;
    }

    public ProfileType getProfileType() {
        return profileType;
    }

    public void setProfileType(ProfileType profileType) {
        this.profileType = profileType;
    }

    public Kyc getKyc() {
        return kyc;
    }

    public void setKyc(Kyc kyc) {
        this.kyc = kyc;
    }

    public Bank getBank() {
        return bank;
    }

    public void setBank(Bank bank) {
        this.bank = bank;
    }

    public RiskProfileShort getRiskProfile() {
        return riskProfile;
    }

    public void setRiskProfile(RiskProfileShort riskProfile) {
        this.riskProfile = riskProfile;
    }

    public Consents getConsents() {
        return consents;
    }

    public void setConsents(Consents consents) {
        this.consents = consents;
    }

    public String getRecaptcha() {
        return recaptcha;
    }

    public void setRecaptcha(String recaptcha) {
        this.recaptcha = recaptcha;
    }

    public String getEmail() {
        return basic != null ? basic.getEmail() : null;
    }

    public String getMobile() {
        return basic != null ? basic.getMobile() : null;
    }

    public String getEmailOtp() {
        return emailOtp;
    }

    public void setEmailOtp(String emailOtp) {
        this.emailOtp = emailOtp;
    }

    public String getMobileOtp() {
        return mobileOtp;
    }

    public void setMobileOtp(String mobileOtp) {
        this.mobileOtp = mobileOtp;
    }

    // ===== Nested Classes =====

    public static class Basic {
        private String fullName;
        private String email;
        private String mobile;
        private String password;

        public String getFullName() {
            return fullName;
        }

        public void setFullName(String fullName) {
            this.fullName = fullName;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getMobile() {
            return mobile;
        }

        public void setMobile(String mobile) {
            this.mobile = mobile;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    public static class ProfileType {
        private String forField;
        private String relation;
        private String relativeName;

        public String getForField() {
            return forField;
        }

        public void setForField(String forField) {
            this.forField = forField;
        }

        public String getRelation() {
            return relation;
        }

        public void setRelation(String relation) {
            this.relation = relation;
        }

        public String getRelativeName() {
            return relativeName;
        }

        public void setRelativeName(String relativeName) {
            this.relativeName = relativeName;
        }
    }

    public static class Kyc {
        private String pan;
        private LocalDate dob;
        private String gender;
        private String address;
        private String pincode;
        private String city;
        private String state;

        public String getPan() {
            return pan;
        }

        public void setPan(String pan) {
            this.pan = pan;
        }

        public LocalDate getDob() {
            return dob;
        }

        public void setDob(String dob) {
            if (dob != null && !dob.isEmpty()) {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                this.dob = LocalDate.parse(dob, formatter);
            } else {
                this.dob = null;
            }
        }

        public void setDob(LocalDate dob) {
            this.dob = dob;
        }

        public String getGender() {
            return gender;
        }

        public void setGender(String gender) {
            this.gender = gender;
        }

        public String getAddress() {
            return address;
        }

        public void setAddress(String address) {
            this.address = address;
        }

        public String getPincode() {
            return pincode;
        }

        public void setPincode(String pincode) {
            this.pincode = pincode;
        }

        public String getCity() {
            return city;
        }

        public void setCity(String city) {
            this.city = city;
        }

        public String getState() {
            return state;
        }

        public void setState(String state) {
            this.state = state;
        }
    }

    public static class Bank {
        private String accountHolder;
        private String bankName;
        private String accountNumber;
        private String ifsc;

        public String getAccountHolder() {
            return accountHolder;
        }

        public void setAccountHolder(String accountHolder) {
            this.accountHolder = accountHolder;
        }

        public String getBankName() {
            return bankName;
        }

        public void setBankName(String bankName) {
            this.bankName = bankName;
        }

        public String getAccountNumber() {
            return accountNumber;
        }

        public void setAccountNumber(String accountNumber) {
            this.accountNumber = accountNumber;
        }

        public String getIfsc() {
            return ifsc;
        }

        public void setIfsc(String ifsc) {
            this.ifsc = ifsc;
        }
    }

    public static class RiskProfileShort {
        private int score;
        private String category;

        public int getScore() {
            return score;
        }

        public void setScore(int score) {
            this.score = score;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    public static class Consents {
        private boolean c1;
        private boolean c2;
        private boolean c3;
        private boolean c4;
        private boolean c5;
        private String consentTimestamp;
        private String userAgent;

        public boolean isC1() { return c1; }
        public void setC1(boolean c1) { this.c1 = c1; }

        public boolean isC2() { return c2; }
        public void setC2(boolean c2) { this.c2 = c2; }

        public boolean isC3() { return c3; }
        public void setC3(boolean c3) { this.c3 = c3; }

        public boolean isC4() { return c4; }
        public void setC4(boolean c4) { this.c4 = c4; }

        public boolean isC5() { return c5; }
        public void setC5(boolean c5) { this.c5 = c5; }

        public String getConsentTimestamp() { return consentTimestamp; }
        public void setConsentTimestamp(String consentTimestamp) { this.consentTimestamp = consentTimestamp; }

        public String getUserAgent() { return userAgent; }
        public void setUserAgent(String userAgent) { this.userAgent = userAgent; }
    }
}
