package dev.ongolebulls.bse.ucc.mapping;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.ongolebulls.bse.ucc.domain.*;
import dev.ongolebulls.model.UccRegistration;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * Maps the raw JSON step data stored in UccRegistration
 * into the typed UccData domain model.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class UccDataMapper {

    private final ObjectMapper objectMapper;

    public UccData map(UccRegistration registration) {
        return UccData.builder()
                .clientDetails(deserialize(registration.getClientDetailsJson(), ClientDetails.class))
                .jointHolderDetails(deserialize(registration.getJointHolderJson(), JointHolderDetails.class))
                .guardianDetails(deserialize(registration.getGuardianJson(), GuardianDetails.class))
                .panInfo(deserialize(registration.getPanDetailsJson(), PanInfo.class))
                .clientTypeDetails(deserialize(registration.getClientTypeJson(), ClientTypeDetails.class))
                .bankDetails(deserialize(registration.getBankDetailsJson(), UccBankDetails.class))
                .addressDetails(deserialize(registration.getAddressJson(), AddressDetails.class))
                .contactDetails(deserialize(registration.getContactJson(), ContactDetails.class))
                .communicationDetails(deserialize(registration.getCommunicationJson(), CommunicationDetails.class))
                .nriDetails(deserialize(registration.getNriDetailsJson(), NriDetails.class))
                .kycDetails(deserialize(registration.getKycJson(), UccKycDetails.class))
                .aadhaarDetails(deserialize(registration.getAadhaarJson(), AadhaarDetails.class))
                .declarationDetails(deserialize(registration.getDeclarationJson(), DeclarationDetails.class))
                .nominationDetails(deserialize(registration.getNominationJson(), NominationDetails.class))
                .nomineeInfo(deserialize(registration.getNomineeDetailsJson(), NomineeInfo.class))
                .build();
    }

    private <T> T deserialize(String json, Class<T> type) {
        if (json == null || json.isBlank() || "null".equals(json.trim()) || "{}".equals(json.trim())) {
            return null;
        }
        try {
            return objectMapper.readValue(json, type);
        } catch (Exception e) {
            log.warn("Failed to deserialize JSON to {}: {}", type.getSimpleName(), e.getMessage());
            return null;
        }
    }
}
