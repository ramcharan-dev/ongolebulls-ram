package dev.ongolebulls.bse.ucc.validator;

import dev.ongolebulls.bse.common.BseConstants;
import dev.ongolebulls.bse.common.exception.BseValidationException;
import dev.ongolebulls.bse.ucc.domain.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Component
@Slf4j
public class UccRequestValidator {

    private static final Pattern PAN_PATTERN = Pattern.compile("^[A-Z]{5}[0-9]{4}[A-Z]$");
    private static final Pattern IFSC_PATTERN = Pattern.compile("^[A-Z]{4}0[A-Z0-9]{6}$");
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$");
    private static final Pattern MOBILE_PATTERN = Pattern.compile("^[6-9]\\d{9}$");

    public void validate(UccData data, Long investorId) {
        List<String> errors = new ArrayList<>();

        validateClientDetails(data.getClientDetails(), errors);
        validatePanInfo(data.getPanInfo(), errors);
        validateBankDetails(data.getBankDetails(), errors);
        validateAddressDetails(data.getAddressDetails(), errors);
        validateContactDetails(data.getContactDetails(), errors);
        validateCommunicationDetails(data.getCommunicationDetails(), errors);
        validateGuardianRules(data.getClientDetails(), data.getGuardianDetails(), errors);
        validateNriRules(data.getClientTypeDetails(), data.getNriDetails(), errors);
        validateNomineeRules(data.getNominationDetails(), data.getNomineeInfo(), errors);

        if (!errors.isEmpty()) {
            log.warn("UCC validation failed for investorId={}: {}", investorId, errors);
            throw new BseValidationException(BseConstants.API_UCC_REGISTRATION, investorId, errors);
        }
    }

    private void validateClientDetails(ClientDetails details, List<String> errors) {
        if (details == null) {
            errors.add("Client details are required");
            return;
        }
        if (isBlank(details.getFirstName())) {
            errors.add("First name is required");
        }
        if (isBlank(details.getTaxStatus())) {
            errors.add("Tax status is required");
        }
        if (isBlank(details.getHoldingNature())) {
            errors.add("Holding nature is required");
        }
    }

    private void validatePanInfo(PanInfo info, List<String> errors) {
        if (info == null) {
            errors.add("PAN details are required");
            return;
        }
        if (isBlank(info.getPan())) {
            // PAN is required unless exempt
            if (isBlank(info.getPanExempt()) || !"Y".equalsIgnoreCase(info.getPanExempt())) {
                errors.add("PAN number is required");
            }
        } else if (!PAN_PATTERN.matcher(info.getPan()).matches()) {
            errors.add("Invalid PAN format. Expected: ABCDE1234F");
        }
    }

    private void validateBankDetails(UccBankDetails details, List<String> errors) {
        if (details == null) {
            errors.add("Bank details are required");
            return;
        }
        if (isBlank(details.getAccountNumber())) {
            errors.add("Bank account number is required");
        }
        if (isBlank(details.getIfscCode())) {
            errors.add("IFSC code is required");
        } else if (!IFSC_PATTERN.matcher(details.getIfscCode()).matches()) {
            errors.add("Invalid IFSC format. Expected: ABCD0123456");
        }
        if (isBlank(details.getAccountType())) {
            errors.add("Bank account type is required");
        }
    }

    private void validateAddressDetails(AddressDetails details, List<String> errors) {
        if (details == null) {
            errors.add("Address details are required");
            return;
        }
        if (isBlank(details.getAddress1())) {
            errors.add("Address line 1 is required");
        }
        if (isBlank(details.getCity())) {
            errors.add("City is required");
        }
        if (isBlank(details.getState())) {
            errors.add("State is required");
        }
        if (isBlank(details.getPincode())) {
            errors.add("Pincode is required");
        }
    }

    private void validateContactDetails(ContactDetails details, List<String> errors) {
        if (details == null) {
            errors.add("Contact details are required");
            return;
        }
        if (isBlank(details.getEmail())) {
            errors.add("Email is required");
        } else if (!EMAIL_PATTERN.matcher(details.getEmail()).matches()) {
            errors.add("Invalid email format");
        }
        if (isBlank(details.getMobile())) {
            errors.add("Mobile number is required");
        } else if (!MOBILE_PATTERN.matcher(details.getMobile()).matches()) {
            errors.add("Invalid mobile number. Expected 10-digit Indian mobile number");
        }
    }

    private void validateCommunicationDetails(CommunicationDetails details, List<String> errors) {
        if (details == null) {
            errors.add("Communication details are required");
            return;
        }
        if (isBlank(details.getCommunicationMode())) {
            errors.add("Communication mode is required");
        }
    }

    private void validateGuardianRules(ClientDetails clientDetails, GuardianDetails guardianDetails, List<String> errors) {
        if (clientDetails == null || isBlank(clientDetails.getDob())) return;

        if (isMinor(clientDetails.getDob())) {
            if (guardianDetails == null || isBlank(guardianDetails.getGuardianFirstName())) {
                errors.add("Guardian details are required for minor investors");
            }
            if (guardianDetails != null && !isBlank(guardianDetails.getGuardianPan())
                    && !PAN_PATTERN.matcher(guardianDetails.getGuardianPan()).matches()) {
                errors.add("Invalid guardian PAN format");
            }
        }
    }

    private void validateNriRules(ClientTypeDetails clientType, NriDetails nriDetails, List<String> errors) {
        if (clientType == null) return;

        boolean isNri = "NRI".equalsIgnoreCase(clientType.getTaxStatus())
                || "NRI".equalsIgnoreCase(clientType.getClientType());

        if (isNri) {
            if (nriDetails == null || isBlank(nriDetails.getNriAddress1())) {
                errors.add("NRI overseas address is required for NRI investors");
            }
            if (nriDetails != null && isBlank(nriDetails.getNriCountry())) {
                errors.add("NRI country is required for NRI investors");
            }
        }
    }

    private void validateNomineeRules(NominationDetails nomination, NomineeInfo nomineeInfo, List<String> errors) {
        if (nomination == null) return;

        if ("Y".equalsIgnoreCase(nomination.getNominationOpted())) {
            if (nomineeInfo == null || nomineeInfo.getNominees() == null || nomineeInfo.getNominees().isEmpty()) {
                errors.add("At least one nominee is required when nomination is opted");
                return;
            }

            int totalPercentage = 0;
            for (NomineeInfo.Nominee nominee : nomineeInfo.getNominees()) {
                if (isBlank(nominee.getName())) {
                    errors.add("Nominee name is required");
                }
                if (isBlank(nominee.getRelation())) {
                    errors.add("Nominee relation is required");
                }
                if (!isBlank(nominee.getPercentage())) {
                    try {
                        totalPercentage += Integer.parseInt(nominee.getPercentage().trim());
                    } catch (NumberFormatException e) {
                        errors.add("Invalid nominee percentage: " + nominee.getPercentage());
                    }
                }
            }

            if (totalPercentage != 100) {
                errors.add("Total nominee percentage must equal 100, got " + totalPercentage);
            }
        }
    }

    private boolean isMinor(String dobStr) {
        try {
            LocalDate dob = LocalDate.parse(dobStr, DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            return dob.plusYears(18).isAfter(LocalDate.now());
        } catch (DateTimeParseException e) {
            try {
                LocalDate dob = LocalDate.parse(dobStr);
                return dob.plusYears(18).isAfter(LocalDate.now());
            } catch (DateTimeParseException ex) {
                return false;
            }
        }
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}
