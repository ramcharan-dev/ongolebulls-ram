package dev.ongolebulls.repository;

import dev.ongolebulls.model.DocumentReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentReviewRepository extends JpaRepository<DocumentReview, Long> {

    List<DocumentReview> findByStatusOrderBySubmittedAtAsc(DocumentReview.ReviewStatus status);

    List<DocumentReview> findByPartnerIdOrderBySubmittedAtDesc(Long partnerId);

    List<DocumentReview> findByStatusInOrderBySubmittedAtAsc(List<DocumentReview.ReviewStatus> statuses);
}
