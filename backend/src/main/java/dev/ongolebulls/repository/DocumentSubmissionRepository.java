package dev.ongolebulls.repository;

import dev.ongolebulls.model.DocumentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface DocumentSubmissionRepository extends JpaRepository<DocumentSubmission, Long> {

    List<DocumentSubmission> findByStatus(String status);

    @Query("SELECT d FROM DocumentSubmission d WHERE " +
            "LOWER(d.investorName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.investorEmail) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.panNumber) LIKE LOWER(CONCAT('%', :search, '%'))")
    List<DocumentSubmission> searchDocuments(@Param("search") String search);

    @Query("SELECT d FROM DocumentSubmission d WHERE " +
            "d.status = :status AND (" +
            "LOWER(d.investorName) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.investorEmail) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
            "LOWER(d.panNumber) LIKE LOWER(CONCAT('%', :search, '%')))")
    List<DocumentSubmission> searchByStatusAndKeyword(@Param("status") String status, @Param("search") String search);

    Long countByStatus(String status);

    boolean existsByPanNumber(String panNumber);

}
