package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "referral_clicks")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReferralClick {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "referrer_id", nullable = false)
    private Long referrerId;

    @Column(name = "referrer_name")
    private String referrerName;

    @Column(name = "referral_type")
    private String referralType;

    @CreationTimestamp
    @Column(name = "clicked_at", updatable = false)
    private LocalDateTime clickedAt;

    @Column(name = "ip_address")
    private String ipAddress;

    @Column(name = "registered_user_id")
    private Long registeredUserId;

    @Column(name = "registered_user_name")
    private String registeredUserName;

    @Column(name = "registered_at")
    private LocalDateTime registeredAt;

    @Column
    private Boolean converted = false;
}
