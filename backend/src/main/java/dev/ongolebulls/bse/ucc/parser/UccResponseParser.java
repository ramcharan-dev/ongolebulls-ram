package dev.ongolebulls.bse.ucc.parser;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.bse.common.BseConstants;
import dev.ongolebulls.bse.common.parser.BseResponseParser;
import dev.ongolebulls.bse.ucc.dto.BseUccResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class UccResponseParser implements BseResponseParser<BseUccResponse> {

    private final ObjectMapper objectMapper;

    @Override
    public BseUccResponse parse(String rawResponse, int httpStatus) {
        BseUccResponse.BseUccResponseBuilder builder = BseUccResponse.builder()
                .httpStatus(httpStatus)
                .rawResponse(rawResponse);

        if (rawResponse == null || rawResponse.isBlank()) {
            return builder
                    .statusCode("-1")
                    .statusMessage("Empty response from BSE")
                    .build();
        }

        try {
            // Try JSON parsing first
            if (rawResponse.trim().startsWith("{")) {
                return parseJsonResponse(rawResponse, httpStatus);
            }

            // Try pipe-delimited parsing
            if (rawResponse.contains("|")) {
                return parsePipeResponse(rawResponse, httpStatus);
            }

            // Fallback: check for success indicators in plain text
            return builder
                    .statusCode(isSuccess(rawResponse) ? BseConstants.BSE_SUCCESS_CODE : "-1")
                    .statusMessage(rawResponse)
                    .build();

        } catch (Exception e) {
            log.error("Failed to parse BSE UCC response: {}", rawResponse, e);
            return builder
                    .statusCode("-1")
                    .statusMessage("Failed to parse response: " + e.getMessage())
                    .build();
        }
    }

    @Override
    public boolean isSuccess(String rawResponse) {
        if (rawResponse == null) return false;
        return rawResponse.contains(BseConstants.BSE_SUCCESS_CODE)
                || rawResponse.toUpperCase().contains("SUCCESS");
    }

    private BseUccResponse parseJsonResponse(String json, int httpStatus) {
        try {
            JsonNode root = objectMapper.readTree(json);

            String statusCode = extractJsonField(root, "Status", "StatusCode", "status_code");
            String statusMessage = extractJsonField(root, "StatusMessage", "Message", "message");
            String clientCode = extractJsonField(root, "ClientCode", "clientCode", "client_code");
            String remarks = extractJsonField(root, "Remarks", "remarks");

            return BseUccResponse.builder()
                    .httpStatus(httpStatus)
                    .statusCode(statusCode)
                    .statusMessage(statusMessage)
                    .clientCode(clientCode)
                    .remarks(remarks)
                    .rawResponse(json)
                    .build();

        } catch (Exception e) {
            log.warn("JSON parsing failed, treating as plain text: {}", e.getMessage());
            return BseUccResponse.builder()
                    .httpStatus(httpStatus)
                    .statusCode("-1")
                    .statusMessage("JSON parse error: " + e.getMessage())
                    .rawResponse(json)
                    .build();
        }
    }

    private BseUccResponse parsePipeResponse(String response, int httpStatus) {
        String[] parts = response.split("\\|");

        String statusCode = parts.length > 0 ? parts[0].trim() : "-1";
        String statusMessage = parts.length > 1 ? parts[1].trim() : "";
        String clientCode = null;
        String remarks = parts.length > 2 ? parts[2].trim() : "";

        // Extract client code if present in the response
        for (String part : parts) {
            String trimmed = part.trim();
            // Client codes typically follow a pattern like alphanumeric 8-10 chars
            if (trimmed.length() >= 8 && trimmed.length() <= 10 && trimmed.matches("[A-Z0-9]+")) {
                clientCode = trimmed;
                break;
            }
        }

        return BseUccResponse.builder()
                .httpStatus(httpStatus)
                .statusCode(statusCode)
                .statusMessage(statusMessage)
                .clientCode(clientCode)
                .remarks(remarks)
                .rawResponse(response)
                .build();
    }

    private String extractJsonField(JsonNode root, String... fieldNames) {
        for (String name : fieldNames) {
            JsonNode node = root.get(name);
            if (node != null && !node.isNull()) {
                return node.asText();
            }
        }
        return null;
    }
}
