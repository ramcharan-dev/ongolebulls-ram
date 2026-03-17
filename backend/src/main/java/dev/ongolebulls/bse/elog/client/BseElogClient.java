package dev.ongolebulls.bse.elog.client;

import dev.ongolebulls.bse.elog.dto.ElogResult;
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
public class BseElogClient {

    private final WebClient webClient;

    @Value("${bse.elog.api-path:/BSEMFWEBAPI/api/_2FAELOGController/_2FAELOG/w}")
    private String elogApiPath;

    public BseElogClient(@Qualifier("bseWebClient") WebClient webClient) {
        this.webClient = webClient;
    }

    public ElogResult callElogApi(Map<String, String> payload) {
        try {
            log.info("Calling BSE ELOG API at path={}", elogApiPath);

            String responseBody = webClient.post()
                    .uri(elogApiPath)
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
                                    log.warn("Retrying BSE ELOG API call, attempt {}",
                                            signal.totalRetries() + 1)))
                    .block(Duration.ofSeconds(60));

            log.info("BSE ELOG API call completed successfully");

            return ElogResult.builder()
                    .success(true)
                    .httpStatus(200)
                    .rawResponse(responseBody)
                    .build();

        } catch (WebClientResponseException e) {
            log.error("BSE ELOG API HTTP error: status={}, body={}",
                    e.getStatusCode(), e.getResponseBodyAsString());
            return ElogResult.builder()
                    .success(false)
                    .httpStatus(e.getStatusCode().value())
                    .rawResponse(e.getResponseBodyAsString())
                    .errorDesc("HTTP " + e.getStatusCode() + ": " + e.getMessage())
                    .build();

        } catch (Exception e) {
            log.error("BSE ELOG API call failed", e);
            return ElogResult.builder()
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
