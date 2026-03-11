package dev.ongolebulls.repository;

import dev.ongolebulls.model.UccRegistration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UccRegistrationRepository extends JpaRepository<UccRegistration, Long> {

    Optional<UccRegistration> findByUserId(Long userId);

    Optional<UccRegistration> findByUserIdAndStatusNot(Long userId, String status);

    List<UccRegistration> findByStatus(String status);

    Optional<UccRegistration> findByClientCode(String clientCode);

    boolean existsByUserId(Long userId);
}
