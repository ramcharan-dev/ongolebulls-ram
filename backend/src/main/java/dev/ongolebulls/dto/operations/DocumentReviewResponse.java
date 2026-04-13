package dev.ongolebulls.dto.operations;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DocumentReviewResponse {
    private Long id;
    private Long partnerId;
    private String partnerName;
    private String documentType;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime reviewedAt;
    private String notes;
}
