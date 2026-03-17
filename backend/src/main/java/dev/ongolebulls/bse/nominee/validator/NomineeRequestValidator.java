package dev.ongolebulls.bse.nominee.validator;

import dev.ongolebulls.bse.elog.model.InvestorElog;
import dev.ongolebulls.bse.elog.repository.InvestorElogRepository;
import dev.ongolebulls.bse.nominee.dto.NomineeRequest;
import dev.ongolebulls.model.UccRegistration;
import dev.ongolebulls.repository.UccRegistrationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.Period;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Component
@RequiredArgsConstructor
@Slf4j
public class NomineeRequestValidator {

    private final UccRegistrationRepository uccRegistrationRepository;
    private final InvestorElogRepository investorElogRepository;

    public void validate(NomineeRequest request) {
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

        InvestorElog elog = investorElogRepository
                .findByInvestorIdAndStatus(request.investorId(), "SUCCESS")
                .orElseThrow(() -> new IllegalStateException(
                        "ELOG verification not completed for investor"));

        if (!"SUCCESS".equals(elog.getCallbackStatus())) {
            throw new IllegalStateException(
                    "ELOG callback verification not completed. Current: " + elog.getCallbackStatus());
        }

        validateNomineeFields(request);

        log.info("Nominee validation passed for investorId={}, clientCode={}",
                request.investorId(), ucc.getClientCode());
    }

    private void validateNomineeFields(NomineeRequest request) {
        if (request.nomineeName() == null || request.nomineeName().isBlank()) {
            throw new IllegalArgumentException("Nominee name is required");
        }
        if (request.nomineeRelation() == null || request.nomineeRelation().isBlank()) {
            throw new IllegalArgumentException("Nominee relationship is required");
        }
        if (request.nomineePercentage() < 1 || request.nomineePercentage() > 100) {
            throw new IllegalArgumentException("Nominee percentage must be between 1 and 100");
        }
        if (request.nomineeDob() == null || request.nomineeDob().isBlank()) {
            throw new IllegalArgumentException("Nominee date of birth is required");
        }

        int totalPercentage = request.nomineePercentage();
        if (request.nominee2Percentage() != null) {
            totalPercentage += request.nominee2Percentage();
        }
        if (request.nominee3Percentage() != null) {
            totalPercentage += request.nominee3Percentage();
        }
        if (totalPercentage > 100) {
            throw new IllegalArgumentException(
                    "Total nominee percentage must not exceed 100. Current: " + totalPercentage);
        }

        validateMinorGuardian(request.nomineeDob(), request.nomineeMinorFlag(),
                request.guardianName(), request.guardianPan(), "Nominee 1");

        if (request.nominee2Name() != null && !request.nominee2Name().isBlank()) {
            if (request.nominee2Relation() == null || request.nominee2Relation().isBlank()) {
                throw new IllegalArgumentException("Nominee 2 relationship is required");
            }
            if (request.nominee2Percentage() == null || request.nominee2Percentage() < 1) {
                throw new IllegalArgumentException("Nominee 2 percentage must be at least 1");
            }
            if (request.nominee2Dob() == null || request.nominee2Dob().isBlank()) {
                throw new IllegalArgumentException("Nominee 2 date of birth is required");
            }
            validateMinorGuardian(request.nominee2Dob(), request.nominee2MinorFlag(),
                    request.guardian2Name(), request.guardian2Pan(), "Nominee 2");
        }

        if (request.nominee3Name() != null && !request.nominee3Name().isBlank()) {
            if (request.nominee3Relation() == null || request.nominee3Relation().isBlank()) {
                throw new IllegalArgumentException("Nominee 3 relationship is required");
            }
            if (request.nominee3Percentage() == null || request.nominee3Percentage() < 1) {
                throw new IllegalArgumentException("Nominee 3 percentage must be at least 1");
            }
            if (request.nominee3Dob() == null || request.nominee3Dob().isBlank()) {
                throw new IllegalArgumentException("Nominee 3 date of birth is required");
            }
            validateMinorGuardian(request.nominee3Dob(), request.nominee3MinorFlag(),
                    request.guardian3Name(), request.guardian3Pan(), "Nominee 3");
        }
    }

    private void validateMinorGuardian(String dob, String minorFlag,
                                       String guardianName, String guardianPan,
                                       String label) {
        boolean isMinor = "Y".equalsIgnoreCase(minorFlag) || isUnder18(dob);
        if (isMinor) {
            if (guardianName == null || guardianName.isBlank()) {
                throw new IllegalArgumentException(
                        "Guardian name is required for minor " + label);
            }
            if (guardianPan == null || guardianPan.isBlank()) {
                throw new IllegalArgumentException(
                        "Guardian PAN is required for minor " + label);
            }
        }
    }

    private boolean isUnder18(String dob) {
        try {
            LocalDate birthDate = LocalDate.parse(dob, DateTimeFormatter.ISO_LOCAL_DATE);
            return Period.between(birthDate, LocalDate.now()).getYears() < 18;
        } catch (DateTimeParseException e) {
            return false;
        }
    }
}