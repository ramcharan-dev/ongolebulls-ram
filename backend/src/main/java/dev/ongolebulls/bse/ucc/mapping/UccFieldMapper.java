package dev.ongolebulls.bse.ucc.mapping;

/**
 * Positional field index constants for the BSE UCC V183 Param string.
 * Each constant maps a field name to its zero-based position in the
 * 183-element pipe-separated parameter array.
 *
 * Actual index values must be populated from the official BSE UCC V183 specification.
 * The placeholder values below follow the general BSE field ordering.
 */
public final class UccFieldMapper {

    private UccFieldMapper() {}

    // --- Client Details (Step 1) ---
    public static final int CLIENT_CODE = 0;
    public static final int FIRST_NAME = 1;
    public static final int MIDDLE_NAME = 2;
    public static final int LAST_NAME = 3;
    public static final int TAX_STATUS = 4;
    public static final int GENDER = 5;
    public static final int DOB = 6;
    public static final int OCCUPATION_CODE = 7;
    public static final int HOLDING_NATURE = 8;

    // --- Joint Holder (Step 2) ---
    public static final int SECOND_HOLDER_FIRST_NAME = 9;
    public static final int SECOND_HOLDER_MIDDLE_NAME = 10;
    public static final int SECOND_HOLDER_LAST_NAME = 11;
    public static final int SECOND_HOLDER_PAN = 12;
    public static final int SECOND_HOLDER_DOB = 13;
    public static final int THIRD_HOLDER_FIRST_NAME = 14;
    public static final int THIRD_HOLDER_MIDDLE_NAME = 15;
    public static final int THIRD_HOLDER_LAST_NAME = 16;
    public static final int THIRD_HOLDER_PAN = 17;
    public static final int THIRD_HOLDER_DOB = 18;

    // --- Guardian (Step 3) ---
    public static final int GUARDIAN_FIRST_NAME = 19;
    public static final int GUARDIAN_MIDDLE_NAME = 20;
    public static final int GUARDIAN_LAST_NAME = 21;
    public static final int GUARDIAN_PAN = 22;
    public static final int GUARDIAN_RELATION = 23;
    public static final int GUARDIAN_DOB = 24;

    // --- PAN Details (Step 4) ---
    public static final int PAN = 25;
    public static final int PAN_EXEMPT = 26;
    public static final int PAN_EXEMPT_CATEGORY = 27;

    // --- Client Type (Step 5) ---
    public static final int CLIENT_TYPE = 28;
    public static final int DIV_PAY_MODE = 29;

    // --- Bank Details (Step 6) ---
    public static final int ACCOUNT_NUMBER = 30;
    public static final int ACCOUNT_TYPE = 31;
    public static final int IFSC_CODE = 32;
    public static final int MICR_CODE = 33;
    public static final int BANK_NAME = 34;
    public static final int BRANCH_NAME = 35;
    public static final int BRANCH_ADDRESS = 36;
    public static final int BRANCH_CITY = 37;
    public static final int BRANCH_PINCODE = 38;

    // --- Address (Step 7) ---
    public static final int ADDRESS_1 = 39;
    public static final int ADDRESS_2 = 40;
    public static final int ADDRESS_3 = 41;
    public static final int CITY = 42;
    public static final int STATE = 43;
    public static final int PINCODE = 44;
    public static final int COUNTRY = 45;

    // --- Contact (Step 8) ---
    public static final int EMAIL = 46;
    public static final int MOBILE = 47;
    public static final int PHONE = 48;
    public static final int FAX = 49;

    // --- Communication (Step 9) ---
    public static final int COMMUNICATION_MODE = 50;
    public static final int EMAIL_FLAG = 51;
    public static final int MOBILE_DECLARATION_FLAG = 52;
    public static final int EMAIL_DECLARATION_FLAG = 53;

    // --- NRI Details (Step 10) ---
    public static final int NRI_ADDRESS_1 = 54;
    public static final int NRI_ADDRESS_2 = 55;
    public static final int NRI_ADDRESS_3 = 56;
    public static final int NRI_CITY = 57;
    public static final int NRI_STATE = 58;
    public static final int NRI_PINCODE = 59;
    public static final int NRI_COUNTRY = 60;

    // --- KYC (Step 11) ---
    public static final int CKYC_NUMBER = 61;
    public static final int KYC_VERIFIED = 62;
    public static final int KYC_TYPE = 63;

    // --- Aadhaar (Step 12) ---
    public static final int AADHAAR_UPDATED = 64;

    // --- Declaration (Step 13) ---
    public static final int PEP_FLAG = 65;
    public static final int FOREIGN_TAX_FLAG = 66;
    public static final int SOURCE_OF_WEALTH = 67;
    public static final int GROSS_ANNUAL_INCOME = 68;
    public static final int NET_WORTH = 69;
    public static final int NET_WORTH_DATE = 70;

    // --- Nomination (Step 14) ---
    public static final int NOMINATION_OPTED = 71;
    public static final int NOMINATION_AUTH_MODE = 72;

    // --- Nominee Details (Step 15) ---
    // Nominee 1
    public static final int NOMINEE_1_NAME = 73;
    public static final int NOMINEE_1_RELATION = 74;
    public static final int NOMINEE_1_PERCENTAGE = 75;
    public static final int NOMINEE_1_DOB = 76;
    public static final int NOMINEE_1_ADDRESS = 77;
    public static final int NOMINEE_1_CITY = 78;
    public static final int NOMINEE_1_STATE = 79;
    public static final int NOMINEE_1_PINCODE = 80;
    public static final int NOMINEE_1_GUARDIAN_NAME = 81;
    public static final int NOMINEE_1_GUARDIAN_PAN = 82;

    // Nominee 2
    public static final int NOMINEE_2_NAME = 83;
    public static final int NOMINEE_2_RELATION = 84;
    public static final int NOMINEE_2_PERCENTAGE = 85;
    public static final int NOMINEE_2_DOB = 86;
    public static final int NOMINEE_2_ADDRESS = 87;
    public static final int NOMINEE_2_CITY = 88;
    public static final int NOMINEE_2_STATE = 89;
    public static final int NOMINEE_2_PINCODE = 90;
    public static final int NOMINEE_2_GUARDIAN_NAME = 91;
    public static final int NOMINEE_2_GUARDIAN_PAN = 92;

    // Nominee 3
    public static final int NOMINEE_3_NAME = 93;
    public static final int NOMINEE_3_RELATION = 94;
    public static final int NOMINEE_3_PERCENTAGE = 95;
    public static final int NOMINEE_3_DOB = 96;
    public static final int NOMINEE_3_ADDRESS = 97;
    public static final int NOMINEE_3_CITY = 98;
    public static final int NOMINEE_3_STATE = 99;
    public static final int NOMINEE_3_PINCODE = 100;
    public static final int NOMINEE_3_GUARDIAN_NAME = 101;
    public static final int NOMINEE_3_GUARDIAN_PAN = 102;

    // --- Remaining fields (103–182) ---
    // These positions are placeholders. Populate from BSE V183 specification.
    // Fields may include: FATCA details, additional bank accounts,
    // additional contact info, CRS declarations, etc.
}
