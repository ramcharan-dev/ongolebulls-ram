package dev.ongolebulls.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "nominees")
@Data @NoArgsConstructor @AllArgsConstructor
public class Nominee {
    @Id @GeneratedValue
    private Long id;
    private Long userId;
    private String name;
    private String relation;
    private int percentage;
}

