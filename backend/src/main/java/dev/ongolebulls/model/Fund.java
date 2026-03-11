package dev.ongolebulls.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Fund {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;
    private Double returnsRegular;
    private Double returnsDirect;
    private Double nav;
    private Double navChange;
    private Integer fundAge;
    private String risk;
    private String horizon;
    private String goal;
    private String assetType;
}
