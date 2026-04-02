package dev.ongolebulls.dto.rm;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String priority;
    private LocalDate dueDate;
    private boolean isCompleted;
    private Long relatedPartnerId;
    private String relatedPartnerName;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
