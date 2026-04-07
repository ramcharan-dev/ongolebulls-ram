package dev.ongolebulls.bse.ucc.service;

import dev.ongolebulls.bse.common.BseApiLogService;
import dev.ongolebulls.bse.common.BseConstants;
import dev.ongolebulls.bse.ucc.client.BseUccClient;
import dev.ongolebulls.bse.ucc.domain.UccData;
import dev.ongolebulls.bse.ucc.dto.BseUccRequest;
import dev.ongolebulls.bse.ucc.dto.BseUccResponse;
import dev.ongolebulls.bse.ucc.dto.UccGenerationResult;
import dev.ongolebulls.bse.ucc.mapping.UccDataMapper;
import dev.ongolebulls.bse.ucc.mapping.UccParamBuilder;
import dev.ongolebulls.bse.ucc.model.InvestorUcc;
import dev.ongolebulls.bse.ucc.repository.InvestorUccRepository;
import dev.ongolebulls.bse.ucc.validator.UccRequestValidator;
import dev.ongolebulls.model.InvestorAccount;
import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.model.User;
import dev.ongolebulls.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
@Slf4j
public class UccService {

    private final UccDataMapper dataMapper;
    private final UccRequestValidator validator;
    private final UccParamBuilder paramBuilder;
    private final BseUccClient bseUccClient;
    private final InvestorUccRepository investorUccRepository;
    private final BseApiLogService apiLogService;
    private final UserRepository userRepository;

    @Value("${bse.starmf.user.id:}")
    private String bseUserId;

    @Value("${bse.starmf.member.id:}")
    private String bseMemberId;

    @Value("${bse.starmf.password:}")
    private String bsePassword;

    @Transactional
    public UccGenerationResult generateUcc(UccRegistration registration) {
        Long userId = registration.getUserId();
        log.info("Starting UCC generation for userId={}", userId);

        // Step 1: Map JSON steps to typed domain model
        UccData uccData = dataMapper.map(registration);

        // Step 2: Validate
        validator.validate(uccData, userId);

        // Step 3: Build pipe-separated param string
        String param = paramBuilder.buildParam(uccData);

        // Step 4: Build BSE request
        BseUccRequest request = BseUccRequest.builder()
                .userId(bseUserId)
                .memberCode(bseMemberId)
                .password(bsePassword)
                .regnType(BseConstants.REGN_TYPE_NEW)
                .param(param)
                .build();

        // Step 5: Resolve InvestorAccount for the user
        InvestorAccount investor = resolveInvestorAccount(userId);

        // Step 6: Update InvestorUcc request timestamp
        InvestorUcc investorUcc = getOrCreateInvestorUcc(investor);
        investorUcc.setLastRequestTime(Instant.now());
        investorUcc.setAttemptCount(investorUcc.getAttemptCount() + 1);

        // Step 7: Call BSE API
        BseUccResponse response = bseUccClient.registerUcc(request);

        // Step 8: Update InvestorUcc with response
        investorUcc.setLastResponseTime(Instant.now());

        boolean success = BseConstants.BSE_SUCCESS_CODE.equals(response.getStatusCode());

        if (success) {
            investorUcc.setStatus(BseConstants.STATUS_SUCCESS);
            investorUcc.setUccCode(response.getClientCode());
            investorUcc.setLastError(null);
            investorUcc.setRemarks(response.getRemarks());
        } else {
            investorUcc.setStatus(BseConstants.STATUS_FAILED);
            investorUcc.setLastError(response.getStatusMessage());
            investorUcc.setRemarks(response.getRemarks());
        }

        investorUccRepository.save(investorUcc);

        // Step 9: Log to BSE API logs (with masking)
        apiLogService.log(
                BseConstants.API_UCC_REGISTRATION,
                investor.getId(),
                response.getClientCode(),
                response.getHttpStatus(),
                response.getStatusCode(),
                response.getRemarks(),
                param,
                response.getRawResponse()
        );

        log.info("UCC generation completed for userId={}: success={}, clientCode={}",
                userId, success, response.getClientCode());

        return UccGenerationResult.builder()
                .success(success)
                .clientCode(response.getClientCode())
                .errorMessage(success ? null : response.getStatusMessage())
                .bseStatusCode(response.getStatusCode())
                .bseRemarks(response.getRemarks())
                .build();
    }

    private InvestorAccount resolveInvestorAccount(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        InvestorAccount investor = user.getInvestorAccount();
        if (investor == null) {
            throw new IllegalStateException("No InvestorAccount linked to userId=" + userId);
        }
        return investor;
    }

    private InvestorUcc getOrCreateInvestorUcc(InvestorAccount investor) {
        return investorUccRepository.findByInvestorId(investor.getId())
                .orElseGet(() -> InvestorUcc.builder()
                        .investor(investor)
                        .status(BseConstants.STATUS_PENDING)
                        .regnType(BseConstants.REGN_TYPE_NEW)
                        .attemptCount(0)
                        .build());
    }
}
