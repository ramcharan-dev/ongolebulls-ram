package dev.ongolebulls.dto.support;

import lombok.Data;

@Data
public class TicketReplyRequest {
    private String message;
    private boolean isInternal;
}
