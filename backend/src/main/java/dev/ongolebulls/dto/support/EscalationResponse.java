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
public class EscalationResponse {
    private Long id;
    private String ticketId;
    private String subject;
    private String priority;
    private String status;
    private String raisedByName;
    private Long assignedTo;
    private String assignedToName;
    private long hoursOpen;
    private int replyCount;
    private boolean isEscalated;
    private LocalDateTime createdAt;
}
