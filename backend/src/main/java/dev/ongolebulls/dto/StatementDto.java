package dev.ongolebulls.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatementDto {
    private Long id;
    private String statementType; // PORTFOLIO, CAPITAL_GAINS, TRANSACTIONS, TAX
    private LocalDate fromDate;
    private LocalDate toDate;
    private String financialYear;
    private String fileName;
    private String downloadUrl;
    private LocalDate generatedDate;
}


