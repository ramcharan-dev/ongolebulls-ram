package dev.ongolebulls.bse.elog.service;

import dev.ongolebulls.bse.common.BseApiLogService;
import dev.ongolebulls.bse.common.BseResponseParser;
import dev.ongolebulls.bse.elog.client.BseElogClient;
import dev.ongolebulls.bse.elog.dto.ElogRequest;
import dev.ongolebulls.bse.elog.dto.ElogResponse;
import dev.ongolebulls.bse.elog.dto.ElogResult;
import dev.ongolebulls.bse.elog.mapping.ElogFieldMapper;
import dev.ongolebulls.bse.elog.mapping.ElogParamBuilder;
import dev.ongolebulls.bse.elog.model.InvestorElog;
import dev.ongolebulls.bse.elog.repository.InvestorElogRepository;
import dev.ongolebulls.bse.elog.validator.ElogRequestValidator;
import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.repository.UccRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ElogService {

    private final ElogRequestValidator validator;
    private final ElogParamBuilder paramBuilder;
    private final BseElogClient bseElogClient;
    private final ElogFieldMapper fieldMapper;
    private final BseResponseParser responseParser;
    private final BseApiLogService apiLogService;
    private final InvestorElogRepository elogRepository;
    private final UccRegistrationRepository uccRepository;

    @Transactional
    public ElogResponse generateElog(ElogRequest request) {

        // Step 1: Validate preconditions
        validator.validate(request);

        // Step 2: Resolve client code
        String clientCode = resolveClientCode(request);

        // Step 3: Generate internal reference number
        String intRefNo = paramBuilder.generateIntRefNo();

        // Step 4: Create PENDING entity
        InvestorElog elog = InvestorElog.builder()
                .investorId(request.investorId())
                .clientCode(clientCode)
                .intRefNo(intRefNo)
                .status("PENDING")
                .build();
        elog = elogRepository.save(elog);

        // Step 5: Build BSE request payload
        Map<String, String> payload = paramBuilder.build(
                clientCode, "FH",
                request.documentType(), intRefNo,
                request.loopbackUrl());

        // Step 6: Call BSE ELOG API
        ElogResult rawResult = bseElogClient.callElogApi(payload);

        // Step 7: Parse BSE response
        ElogResult result;
        if (rawResult.rawResponse() != null) {
            Map<String, String> parsedFields = responseParser.parse(rawResult.rawResponse());
            result = fieldMapper.mapToResult(parsedFields, rawResult.httpStatus(), rawResult.rawResponse());
        } else {
            result = rawResult;
        }

        // Step 8: Log API call with masked payload
        apiLogService.log("ELOG", request.investorId(), clientCode,
                result.httpStatus(),
                result.bseStatusCode(),
                result.errorDesc(),
                payload,
                result.rawResponse());

        // Step 9: Update entity based on result
        if (result.success()) {
            elog.setStatus("SUCCESS");
            elog.setElogUrl(result.authUrl());
            elog.setBseStatus(result.bseStatusCode());
            elog.setBseMessage(null);
        } else {
            elog.setStatus("FAILED");
            elog.setBseStatus(result.bseStatusCode());
            elog.setBseMessage(result.errorDesc());
        }
        elog = elogRepository.save(elog);

        // Step 10: Map to response DTO
        log.info("ELOG generation {} for investorId={}, intRefNo={}",
                elog.getStatus(), request.investorId(), intRefNo);

        return fieldMapper.mapToResponse(elog);
    }

    private String resolveClientCode(ElogRequest request) {
        if (request.clientCode() != null && !request.clientCode().isBlank()) {
            return request.clientCode();
        }
        return uccRepository.findByUserId(request.investorId())
                .map(UccRegistration::getClientCode)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Client code not found for investor"));
    }
}
