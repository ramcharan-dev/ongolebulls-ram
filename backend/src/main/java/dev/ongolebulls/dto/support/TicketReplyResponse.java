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
public class TicketReplyResponse {
    private Long id;
    private String message;
    private boolean isFromSupport;
    private String repliedBy;
    private LocalDateTime createdAt;
}
