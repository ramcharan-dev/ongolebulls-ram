package dev.ongolebulls.bse.elog.mapping;

import dev.ongolebulls.bse.elog.dto.ElogResponse;
import dev.ongolebulls.bse.elog.dto.ElogResult;
import dev.ongolebulls.bse.elog.model.InvestorElog;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
public class ElogFieldMapper {

    public ElogResult mapToResult(Map<String, String> parsedResponse,
                                  int httpStatus, String rawResponse) {
        String statusCode = parsedResponse.getOrDefault("statuscode", "");
        String authUrl = parsedResponse.getOrDefault("authurl", "");
        String errorDesc = parsedResponse.getOrDefault("errordesc", "");
        String intRefNo = parsedResponse.getOrDefault("intrefno", "");

        boolean isSuccess = "100".equals(statusCode);

        return ElogResult.builder()
                .success(isSuccess)
                .httpStatus(httpStatus)
                .bseStatusCode(statusCode)
                .authUrl(isSuccess ? authUrl : null)
                .errorDesc(isSuccess ? null : errorDesc)
                .intRefNo(intRefNo)
                .rawResponse(rawResponse)
                .build();
    }

    public ElogResponse mapToResponse(InvestorElog entity) {
        return new ElogResponse(
                entity.getId(),
                entity.getClientCode(),
                entity.getIntRefNo(),
                entity.getElogUrl(),
                entity.getStatus(),
                "SUCCESS".equals(entity.getStatus())
                        ? "ELOG generated successfully. Redirect to authenticate."
                        : entity.getBseMessage()
        );
    }
}
