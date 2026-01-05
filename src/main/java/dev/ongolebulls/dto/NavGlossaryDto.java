package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NavGlossaryDto {
    private String title;
    private String definition;
    private String formula;
    private String formulaExplanation;
    private NavExample example;
    private List<NavFaq> faqs;
    private LocalDateTime lastUpdated;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NavExample {
        private String scenario;
        private Double totalAssets;
        private Double totalLiabilities;
        private Long totalUnits;
        private Double calculatedNav;
        private String explanation;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class NavFaq {
        private String question;
        private String answer;
    }
}

