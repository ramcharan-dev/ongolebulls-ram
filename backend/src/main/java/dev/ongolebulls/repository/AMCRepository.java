package dev.ongolebulls.repository;

import dev.ongolebulls.model.AMC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AMCRepository extends JpaRepository<AMC, Long> {
}
