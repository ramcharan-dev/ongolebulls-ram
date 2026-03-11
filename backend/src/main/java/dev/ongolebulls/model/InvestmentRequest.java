package dev.ongolebulls.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "investment_requests")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvestmentRequest {
        @Id
        @GeneratedValue
        private Long id;
        private Long userId;
        private String fundName;
        private Double amount;
        private String status = "PENDING";
        private LocalDateTime createdAt = LocalDateTime.now();
    }


