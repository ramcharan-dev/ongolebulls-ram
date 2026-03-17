package dev.ongolebulls.bse.common;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class BseResponseParser {

    private final ObjectMapper objectMapper;

    /**
     * Parses raw BSE JSON response into a Map with lowercase keys.
     */
    public Map<String, String> parse(String responseBody) {
        if (responseBody == null || responseBody.isBlank()) {
            log.warn("BSE response body is null or empty");
            return Collections.emptyMap();
        }

        try {
            Map<String, Object> raw = objectMapper.readValue(
                    responseBody, new TypeReference<>() {});

            Map<String, String> result = new HashMap<>();
            for (Map.Entry<String, Object> entry : raw.entrySet()) {
                String key = entry.getKey().toLowerCase();
                String value = entry.getValue() != null ? entry.getValue().toString() : "";
                result.put(key, value);
            }
            return result;
        } catch (Exception e) {
            log.error("Failed to parse BSE response: {}", responseBody, e);
            return Collections.emptyMap();
        }
    }

    /**
     * Checks if BSE response indicates success (statuscode = "100").
     */
    public boolean isSuccess(Map<String, String> parsed) {
        return "100".equals(parsed.get("statuscode"));
    }
}
