package dev.ongolebulls.service.bse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.model.BseRequest;
import dev.ongolebulls.model.BseRequestStatus;
import dev.ongolebulls.model.BseResponse;
import dev.ongolebulls.repository.BseRequestRepository;
import dev.ongolebulls.repository.BseResponseRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.concurrent.CompletableFuture;

@Service
@Slf4j
@RequiredArgsConstructor
public class BseV2HttpClient {

    private final BseJoseService joseService;
    private final BseTokenManager tokenManager;
    private final BseRequestRepository requestRepository;
    private final BseResponseRepository responseRepository;
    private final ObjectMapper objectMapper;

    @Value("${bse.starmf.v2.base-url}")
    private String baseUrl;

    @Value("${bse.starmf.v2.member-code:}")
    private String memberCode;

    @Value("${bse.starmf.v2.fingerprint:}")
    private String fingerprint;

    @Value("${bse.starmf.v2.mock-mode:true}")
    private boolean mockMode;

    private final RestTemplate restTemplate = new RestTemplate();

    @Async("bseTaskExecutor")
    public CompletableFuture<String> callBseApi(
            String transactionId,
            String apiName,
            String endpoint,
            Object requestBody) {

        BseRequest bseRequest = requestRepository
            .findByTransactionId(transactionId)
            .orElseThrow(() -> new RuntimeException("BSE request not found: " + transactionId));

        try {
            bseRequest.setStatus(BseRequestStatus.IN_PROGRESS);
            requestRepository.save(bseRequest);

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            if (mockMode) {
                log.info("[BSE MOCK] Simulating {} call to {}. Transaction: {}",
                    apiName, endpoint, transactionId);

                String mockResponse = buildMockResponse(apiName, jsonPayload);

                saveResponse(transactionId, apiName, 200, "MOCK_ENCRYPTED",
                    mockResponse, "SUCCESS", "Mock response");

                bseRequest.setStatus(BseRequestStatus.SUCCESS);
                bseRequest.setCompletedAt(LocalDateTime.now());
                requestRepository.save(bseRequest);

                log.info("[BSE MOCK] {} completed. Transaction: {}", apiName, transactionId);
                return CompletableFuture.completedFuture(mockResponse);
            }

            // Real mode: encrypt and call BSE
            String encryptedPayload = joseService.encrypt(jsonPayload);
            bseRequest.setEncryptedPayload(encryptedPayload);
            requestRepository.save(bseRequest);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.parseMediaType("application/jose"));
            headers.set("X-API-Org-ID", "member/" + memberCode + ":" + fingerprint);
            headers.set("Authorization", "Bearer " + tokenManager.getValidToken());

            HttpEntity<String> httpRequest = new HttpEntity<>(encryptedPayload, headers);

            log.info("[BSE] Calling {} → {}", apiName, endpoint);
            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + endpoint, httpRequest, String.class);

            String encryptedResponse = response.getBody();
            int httpStatus = response.getStatusCode().value();

            String decryptedResponse = joseService.decrypt(encryptedResponse);

            JsonNode root = objectMapper.readTree(decryptedResponse);
            String bseStatus = root.path("status").asText("SUCCESS");
            String bseMessage = root.path("messages").toString();

            saveResponse(transactionId, apiName, httpStatus,
                encryptedResponse, decryptedResponse, bseStatus, bseMessage);

            bseRequest.setStatus(BseRequestStatus.SUCCESS);
            bseRequest.setCompletedAt(LocalDateTime.now());
            requestRepository.save(bseRequest);

            log.info("[BSE] {} SUCCESS. Transaction: {}", apiName, transactionId);
            return CompletableFuture.completedFuture(decryptedResponse);

        } catch (Exception e) {
            log.error("[BSE] {} FAILED. Transaction: {}. Error: {}",
                apiName, transactionId, e.getMessage(), e);

            saveResponse(transactionId, apiName, 500, null, null, "FAILED", e.getMessage());

            bseRequest.setStatus(BseRequestStatus.FAILED);
            bseRequest.setErrorMessage(e.getMessage());
            bseRequest.setCompletedAt(LocalDateTime.now());
            requestRepository.save(bseRequest);

            return CompletableFuture.failedFuture(e);
        }
    }

    private void saveResponse(String transactionId, String apiName,
            int httpStatus, String encryptedResponse,
            String decryptedResponse, String bseStatus, String bseMessage) {
        BseResponse resp = BseResponse.builder()
            .transactionId(transactionId)
            .apiName(apiName)
            .httpStatus(httpStatus)
            .encryptedResponse(encryptedResponse)
            .decryptedResponse(decryptedResponse)
            .bseStatus(bseStatus)
            .bseMessage(bseMessage)
            .build();
        responseRepository.save(resp);
    }

    private String buildMockResponse(String apiName, String request) {
        return switch (apiName) {
            case "LOGIN" -> """
                {"data":{"access_token":"MOCK_TOKEN_123"},"messages":[]}""";
            case "SCHEME_LIST" -> """
                {"data":{"records":[\
                {"scheme_code":"BSE001","scheme_name":"Mock Equity Fund",\
                "amc_name":"Mock AMC","scheme_category":"Equity",\
                "scheme_plan":"Growth","scheme_option":"Direct"}\
                ],"total_count":1},"messages":[]}""";
            case "NAV_LIST" -> """
                {"data":{"records":[\
                {"scheme_code":"BSE001","nav":"125.50","nav_date":"2026-04-04"}\
                ],"total_count":1},"messages":[]}""";
            default -> """
                {"data":{},"messages":["Mock response"]}""";
        };
    }
}
