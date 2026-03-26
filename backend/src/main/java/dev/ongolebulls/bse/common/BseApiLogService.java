package dev.ongolebulls.bse.common;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.bse.common.model.BseApiLog;
import dev.ongolebulls.bse.common.repository.BseApiLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
@Slf4j
public class BseApiLogService {

    private final BseApiLogRepository repository;
    private final ObjectMapper objectMapper;

    // Patterns for sensitive data masking
    private static final Pattern PAN_PATTERN = Pattern.compile("[A-Z]{5}[0-9]{4}[A-Z]");
    private static final Pattern AADHAAR_PATTERN = Pattern.compile("\\d{12}");
    private static final Pattern ACCOUNT_PATTERN = Pattern.compile("\\d{9,18}");

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
                    .maskedRequestPayload(maskSensitiveFields(toJson(requestPayload)))
                    .responsePayload(responsePayload)
                    .build();

            repository.save(entry);
            log.debug("BSE API log saved: api={}, investorId={}, status={}", apiName, investorId, bseStatus);
        } catch (Exception e) {
            log.error("Failed to save BSE API log for api={}, investorId={}", apiName, investorId, e);
        }
    }

    public String maskSensitiveFields(String payload) {
        if (payload == null || payload.isBlank()) {
            return payload;
        }

        String masked = payload;

        try {
            // Try JSON-aware masking first
            if (masked.trim().startsWith("{")) {
                masked = maskJsonPayload(masked);
            } else {
                // Pipe-separated or plain text — use regex masking
                masked = maskWithPatterns(masked);
            }
        } catch (Exception e) {
            log.warn("Failed JSON-aware masking, falling back to regex masking", e);
            masked = maskWithPatterns(masked);
        }

        return masked;
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

    @SuppressWarnings("unchecked")
    private String maskJsonPayload(String json) {
        try {
            Map<String, Object> map = objectMapper.readValue(json, Map.class);
            maskMapRecursive(map);
            return objectMapper.writeValueAsString(map);
        } catch (Exception e) {
            return maskWithPatterns(json);
        }
    }

    @SuppressWarnings("unchecked")
    private void maskMapRecursive(Map<String, Object> map) {
        for (Map.Entry<String, Object> entry : map.entrySet()) {
            if (BseConstants.SENSITIVE_FIELDS.contains(entry.getKey())) {
                entry.setValue(BseConstants.MASKED_VALUE);
            } else if (entry.getValue() instanceof Map) {
                maskMapRecursive((Map<String, Object>) entry.getValue());
            }
        }
    }

    private String maskWithPatterns(String text) {
        String masked = PAN_PATTERN.matcher(text).replaceAll(BseConstants.MASKED_VALUE);
        masked = AADHAAR_PATTERN.matcher(masked).replaceAll(BseConstants.MASKED_VALUE);
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
