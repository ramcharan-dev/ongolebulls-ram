package dev.ongolebulls.repository;

import dev.ongolebulls.model.SIPRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SIPRequestRepo extends JpaRepository<SIPRequest, Long> {
    List<SIPRequest> findByUserId(Long userId);
}

