package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SipGlossaryDto {
    private String title;
    private String description;
    private String videoUrl;
    private String videoThumbnail;
    private List<SipStep> steps;
    private SipExampleTable exampleTable;
    private List<SipFaq> faqs;
    private LocalDateTime lastUpdated;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SipStep {
        private Integer stepNumber;
        private String title;
        private String description;
        private String icon;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SipExampleTable {
        private String scenario;
        private List<SipExampleRow> rows;
        private String summary;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SipExampleRow {
        private Integer month;
        private Double investment;
        private Double nav;
        private Double units;
        private Double totalUnits;
        private Double totalValue;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SipFaq {
        private String question;
        private String answer;
    }
}

