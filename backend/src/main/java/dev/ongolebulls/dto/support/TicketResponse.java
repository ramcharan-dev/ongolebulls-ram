package dev.ongolebulls.dto.support;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TicketResponse {
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
    private String assignedToName;
    private Long assignedTo;
    private boolean isEscalated;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
    private int replyCount;
}
