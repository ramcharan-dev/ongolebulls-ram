package dev.ongolebulls.dto;

import java.time.LocalDateTime;

public class TicketReplyDto {
    private Long id;
    private String message;
    private boolean isFromSupport;
    private String repliedBy;
    private LocalDateTime createdAt;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public boolean isFromSupport() { return isFromSupport; }
    public void setFromSupport(boolean isFromSupport) { this.isFromSupport = isFromSupport; }

    public String getRepliedBy() { return repliedBy; }
    public void setRepliedBy(String repliedBy) { this.repliedBy = repliedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}


