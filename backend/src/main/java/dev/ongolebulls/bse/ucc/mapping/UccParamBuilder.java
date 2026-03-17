package dev.ongolebulls.bse.ucc.mapping;

import dev.ongolebulls.bse.common.BseConstants;
import dev.ongolebulls.bse.ucc.domain.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.util.List;

/**
 * Builds the pipe-separated Param string (183 fields) from a typed UccData object.
 * Works exclusively with typed domain models — no raw JSON parsing.
 */
@Component
@Slf4j
public class UccParamBuilder {

    public String buildParam(UccData data) {
        String[] fields = new String[BseConstants.UCC_PARAM_FIELD_COUNT];

        // Initialize all fields to empty string
        for (int i = 0; i < fields.length; i++) {
            fields[i] = "";
        }

        mapClientDetails(fields, data.getClientDetails());
        mapJointHolderDetails(fields, data.getJointHolderDetails());
        mapGuardianDetails(fields, data.getGuardianDetails());
        mapPanInfo(fields, data.getPanInfo());
        mapClientTypeDetails(fields, data.getClientTypeDetails());
        mapBankDetails(fields, data.getBankDetails());
        mapAddressDetails(fields, data.getAddressDetails());
        mapContactDetails(fields, data.getContactDetails());
        mapCommunicationDetails(fields, data.getCommunicationDetails());
        mapNriDetails(fields, data.getNriDetails());
        mapKycDetails(fields, data.getKycDetails());
        mapAadhaarDetails(fields, data.getAadhaarDetails());
        mapDeclarationDetails(fields, data.getDeclarationDetails());
        mapNominationDetails(fields, data.getNominationDetails());
        mapNomineeInfo(fields, data.getNomineeInfo());

        String param = String.join("|", fields);

        // Validate field count
        long fieldCount = param.chars().filter(c -> c == '|').count() + 1;
        if (fieldCount != BseConstants.UCC_PARAM_FIELD_COUNT) {
            log.error("Param field count mismatch: expected={}, actual={}", BseConstants.UCC_PARAM_FIELD_COUNT, fieldCount);
            throw new IllegalStateException("UCC Param must have exactly " + BseConstants.UCC_PARAM_FIELD_COUNT + " fields, got " + fieldCount);
        }

        return param;
    }

