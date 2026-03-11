package dev.ongolebulls.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.model.UccRegistration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class BseStarMfService {

    private final ObjectMapper objectMapper;

    @Value("${bse.starmf.api.url:https://www.bsestarmf.in/RptWebService/WebService.asmx}")
    private String bseApiUrl;

    @Value("${bse.starmf.member.id:}")
    private String memberId;

    @Value("${bse.starmf.user.id:}")
    private String bseUserId;

    @Value("${bse.starmf.password:}")
    private String bsePassword;

    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Calls exchange UCC Creation API.
     * Returns a map with keys: success (boolean), response (String), errorMessage (String)
     */
    public Map<String, Object> createUcc(UccRegistration registration) {
        Map<String, Object> result = new HashMap<>();

        try {
            // Build the exchange UCC request payload
            Map<String, Object> payload = buildUccPayload(registration);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

            log.info("Calling exchange UCC API for userId={}", registration.getUserId());

            ResponseEntity<String> response = restTemplate.exchange(
                    bseApiUrl + "/UCC",
                    HttpMethod.POST,
                    entity,
                    String.class
            );

            String body = response.getBody();
            log.info("Exchange response for userId={}: status={}", registration.getUserId(), response.getStatusCode());

            if (response.getStatusCode().is2xxSuccessful() && body != null) {
                // Parse BSE response — check for success indicators
                if (body.contains("SUCCESS") || body.contains("100")) {
                    result.put("success", true);
                    result.put("response", body);
                } else {
                    result.put("success", false);
                    result.put("response", body);
                    result.put("errorMessage", "BSE returned non-success response: " + body);
                }
            } else {
                result.put("success", false);
                result.put("response", body);
                result.put("errorMessage", "BSE API returned HTTP " + response.getStatusCode());
            }

        } catch (Exception e) {
            log.error("Exchange API call failed for userId={}", registration.getUserId(), e);
            result.put("success", false);
            result.put("errorMessage", "API call failed: " + e.getMessage());
        }

        return result;
    }

    private Map<String, Object> buildUccPayload(UccRegistration reg) {
        Map<String, Object> payload = new HashMap<>();

        payload.put("MemberCode", memberId);
        payload.put("UserId", bseUserId);
        payload.put("Password", bsePassword);

        // Map each step's JSON data into the BSE payload format
        addIfPresent(payload, "ClientDetails", reg.getClientDetailsJson());
        addIfPresent(payload, "JointHolder", reg.getJointHolderJson());
        addIfPresent(payload, "Guardian", reg.getGuardianJson());
        addIfPresent(payload, "PANDetails", reg.getPanDetailsJson());
        addIfPresent(payload, "ClientType", reg.getClientTypeJson());
        addIfPresent(payload, "BankDetails", reg.getBankDetailsJson());
        addIfPresent(payload, "Address", reg.getAddressJson());
        addIfPresent(payload, "Contact", reg.getContactJson());
        addIfPresent(payload, "Communication", reg.getCommunicationJson());
        addIfPresent(payload, "NRIDetails", reg.getNriDetailsJson());
        addIfPresent(payload, "KYC", reg.getKycJson());
        addIfPresent(payload, "Aadhaar", reg.getAadhaarJson());
        addIfPresent(payload, "Declaration", reg.getDeclarationJson());
        addIfPresent(payload, "Nomination", reg.getNominationJson());
        addIfPresent(payload, "NomineeDetails", reg.getNomineeDetailsJson());

        return payload;
    }

    private void addIfPresent(Map<String, Object> payload, String key, String json) {
        if (json != null && !json.isBlank()) {
            try {
                payload.put(key, objectMapper.readValue(json, Object.class));
            } catch (Exception e) {
                payload.put(key, json);
            }
        }
    }
}
