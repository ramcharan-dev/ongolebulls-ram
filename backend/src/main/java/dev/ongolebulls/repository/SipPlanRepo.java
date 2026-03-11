package dev.ongolebulls.repository;

import dev.ongolebulls.model.SipPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SipPlanRepo extends JpaRepository<SipPlan, Long> {
    List<SipPlan> findByInvestor_IdAndActiveTrue(Long investorId);
}