    private void mapClientDetails(String[] fields, ClientDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.CLIENT_CODE] = safe(details.getClientCode());
        fields[UccFieldMapper.FIRST_NAME] = safe(details.getFirstName());
        fields[UccFieldMapper.MIDDLE_NAME] = safe(details.getMiddleName());
        fields[UccFieldMapper.LAST_NAME] = safe(details.getLastName());
        fields[UccFieldMapper.TAX_STATUS] = safe(details.getTaxStatus());
        fields[UccFieldMapper.GENDER] = safe(details.getGender());
        fields[UccFieldMapper.DOB] = safe(details.getDob());
        fields[UccFieldMapper.OCCUPATION_CODE] = safe(details.getOccupationCode());
        fields[UccFieldMapper.HOLDING_NATURE] = safe(details.getHoldingNature());
    }

    private void mapJointHolderDetails(String[] fields, JointHolderDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.SECOND_HOLDER_FIRST_NAME] = safe(details.getSecondHolderFirstName());
        fields[UccFieldMapper.SECOND_HOLDER_MIDDLE_NAME] = safe(details.getSecondHolderMiddleName());
        fields[UccFieldMapper.SECOND_HOLDER_LAST_NAME] = safe(details.getSecondHolderLastName());
        fields[UccFieldMapper.SECOND_HOLDER_PAN] = safe(details.getSecondHolderPan());
        fields[UccFieldMapper.SECOND_HOLDER_DOB] = safe(details.getSecondHolderDob());
        fields[UccFieldMapper.THIRD_HOLDER_FIRST_NAME] = safe(details.getThirdHolderFirstName());
        fields[UccFieldMapper.THIRD_HOLDER_MIDDLE_NAME] = safe(details.getThirdHolderMiddleName());
        fields[UccFieldMapper.THIRD_HOLDER_LAST_NAME] = safe(details.getThirdHolderLastName());
        fields[UccFieldMapper.THIRD_HOLDER_PAN] = safe(details.getThirdHolderPan());
        fields[UccFieldMapper.THIRD_HOLDER_DOB] = safe(details.getThirdHolderDob());
    }

    private void mapGuardianDetails(String[] fields, GuardianDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.GUARDIAN_FIRST_NAME] = safe(details.getGuardianFirstName());
        fields[UccFieldMapper.GUARDIAN_MIDDLE_NAME] = safe(details.getGuardianMiddleName());
        fields[UccFieldMapper.GUARDIAN_LAST_NAME] = safe(details.getGuardianLastName());
        fields[UccFieldMapper.GUARDIAN_PAN] = safe(details.getGuardianPan());
        fields[UccFieldMapper.GUARDIAN_RELATION] = safe(details.getGuardianRelation());
        fields[UccFieldMapper.GUARDIAN_DOB] = safe(details.getGuardianDob());
    }

    private void mapPanInfo(String[] fields, PanInfo info) {
        if (info == null) return;
        fields[UccFieldMapper.PAN] = safe(info.getPan());
        fields[UccFieldMapper.PAN_EXEMPT] = safe(info.getPanExempt());
        fields[UccFieldMapper.PAN_EXEMPT_CATEGORY] = safe(info.getPanExemptCategory());
    }

    private void mapClientTypeDetails(String[] fields, ClientTypeDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.CLIENT_TYPE] = safe(details.getClientType());
        fields[UccFieldMapper.DIV_PAY_MODE] = safe(details.getDivPayMode());
    }

    private void mapBankDetails(String[] fields, UccBankDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.ACCOUNT_NUMBER] = safe(details.getAccountNumber());
        fields[UccFieldMapper.ACCOUNT_TYPE] = safe(details.getAccountType());
        fields[UccFieldMapper.IFSC_CODE] = safe(details.getIfscCode());
        fields[UccFieldMapper.MICR_CODE] = safe(details.getMicrCode());
        fields[UccFieldMapper.BANK_NAME] = safe(details.getBankName());
        fields[UccFieldMapper.BRANCH_NAME] = safe(details.getBranchName());
        fields[UccFieldMapper.BRANCH_ADDRESS] = safe(details.getBranchAddress());
        fields[UccFieldMapper.BRANCH_CITY] = safe(details.getBranchCity());
        fields[UccFieldMapper.BRANCH_PINCODE] = safe(details.getBranchPincode());
    }

    private void mapAddressDetails(String[] fields, AddressDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.ADDRESS_1] = safe(details.getAddress1());
        fields[UccFieldMapper.ADDRESS_2] = safe(details.getAddress2());
        fields[UccFieldMapper.ADDRESS_3] = safe(details.getAddress3());
        fields[UccFieldMapper.CITY] = safe(details.getCity());
        fields[UccFieldMapper.STATE] = safe(details.getState());
        fields[UccFieldMapper.PINCODE] = safe(details.getPincode());
        fields[UccFieldMapper.COUNTRY] = safe(details.getCountry());
    }

    private void mapContactDetails(String[] fields, ContactDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.EMAIL] = safe(details.getEmail());
        fields[UccFieldMapper.MOBILE] = safe(details.getMobile());
        fields[UccFieldMapper.PHONE] = safe(details.getPhone());
        fields[UccFieldMapper.FAX] = safe(details.getFax());
    }

    private void mapCommunicationDetails(String[] fields, CommunicationDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.COMMUNICATION_MODE] = safe(details.getCommunicationMode());
        fields[UccFieldMapper.EMAIL_FLAG] = safe(details.getEmailFlag());
        fields[UccFieldMapper.MOBILE_DECLARATION_FLAG] = safe(details.getMobileDeclarationFlag());
        fields[UccFieldMapper.EMAIL_DECLARATION_FLAG] = safe(details.getEmailDeclarationFlag());
    }

    private void mapNriDetails(String[] fields, NriDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.NRI_ADDRESS_1] = safe(details.getNriAddress1());
        fields[UccFieldMapper.NRI_ADDRESS_2] = safe(details.getNriAddress2());
        fields[UccFieldMapper.NRI_ADDRESS_3] = safe(details.getNriAddress3());
        fields[UccFieldMapper.NRI_CITY] = safe(details.getNriCity());
        fields[UccFieldMapper.NRI_STATE] = safe(details.getNriState());
        fields[UccFieldMapper.NRI_PINCODE] = safe(details.getNriPincode());
        fields[UccFieldMapper.NRI_COUNTRY] = safe(details.getNriCountry());
    }

    private void mapKycDetails(String[] fields, UccKycDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.CKYC_NUMBER] = safe(details.getCkycNumber());
        fields[UccFieldMapper.KYC_VERIFIED] = safe(details.getKycVerified());
        fields[UccFieldMapper.KYC_TYPE] = safe(details.getKycType());
    }

    private void mapAadhaarDetails(String[] fields, AadhaarDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.AADHAAR_UPDATED] = safe(details.getAadhaarUpdated());
    }

    private void mapDeclarationDetails(String[] fields, DeclarationDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.PEP_FLAG] = safe(details.getPepFlag());
        fields[UccFieldMapper.FOREIGN_TAX_FLAG] = safe(details.getForeignTaxFlag());
        fields[UccFieldMapper.SOURCE_OF_WEALTH] = safe(details.getSourceOfWealth());
        fields[UccFieldMapper.GROSS_ANNUAL_INCOME] = safe(details.getGrossAnnualIncome());
        fields[UccFieldMapper.NET_WORTH] = safe(details.getNetWorth());
        fields[UccFieldMapper.NET_WORTH_DATE] = safe(details.getNetWorthDate());
    }

    private void mapNominationDetails(String[] fields, NominationDetails details) {
        if (details == null) return;
        fields[UccFieldMapper.NOMINATION_OPTED] = safe(details.getNominationOpted());
        fields[UccFieldMapper.NOMINATION_AUTH_MODE] = safe(details.getNominationAuthMode());
    }

    private void mapNomineeInfo(String[] fields, NomineeInfo info) {
        if (info == null || info.getNominees() == null) return;

        List<NomineeInfo.Nominee> nominees = info.getNominees();

        if (nominees.size() >= 1) {
            mapSingleNominee(fields, nominees.get(0),
                    UccFieldMapper.NOMINEE_1_NAME, UccFieldMapper.NOMINEE_1_RELATION,
                    UccFieldMapper.NOMINEE_1_PERCENTAGE, UccFieldMapper.NOMINEE_1_DOB,
                    UccFieldMapper.NOMINEE_1_ADDRESS, UccFieldMapper.NOMINEE_1_CITY,
                    UccFieldMapper.NOMINEE_1_STATE, UccFieldMapper.NOMINEE_1_PINCODE,
                    UccFieldMapper.NOMINEE_1_GUARDIAN_NAME, UccFieldMapper.NOMINEE_1_GUARDIAN_PAN);
        }

        if (nominees.size() >= 2) {
            mapSingleNominee(fields, nominees.get(1),
                    UccFieldMapper.NOMINEE_2_NAME, UccFieldMapper.NOMINEE_2_RELATION,
                    UccFieldMapper.NOMINEE_2_PERCENTAGE, UccFieldMapper.NOMINEE_2_DOB,
                    UccFieldMapper.NOMINEE_2_ADDRESS, UccFieldMapper.NOMINEE_2_CITY,
                    UccFieldMapper.NOMINEE_2_STATE, UccFieldMapper.NOMINEE_2_PINCODE,
                    UccFieldMapper.NOMINEE_2_GUARDIAN_NAME, UccFieldMapper.NOMINEE_2_GUARDIAN_PAN);
        }

        if (nominees.size() >= 3) {
            mapSingleNominee(fields, nominees.get(2),
                    UccFieldMapper.NOMINEE_3_NAME, UccFieldMapper.NOMINEE_3_RELATION,
                    UccFieldMapper.NOMINEE_3_PERCENTAGE, UccFieldMapper.NOMINEE_3_DOB,
                    UccFieldMapper.NOMINEE_3_ADDRESS, UccFieldMapper.NOMINEE_3_CITY,
                    UccFieldMapper.NOMINEE_3_STATE, UccFieldMapper.NOMINEE_3_PINCODE,
                    UccFieldMapper.NOMINEE_3_GUARDIAN_NAME, UccFieldMapper.NOMINEE_3_GUARDIAN_PAN);
        }
    }

    private void mapSingleNominee(String[] fields, NomineeInfo.Nominee nominee,
                                   int nameIdx, int relationIdx, int percentIdx, int dobIdx,
                                   int addressIdx, int cityIdx, int stateIdx, int pincodeIdx,
                                   int guardianNameIdx, int guardianPanIdx) {
        fields[nameIdx] = safe(nominee.getName());
        fields[relationIdx] = safe(nominee.getRelation());
        fields[percentIdx] = safe(nominee.getPercentage());
        fields[dobIdx] = safe(nominee.getDob());
        fields[addressIdx] = safe(nominee.getAddress());
        fields[cityIdx] = safe(nominee.getCity());
        fields[stateIdx] = safe(nominee.getState());
        fields[pincodeIdx] = safe(nominee.getPincode());
        fields[guardianNameIdx] = safe(nominee.getGuardianName());
        fields[guardianPanIdx] = safe(nominee.getGuardianPan());
    }

    private String safe(String value) {
        return value == null ? "" : value.trim();
    }
}
