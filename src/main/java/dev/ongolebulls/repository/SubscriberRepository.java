package dev.ongolebulls.repository;


import dev.ongolebulls.model.Subscriber;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SubscriberRepository extends JpaRepository<Subscriber, Long> {
    boolean existsByEmail(String email);
    Optional<Subscriber> findByEmail(String email);
    Optional<Subscriber> findByUnsubscribeToken(String token);
    List<Subscriber> findByStatus(Subscriber.Status status);
}
