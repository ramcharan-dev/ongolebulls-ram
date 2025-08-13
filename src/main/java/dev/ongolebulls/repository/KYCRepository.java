package dev.ongolebulls.repository;

import dev.ongolebulls.model.KycDetails;
import dev.ongolebulls.model.KycDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface KYCRepository extends JpaRepository<KycDetails, Long> {
}
