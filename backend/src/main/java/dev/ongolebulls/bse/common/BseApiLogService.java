package dev.ongolebulls.bse.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BseApiLogService {

    private final BseApiLogRepository repository;
    private final ObjectMapper objectMapper;

    public void log(String apiName, Long investorId, String clientCode,
                    int httpStatus, String bseStatus, String bseRemarks,
                    Object requestPayload, String responsePayload) {
        try {
            BseApiLog entry = BseApiLog.builder()
                    .apiName(apiName)
                    .investorId(investorId)
                    .clientCode(clientCode)
                    .httpStatus(httpStatus)
                    .bseStatus(bseStatus)
                    .bseRemarks(bseRemarks)
                    .maskedRequestPayload(maskSensitiveData(toJson(requestPayload)))
                    .responsePayload(responsePayload)
                    .build();
            repository.save(entry);
        } catch (Exception e) {
            log.error("Failed to save BSE API log for api={}, investorId={}", apiName, investorId, e);
        }
    }

    private String maskSensitiveData(String json) {
        if (json == null || json.isBlank()) return json;

        String masked = json;

        // Mask password field
        masked = masked.replaceAll(
                "(\"password\"\\s*:\\s*\")[^\"]*\"",
                "$1****\"");

        // Mask PAN: keep first 3 and last 3 characters
        masked = masked.replaceAll(
                "(\"pan[Nn]umber\"\\s*:\\s*\")([A-Z]{3})[A-Z]{2}[0-9]{2}([0-9]{2}[A-Z])\"",
                "$1$2****$3\"");

        // Mask Aadhaar: keep last 4 digits
        masked = masked.replaceAll(
                "(\"aadhaar[Nn]umber\"\\s*:\\s*\")\\d{8}(\\d{4})\"",
                "$1XXXX XXXX $2\"");

        // Mask bank account numbers: keep last 4 digits
        masked = masked.replaceAll(
                "(\"account[Nn]umber[^\"]*\"\\s*:\\s*\")\\d*(\\d{4})\"",
                "$1****$2\"");

        return masked;
    }

    private String toJson(Object obj) {
        if (obj == null) return null;
        if (obj instanceof String) return (String) obj;
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.warn("Failed to serialize request payload", e);
            return obj.toString();
        }
    }
}
