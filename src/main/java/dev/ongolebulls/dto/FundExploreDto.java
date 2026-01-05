package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FundExploreDto {
    private Long id;
    private String name;
    private String type;
    private Double returnsRegular;
    private Double returnsDirect;
    private Double nav;
    private Double navChange;
    private String risk; // LOW, MEDIUM, HIGH
    private String horizon; // SHORT_TERM, MEDIUM_TERM, LONG_TERM
    private String goal; // WEALTH, TAX_SAVING, RETIREMENT, SHORT_TERM
    private String assetType;
    private Integer fundAge;
    private Boolean isPopular;
    private String tagline;
}


