package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RelationshipManagerDto {
    private String name;
    private String phone;
    private String email;
    private String designation;
    private String officeAddress;
}


