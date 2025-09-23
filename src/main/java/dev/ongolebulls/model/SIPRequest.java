package dev.ongolebulls.model;


import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Entity
@Table(name = "sip_requests")
@Data @NoArgsConstructor @AllArgsConstructor
public class SIPRequest {


        @Id @GeneratedValue
        private Long id;
        private Long userId;
        private String fundName;
        private Double amount;
        private String frequency; // MONTHLY or WEEKLY
        private LocalDate startDate;
        private LocalDate nextSIPDate;
        private String status = "ACTIVE";
    }

