package dev.ongolebulls.bse.ucc.domain;

import lombok.Data;

import java.util.List;

@Data
public class NomineeInfo {
    private List<Nominee> nominees;

    @Data
    public static class Nominee {
        private String name;
        private String relation;
        private String percentage;
        private String dob;
        private String address;
        private String city;
        private String state;
        private String pincode;
        private String guardianName;
        private String guardianPan;
    }
}
