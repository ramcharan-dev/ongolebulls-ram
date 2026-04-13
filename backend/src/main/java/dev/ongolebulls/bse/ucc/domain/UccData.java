package dev.ongolebulls.bse.ucc.domain;

import lombok.Builder;
import lombok.Data;

/**
 * Aggregate typed domain model representing all UCC registration data.
 * Mapped from the 15 JSON step fields stored in UccRegistration.
 * Used by UccRequestValidator and UccParamBuilder.
 */
@Data
@Builder
public class UccData {
    private ClientDetails clientDetails;
    private JointHolderDetails jointHolderDetails;
    private GuardianDetails guardianDetails;
    private PanInfo panInfo;
    private ClientTypeDetails clientTypeDetails;
    private UccBankDetails bankDetails;
    private AddressDetails addressDetails;
    private ContactDetails contactDetails;
    private CommunicationDetails communicationDetails;
    private NriDetails nriDetails;
    private UccKycDetails kycDetails;
    private AadhaarDetails aadhaarDetails;
    private DeclarationDetails declarationDetails;
    private NominationDetails nominationDetails;
    private NomineeInfo nomineeInfo;
}
