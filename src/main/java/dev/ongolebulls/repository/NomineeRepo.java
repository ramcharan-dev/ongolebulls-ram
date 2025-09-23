package dev.ongolebulls.repository;


import dev.ongolebulls.model.Nominee;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NomineeRepo extends JpaRepository<Nominee, Long> {
    List<Nominee> findByUserId(Long userId);
}