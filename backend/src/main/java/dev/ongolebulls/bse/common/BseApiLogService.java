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
                    Integer httpStatus, String bseStatus, String bseRemarks,
                    String rawRequest, String rawResponse) {
        try {
            BseApiLog entry = BseApiLog.builder()
                    .apiName(apiName)
                    .investorId(investorId)
                    .clientCode(clientCode)
                    .httpStatus(httpStatus)
                    .bseStatus(bseStatus)
                    .bseRemarks(bseRemarks)
                    .maskedRequestPayload(maskSensitiveFields(rawRequest))
                    .responsePayload(rawResponse)
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
}
