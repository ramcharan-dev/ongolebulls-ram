package dev.ongolebulls.bse.nominee.service;

import dev.ongolebulls.bse.common.BseApiLogService;
import dev.ongolebulls.bse.common.BseResponseParser;
import dev.ongolebulls.bse.nominee.client.BseNominationFlagClient;
import dev.ongolebulls.bse.nominee.client.BseNomineeClient;
import dev.ongolebulls.bse.nominee.dto.NomineeRequest;
import dev.ongolebulls.bse.nominee.dto.NomineeResponse;
import dev.ongolebulls.bse.nominee.dto.NomineeResult;
import dev.ongolebulls.bse.nominee.mapping.NomineeFieldMapper;
import dev.ongolebulls.bse.nominee.mapping.NomineeParamBuilder;
import dev.ongolebulls.bse.nominee.model.InvestorNomineeRegistration;
import dev.ongolebulls.bse.nominee.repository.InvestorNomineeRegistrationRepository;
import dev.ongolebulls.bse.nominee.validator.NomineeRequestValidator;
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
public class NomineeService {

    private final NomineeRequestValidator validator;
    private final NomineeParamBuilder paramBuilder;
    private final BseNominationFlagClient flagClient;
    private final BseNomineeClient nomineeClient;
    private final NomineeFieldMapper fieldMapper;
    private final BseResponseParser responseParser;
    private final BseApiLogService apiLogService;
    private final InvestorNomineeRegistrationRepository nomineeRepository;
    private final UccRegistrationRepository uccRepository;

    @Transactional
    public NomineeResponse registerNominee(NomineeRequest request) {

        // Step 1: Validate preconditions and nominee fields
        validator.validate(request);

        // Step 2: Resolve client code
        String clientCode = resolveClientCode(request);

        // Step 3: Save PENDING entity
        InvestorNomineeRegistration registration = InvestorNomineeRegistration.builder()
                .investorId(request.investorId())
                .clientCode(clientCode)
                .nomineeName(request.nomineeName())
                .relationship(request.nomineeRelation())
                .nomineePercentage(request.nomineePercentage())
                .nomineeDob(request.nomineeDob())
                .guardianName(request.guardianName())
                .guardianPan(request.guardianPan())
                .status("PENDING")
                .build();
        registration = nomineeRepository.save(registration);

        // Step 4: Call BSE Nomination Flag Change API
        Map<String, String> flagPayload = paramBuilder.buildFlagPayload(clientCode);
        NomineeResult flagRawResult = flagClient.callFlagApi(flagPayload);

        NomineeResult flagResult = parseResult(flagRawResult);

        apiLogService.log("NOMINEE_FLAG", request.investorId(), clientCode,
                flagResult.httpStatus(),
                flagResult.bseStatusCode(),
                flagResult.errorDesc(),
                flagPayload,
                flagResult.rawResponse());

        if (!flagResult.success()) {
            registration.setStatus("FAILED");
            registration.setBseStatus(flagResult.bseStatusCode());
            registration.setBseMessage("Flag change failed: " + flagResult.errorDesc());
            nomineeRepository.save(registration);

            log.error("Nomination flag change FAILED for investorId={}, error={}",
                    request.investorId(), flagResult.errorDesc());

            return fieldMapper.mapToResponse(registration);
        }

        log.info("Nomination flag change SUCCESS for investorId={}", request.investorId());

        // Step 5: Call BSE Nominee Registration API
        Map<String, String> regPayload = paramBuilder.buildRegistrationPayload(request, clientCode);
        NomineeResult regRawResult = nomineeClient.callNomineeApi(regPayload);

        NomineeResult regResult = parseResult(regRawResult);

        apiLogService.log("NOMINEE_REG", request.investorId(), clientCode,
                regResult.httpStatus(),
                regResult.bseStatusCode(),
                regResult.errorDesc(),
                regPayload,
                regResult.rawResponse());

        // Step 6: Update entity based on result
        if (regResult.success()) {
            registration.setStatus("SUCCESS");
            registration.setBseStatus(regResult.bseStatusCode());
            registration.setBseMessage(null);
        } else {
            registration.setStatus("FAILED");
            registration.setBseStatus(regResult.bseStatusCode());
            registration.setBseMessage(regResult.errorDesc());
        }
        registration = nomineeRepository.save(registration);

        log.info("Nominee registration {} for investorId={}", registration.getStatus(), request.investorId());

        // Step 7: Return response
        return fieldMapper.mapToResponse(registration);
    }

    private NomineeResult parseResult(NomineeResult rawResult) {
        if (rawResult.rawResponse() != null) {
            Map<String, String> parsed = responseParser.parse(rawResult.rawResponse());
            return fieldMapper.mapToResult(parsed, rawResult.httpStatus(), rawResult.rawResponse());
        }
        return rawResult;
    }

    private String resolveClientCode(NomineeRequest request) {
        if (request.clientCode() != null && !request.clientCode().isBlank()) {
            return request.clientCode();
        }
        return uccRepository.findByUserId(request.investorId())
                .map(UccRegistration::getClientCode)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Client code not found for investor"));
    }
}