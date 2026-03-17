package dev.ongolebulls.bse.ucc.client;

import dev.ongolebulls.bse.common.BseConstants;
import dev.ongolebulls.bse.common.exception.BseApiException;
import dev.ongolebulls.bse.common.exception.BseTimeoutException;
import dev.ongolebulls.bse.ucc.dto.BseUccRequest;
import dev.ongolebulls.bse.ucc.dto.BseUccResponse;
import dev.ongolebulls.bse.ucc.parser.UccResponseParser;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeoutException;

@Component
@Slf4j
public class BseUccClient {

    private final WebClient webClient;
    private final UccResponseParser responseParser;

    public BseUccClient(WebClient.Builder bseWebClientBuilder,
                        UccResponseParser responseParser,
                        @Value("${bse.starmf.base-url:https://www.bsestarmf.in}") String baseUrl) {
        this.webClient = bseWebClientBuilder
                .baseUrl(baseUrl)
                .build();
        this.responseParser = responseParser;
    }

    @Value("${bse.starmf.ucc-api-path:/BSEMFWEBAPI/UCCAPI/UCCRegistrationV183}")
    private String uccApiPath;

    public BseUccResponse registerUcc(BseUccRequest request) {
        log.info("Calling BSE UCC API: path={}", uccApiPath);

        try {
            Map<String, String> payload = Map.of(
                    "UserId", request.getUserId(),
                    "MemberCode", request.getMemberCode(),
                    "Password", request.getPassword(),
                    "RegnType", request.getRegnType(),
                    "Param", request.getParam()
            );

            String rawResponse = webClient.post()
                    .uri(uccApiPath)
                    .bodyValue(payload)
                    .retrieve()
                    .onStatus(HttpStatusCode::is4xxClientError, response ->
                            response.bodyToMono(String.class)
                                    .map(body -> new BseApiException(
                                            BseConstants.API_UCC_REGISTRATION, null,
                                            String.valueOf(response.statusCode().value()),
                                            "BSE returned client error: " + body)))
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                            .maxBackoff(Duration.ofSeconds(5))
                            .filter(this::isRetryable)
                            .doBeforeRetry(signal ->
                                    log.warn("Retrying BSE UCC API call, attempt={}, error={}",
                                            signal.totalRetries() + 1, signal.failure().getMessage())))
                    .block();

            BseUccResponse response = responseParser.parse(rawResponse, 200);
            log.info("BSE UCC API response: statusCode={}, clientCode={}",
                    response.getStatusCode(), response.getClientCode());
            return response;

        } catch (WebClientResponseException e) {
            log.error("BSE UCC API HTTP error: status={}, body={}", e.getStatusCode(), e.getResponseBodyAsString());
            return responseParser.parse(e.getResponseBodyAsString(), e.getStatusCode().value());

        } catch (Exception e) {
            if (isTimeoutCause(e)) {
                throw new BseTimeoutException(BseConstants.API_UCC_REGISTRATION, null,
                        "BSE UCC API request timed out", e);
            }
            throw new BseApiException(BseConstants.API_UCC_REGISTRATION, null, e);
        }
    }

    private boolean isRetryable(Throwable throwable) {
        // Retry on network errors, timeouts, and 5xx
        if (throwable instanceof WebClientRequestException) return true;
        if (throwable instanceof TimeoutException) return true;
        if (throwable instanceof WebClientResponseException ex) {
            return ex.getStatusCode().is5xxServerError();
        }
        // Check nested causes
        if (throwable.getCause() instanceof TimeoutException) return true;
        return false;
    }

    private boolean isTimeoutCause(Throwable throwable) {
        if (throwable instanceof TimeoutException) return true;
        if (throwable.getCause() instanceof TimeoutException) return true;
        if (throwable.getMessage() != null && throwable.getMessage().toLowerCase().contains("timeout")) return true;
        return false;
    }
}
