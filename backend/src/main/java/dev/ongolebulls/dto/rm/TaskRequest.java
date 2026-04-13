package dev.ongolebulls.dto.rm;

import lombok.Data;

@Data
public class TaskRequest {
    private String title;
    private String description;
    private String priority;
    private String dueDate;
    private Long relatedPartnerId;
}
