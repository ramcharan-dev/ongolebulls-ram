package dev.ongolebulls.repository;

import dev.ongolebulls.model.CandidateApplication;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<CandidateApplication, Long> {

}
