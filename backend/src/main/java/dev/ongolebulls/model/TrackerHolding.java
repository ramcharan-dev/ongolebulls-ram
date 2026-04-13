package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "tracker_holdings")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackerHolding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "partner_id", nullable = false)
    private Long partnerId;

    @Column(name = "client_name")
    private String clientName;

    @Column(name = "client_id")
    private Long clientId;

    @Column(name = "amc_name")
    private String amcName;

    @Column(name = "fund_name")
    private String fundName;

    @Column(name = "folio_number")
    private String folioNumber;

    @Column(name = "units", precision = 10, scale = 4)
    private BigDecimal units;

    @Column(name = "nav", precision = 10, scale = 4)
    private BigDecimal nav;

    @Column(name = "current_value", precision = 15, scale = 2)
    private BigDecimal currentValue;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;
}
