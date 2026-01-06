package dev.ongolebulls.controller;

import dev.ongolebulls.dto.StatementDto;
import dev.ongolebulls.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/statements")
@CrossOrigin(origins = "*")
public class StatementsController {

    private final UserRepository userRepository;

    public StatementsController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{userId}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<List<StatementDto>> getStatements(
            @PathVariable Long userId,
            @RequestParam(required = false) String statementType,
            @RequestParam(required = false) String financialYear,
            @RequestParam(required = false) String fromDate,
            @RequestParam(required = false) String toDate) {
        try {
            // Generate sample statements (in production, fetch from database)
            List<StatementDto> statements = new ArrayList<>();
            
            String[] types = statementType != null && !statementType.isEmpty() ? new String[]{statementType} : 
                new String[]{"PORTFOLIO", "CAPITAL_GAINS", "TRANSACTIONS", "TAX"};
            
            String fy = financialYear != null && !financialYear.isEmpty() ? financialYear : getCurrentFinancialYear();
            
            LocalDate from = null;
            LocalDate to = null;
            
            if (fromDate != null && !fromDate.isEmpty()) {
                from = LocalDate.parse(fromDate);
            }
            if (toDate != null && !toDate.isEmpty()) {
                to = LocalDate.parse(toDate);
            }
            
            // If no date range specified, use financial year dates
            if (from == null) {
                from = LocalDate.parse(fy + "-04-01");
            }
            if (to == null) {
                to = LocalDate.parse((Integer.parseInt(fy) + 1) + "-03-31");
            }
            
            for (String type : types) {
                StatementDto stmt = new StatementDto();
                setField(stmt, "id", (long) statements.size() + 1);
                setField(stmt, "statementType", type);
                setField(stmt, "fromDate", from);
                setField(stmt, "toDate", to);
                setField(stmt, "financialYear", fy);
                setField(stmt, "fileName", generateFileName(type, fy));
                setField(stmt, "downloadUrl", "/api/statements/" + userId + "/download/" + type + "?fy=" + fy);
                setField(stmt, "generatedDate", LocalDate.now());
                statements.add(stmt);
            }
            
            return ResponseEntity.ok(statements);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    @GetMapping("/{userId}/download/{type}")
    @CrossOrigin(origins = "*")
    public ResponseEntity<Map<String, String>> downloadStatement(
            @PathVariable Long userId,
            @PathVariable String type,
            @RequestParam(required = false) String fy) {
        try {
            String financialYear = fy != null && !fy.isEmpty() ? fy : getCurrentFinancialYear();
            String fileName = generateFileName(type, financialYear);
            String downloadUrl = "/api/statements/" + userId + "/download/" + type + "?fy=" + financialYear;
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Statement download initiated");
            response.put("fileName", fileName);
            response.put("downloadUrl", downloadUrl);
            response.put("status", "SUCCESS");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> response = new HashMap<>();
            response.put("status", "ERROR");
            response.put("message", "Failed to generate statement: " + e.getMessage());
            return ResponseEntity.ok(response);
        }
    }

    private String getCurrentFinancialYear() {
        LocalDate now = LocalDate.now();
        int year = now.getYear();
        if (now.getMonthValue() < 4) {
            year--;
        }
        return String.valueOf(year);
    }

    private String generateFileName(String type, String fy) {
        return type.toLowerCase() + "_statement_" + fy + "_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".pdf";
    }

    private void setField(Object obj, String fieldName, Object value) {
        try {
            Field field = obj.getClass().getDeclaredField(fieldName);
            field.setAccessible(true);
            field.set(obj, value);
        } catch (NoSuchFieldException | IllegalAccessException e) {
            // Ignore
        }
    }
}


