package dev.ongolebulls.dto.support;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketDetailResponse {
    private Long id;
    private String ticketId;
    private String subject;
    private String description;
    private String category;
    private String priority;
    private String status;
    private String raisedByName;
    private String raisedByEmail;
    private Long raisedById;
    private String raisedByRole;
    private String assignedToName;
    private Long assignedTo;
    private boolean isEscalated;
    private String resolution;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private List<TicketReplyResponse> replies;
}
