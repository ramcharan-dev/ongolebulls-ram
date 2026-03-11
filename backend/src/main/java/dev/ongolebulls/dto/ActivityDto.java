package dev.ongolebulls.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ActivityDto {
    private Long id;
    private String type; // TRANSACTION, SYSTEM, ALERT, etc.
    private String title;
    private String description;
    private LocalDateTime timestamp;
    private boolean read;
    private String actionUrl;
}