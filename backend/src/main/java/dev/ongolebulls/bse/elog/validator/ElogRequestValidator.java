package dev.ongolebulls.bse.elog.validator;

import dev.ongolebulls.bse.elog.dto.ElogRequest;
import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.repository.UccRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class ElogRequestValidator {

    private final UccRegistrationRepository uccRegistrationRepository;

    public void validate(ElogRequest request) {
        if (request.investorId() == null) {
            throw new IllegalArgumentException("Investor ID is required");
        }

        UccRegistration ucc = uccRegistrationRepository.findByUserId(request.investorId())
                .orElseThrow(() -> new IllegalArgumentException(
                        "UCC registration not found for investor ID: " + request.investorId()));

        if (!"SUCCESS".equals(ucc.getStatus())) {
            throw new IllegalStateException(
                    "UCC registration not completed. Current status: " + ucc.getStatus());
        }

        if (ucc.getClientCode() == null || ucc.getClientCode().isBlank()) {
            throw new IllegalStateException(
                    "Client code is missing from UCC registration");
        }

        log.info("ELOG validation passed for investorId={}, clientCode={}",
                request.investorId(), ucc.getClientCode());
    }
}
