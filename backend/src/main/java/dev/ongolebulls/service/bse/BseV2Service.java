package dev.ongolebulls.service.bse;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.model.BseRequest;
import dev.ongolebulls.model.BseRequestStatus;
import dev.ongolebulls.model.BseResponse;
import dev.ongolebulls.repository.BseRequestRepository;
import dev.ongolebulls.repository.BseResponseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BseV2Service {

    private final BseRequestRepository requestRepository;
    private final BseResponseRepository responseRepository;
    private final BseV2HttpClient httpClient;
    private final BseTokenManager tokenManager;
    private final ObjectMapper objectMapper;

    /* ─── LOGIN ─────────────────────────────────────────────────────────────── */
    public String initiateLogin(Long triggeredBy) {
        String txId = generateTxId("LOGIN");

        Map<String, Object> payload = Map.of(
            "data", Map.of("action", "login")
        );

        savePendingRequest(txId, "LOGIN", "/login_api",
            payload, "SYSTEM", null, triggeredBy);

        httpClient.callBseApi(txId, "LOGIN", "/login_api", payload);
        return txId;
    }

    /* ─── SCHEME LIST ───────────────────────────────────────────────────────── */
    public String fetchSchemeList(int start, int length, String search, Long requestedBy) {
        String txId = generateTxId("SCHEME_LIST");

        Map<String, Object> data = new HashMap<>();
        data.put("fields", List.of("ALL"));
        data.put("count_only", false);
        data.put("start", start);
        data.put("length", length);
        if (search != null && !search.isBlank()) {
            data.put("search", Map.of("value", search));
        }

        Map<String, Object> payload = Map.of("data", data);

        savePendingRequest(txId, "SCHEME_LIST", "/scheme_list",
            payload, "SYSTEM", null, requestedBy);

        httpClient.callBseApi(txId, "SCHEME_LIST", "/scheme_list", payload);
        return txId;
    }

    /* ─── NAV MASTER LIST ───────────────────────────────────────────────────── */
    public String fetchNavList(int start, int length, String schemeCode, Long requestedBy) {
        String txId = generateTxId("NAV_LIST");

        Map<String, Object> data = new HashMap<>();
        data.put("fields", List.of("ALL"));
        data.put("start", start);
        data.put("length", length);
        if (schemeCode != null) {
            data.put("filter_param", List.of(Map.of("scheme_code", schemeCode)));
        }

        Map<String, Object> payload = Map.of("data", data);

        savePendingRequest(txId, "NAV_LIST", "/nav_master_list",
            payload, "SYSTEM", null, requestedBy);

        httpClient.callBseApi(txId, "NAV_LIST", "/nav_master_list", payload);
        return txId;
    }

    /* ─── STATUS POLL ───────────────────────────────────────────────────────── */
    public Map<String, Object> getStatus(String txId) {
        BseRequest req = requestRepository.findByTransactionId(txId)
            .orElseThrow(() -> new RuntimeException("Transaction not found: " + txId));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("transactionId", txId);
        result.put("status", req.getStatus().name());
        result.put("apiName", req.getApiName());
        result.put("endpoint", req.getEndpoint());
        result.put("createdAt", req.getCreatedAt());
        result.put("completedAt", req.getCompletedAt());

        if (req.getStatus() == BseRequestStatus.SUCCESS) {
            responseRepository.findByTransactionId(txId).ifPresent(resp -> {
                result.put("bseStatus", resp.getBseStatus());
                result.put("bseMessage", resp.getBseMessage());
                result.put("httpStatus", resp.getHttpStatus());
                try {
                    result.put("data", objectMapper.readTree(resp.getDecryptedResponse()));
                } catch (Exception e) {
                    result.put("data", resp.getDecryptedResponse());
                }
            });
        } else if (req.getStatus() == BseRequestStatus.FAILED) {
            result.put("errorMessage", req.getErrorMessage());
        }

        return result;
    }

    /* ─── RECENT TRANSACTIONS ───────────────────────────────────────────────── */
    public List<Map<String, Object>> getRecentTransactions(int limit) {
        return requestRepository.findTop50ByOrderByCreatedAtDesc()
            .stream()
            .limit(limit)
            .map(req -> {
                Map<String, Object> m = new LinkedHashMap<>();
                m.put("transactionId", req.getTransactionId());
                m.put("apiName", req.getApiName());
                m.put("status", req.getStatus().name());
                m.put("endpoint", req.getEndpoint());
                m.put("createdAt", req.getCreatedAt());
                m.put("completedAt", req.getCompletedAt());
                m.put("errorMessage", req.getErrorMessage());
                responseRepository.findByTransactionId(req.getTransactionId())
                    .ifPresent(r -> {
                        m.put("bseStatus", r.getBseStatus());
                        m.put("httpStatus", r.getHttpStatus());
                    });
                return m;
            })
            .collect(Collectors.toList());
    }

    /* ─── HELPERS ───────────────────────────────────────────────────────────── */
    private String generateTxId(String prefix) {
        return prefix + "_" + System.currentTimeMillis()
            + "_" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    private void savePendingRequest(String txId, String apiName, String endpoint,
            Object payload, String entityType, Long entityId, Long initiatedBy) {
        try {
            BseRequest req = BseRequest.builder()
                .transactionId(txId)
                .apiName(apiName)
                .endpoint(endpoint)
                .requestPayload(objectMapper.writeValueAsString(payload))
                .status(BseRequestStatus.PENDING)
                .entityType(entityType)
                .entityId(entityId)
                .initiatedBy(initiatedBy)
                .build();
            requestRepository.save(req);
        } catch (Exception e) {
            throw new RuntimeException("Failed to save BSE request: " + e.getMessage());
        }
    }
}
