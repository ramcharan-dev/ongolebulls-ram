package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class EquityDebtGlossaryDto {
    private String title;
    private String description;
    private EquityDebtComparison comparison;
    private List<EquityDebtFaq> faqs;
    private List<WhenToChoose> whenToChoose;
    private LocalDateTime lastUpdated;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquityDebtComparison {
        private EquityInfo equity;
        private DebtInfo debt;
        private ComparisonTable comparisonTable;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquityInfo {
        private String definition;
        private List<String> pros;
        private List<String> cons;
        private String riskLevel;
        private String returns;
        private String timeHorizon;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DebtInfo {
        private String definition;
        private List<String> pros;
        private List<String> cons;
        private String riskLevel;
        private String returns;
        private String timeHorizon;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComparisonTable {
        private List<ComparisonRow> rows;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ComparisonRow {
        private String aspect;
        private String equity;
        private String debt;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EquityDebtFaq {
        private String question;
        private String answer;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WhenToChoose {
        private String type; // EQUITY or DEBT
        private String scenario;
        private String explanation;
    }
}

