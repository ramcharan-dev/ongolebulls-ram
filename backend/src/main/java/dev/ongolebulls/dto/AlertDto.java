package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class AlertDto {

    private String message;
    private String type;      // INFO / WARNING / SUCCESS / ERROR
    private String createdAt; // optional (yyyy-MM-dd)
}
