package dev.ongolebulls.bse.nominee.client;

import dev.ongolebulls.bse.nominee.dto.NomineeResult;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.net.ConnectException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.TimeoutException;

@Component
@Slf4j
public class BseNomineeClient {

    private final WebClient webClient;

    @Value("${bse.nominee.reg-api-path:/BSEMFWEBAPI/api/NomineeRegistration/w}")
    private String regApiPath;

    public BseNomineeClient(@Qualifier("bseWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public NomineeResult callNomineeApi(Map<String, String> payload) {
        try {
            log.info("Calling BSE Nominee Registration API at path={}", regApiPath);

            String responseBody = webClient.post()
                    .uri(regApiPath)
                    .bodyValue(payload)
                    .retrieve()
                    .onStatus(HttpStatusCode::is5xxServerError,
                            resp -> Mono.error(new RuntimeException(
                                    "BSE server error: " + resp.statusCode())))
                    .bodyToMono(String.class)
                    .retryWhen(Retry.backoff(3, Duration.ofSeconds(1))
                            .maxBackoff(Duration.ofSeconds(5))
                            .filter(this::isRetryable)
                            .doBeforeRetry(signal ->
                                    log.warn("Retrying BSE Nominee Registration API, attempt {}",
                                            signal.totalRetries() + 1)))
                    .block(Duration.ofSeconds(60));

            log.info("BSE Nominee Registration API call completed successfully");

            return NomineeResult.builder()
                    .success(true)
                    .httpStatus(200)
                    .rawResponse(responseBody)
                    .build();

        } catch (WebClientResponseException e) {
            log.error("BSE Nominee Registration API HTTP error: status={}, body={}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            return NomineeResult.builder()
                    .success(false)
                    .httpStatus(e.getStatusCode().value())
                    .rawResponse(e.getResponseBodyAsString())
                    .errorDesc("HTTP " + e.getStatusCode() + ": " + e.getMessage())
                    .build();

        } catch (Exception e) {
            log.error("BSE Nominee Registration API call failed", e);
            return NomineeResult.builder()
                    .success(false)
                    .httpStatus(0)
                    .errorDesc("API call failed: " + e.getMessage())
                    .build();
        }
    }

    private boolean isRetryable(Throwable t) {
        return t instanceof ConnectException
                || t instanceof TimeoutException
                || (t.getMessage() != null && t.getMessage().contains("BSE server error"));
    }
}