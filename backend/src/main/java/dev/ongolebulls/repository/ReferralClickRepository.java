package dev.ongolebulls.repository;

import dev.ongolebulls.model.ReferralClick;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReferralClickRepository extends JpaRepository<ReferralClick, Long> {
    List<ReferralClick> findByReferrerIdOrderByClickedAtDesc(Long referrerId);
    long countByReferrerIdAndConvertedTrue(Long referrerId);
    long countByConvertedTrue();
    List<ReferralClick> findAllByOrderByClickedAtDesc();
}
