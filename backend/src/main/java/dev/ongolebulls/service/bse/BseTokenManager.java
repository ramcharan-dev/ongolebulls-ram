package dev.ongolebulls.service.bse;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.model.BseToken;
import dev.ongolebulls.repository.BseTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class BseTokenManager {

    private final BseTokenRepository tokenRepository;
    private final ObjectMapper objectMapper;

    @Value("${bse.starmf.v2.base-url}")
    private String baseUrl;

    @Value("${bse.starmf.v2.username:}")
    private String username;

    @Value("${bse.starmf.v2.password:}")
    private String password;

    @Value("${bse.starmf.v2.member-code:}")
    private String memberCode;

    @Value("${bse.starmf.v2.fingerprint:}")
    private String fingerprint;

    @Value("${bse.starmf.v2.token-refresh-minutes:55}")
    private int tokenRefreshMinutes;

    @Value("${bse.starmf.v2.mock-mode:true}")
    private boolean mockMode;

    private final RestTemplate restTemplate = new RestTemplate();

    public String getValidToken() {
        if (mockMode) {
            log.debug("[BSE MOCK] Returning mock token");
            return "MOCK_BSE_TOKEN";
        }

        Optional<BseToken> latest = tokenRepository
            .findTopByIsActiveTrueOrderByObtainedAtDesc();

        if (latest.isPresent()) {
            BseToken token = latest.get();
            if (LocalDateTime.now().isBefore(token.getExpiresAt())) {
                return token.getAccessToken();
            }
            token.setIsActive(false);
            tokenRepository.save(token);
        }

        return fetchNewToken();
    }

    public String fetchNewToken() {
        if (mockMode) {
            log.info("[BSE MOCK] Simulating login — no real BSE call made");

            // Deactivate old mock tokens
            tokenRepository.findTopByIsActiveTrueOrderByObtainedAtDesc()
                .ifPresent(t -> {
                    t.setIsActive(false);
                    tokenRepository.save(t);
                });

            BseToken mockToken = BseToken.builder()
                .accessToken("MOCK_TOKEN_" + System.currentTimeMillis())
                .obtainedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(tokenRefreshMinutes))
                .isActive(true)
                .build();
            tokenRepository.save(mockToken);
            log.info("[BSE MOCK] Mock token stored in DB");
            return mockToken.getAccessToken();
        }

        try {
            // Build login payload — plain JSON, no JOSE encryption
            Map<String, Object> data = new HashMap<>();
            data.put("username", username);
            data.put("password", password);
            Map<String, Object> payload = new HashMap<>();
            payload.put("data", data);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("X-API-Org-ID", "member/" + memberCode + ":" + fingerprint);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

            log.info("[BSE] Calling login API: {}/login_api", baseUrl);
            ResponseEntity<String> response = restTemplate.postForEntity(
                baseUrl + "/login_api", request, String.class);

            String body = response.getBody();
            log.info("[BSE] Login response received. HTTP {}", response.getStatusCode());

            // Parse: { "data": { "access_token": "..." }, "messages": [] }
            JsonNode root = objectMapper.readTree(body);
            String accessToken = root.path("data").path("access_token").asText(null);

            if (accessToken == null || accessToken.isBlank()) {
                log.error("[BSE] Login failed — no access_token in response: {}", body);
                throw new RuntimeException("BSE login failed: no access_token in response");
            }

            // Deactivate old tokens
            tokenRepository.findTopByIsActiveTrueOrderByObtainedAtDesc()
                .ifPresent(t -> {
                    t.setIsActive(false);
                    tokenRepository.save(t);
                });

            // Save new token
            BseToken bseToken = BseToken.builder()
                .accessToken(accessToken)
                .obtainedAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusMinutes(tokenRefreshMinutes))
                .isActive(true)
                .build();
            tokenRepository.save(bseToken);

            log.info("[BSE] Token obtained and stored. Expires in {} minutes", tokenRefreshMinutes);
            return accessToken;

        } catch (Exception e) {
            log.error("[BSE] Login failed: {}", e.getMessage(), e);
            throw new RuntimeException("BSE authentication failed: " + e.getMessage());
        }
    }

    @Scheduled(fixedRate = 3_000_000) // every 50 minutes
    public void scheduledRefresh() {
        if (mockMode) {
            log.debug("[BSE MOCK] Skipping scheduled token refresh in mock mode");
            return;
        }
        log.info("[BSE] Scheduled token refresh starting...");
        try {
            fetchNewToken();
            log.info("[BSE] Scheduled token refresh complete");
        } catch (Exception e) {
            log.error("[BSE] Scheduled refresh failed: {}", e.getMessage());
        }
    }
}
