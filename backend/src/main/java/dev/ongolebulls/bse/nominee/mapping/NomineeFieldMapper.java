package dev.ongolebulls.bse.nominee.mapping;

import dev.ongolebulls.bse.nominee.dto.NomineeResponse;
import dev.ongolebulls.bse.nominee.dto.NomineeResult;
import dev.ongolebulls.bse.nominee.model.InvestorNomineeRegistration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class NomineeFieldMapper {

    public NomineeResult mapToResult(Map<String, String> parsedResponse,
                                     int httpStatus, String rawResponse) {
        String statusCode = parsedResponse.getOrDefault("statuscode", "");
        String errorDesc = parsedResponse.getOrDefault("errordesc",
                parsedResponse.getOrDefault("message", ""));

        boolean isSuccess = "100".equals(statusCode);

        return NomineeResult.builder()
                .success(isSuccess)
                .httpStatus(httpStatus)
                .bseStatusCode(statusCode)
                .errorDesc(isSuccess ? null : errorDesc)
                .rawResponse(rawResponse)
                .build();
    }

    public NomineeResponse mapToResponse(InvestorNomineeRegistration entity) {
        return new NomineeResponse(
                entity.getId(),
                entity.getClientCode(),
                entity.getStatus(),
                "SUCCESS".equals(entity.getStatus())
                        ? "Nominee registered successfully"
                        : entity.getBseMessage()
        );
    }
}