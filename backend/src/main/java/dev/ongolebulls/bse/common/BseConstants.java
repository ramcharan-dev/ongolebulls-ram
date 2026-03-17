package dev.ongolebulls.bse.common;

import java.util.Set;

public final class BseConstants {

    private BseConstants() {}

    // --- Status ---
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_SUCCESS = "SUCCESS";
    public static final String STATUS_FAILED = "FAILED";
    public static final String STATUS_DRAFT = "DRAFT";

    // --- BSE Response Codes ---
    public static final String BSE_SUCCESS_CODE = "100";

    // --- Registration Types ---
    public static final String REGN_TYPE_NEW = "NEW";
    public static final String REGN_TYPE_ADDITIONAL = "ADDITIONAL";

    // --- UCC Param ---
    public static final int UCC_PARAM_FIELD_COUNT = 183;

    // --- API Names (for logging) ---
    public static final String API_UCC_REGISTRATION = "UCCRegistrationV183";
    public static final String API_PURCHASE = "Purchase";
    public static final String API_REDEMPTION = "Redemption";
    public static final String API_SIP = "SIP";
    public static final String API_PORTFOLIO = "Portfolio";

    // --- Sensitive fields that must be masked in logs ---
    public static final Set<String> SENSITIVE_FIELDS = Set.of(
            "pan", "panNumber", "PAN",
            "aadhaar", "aadhaarNumber", "Aadhaar",
            "ckyc", "ckycNumber", "CKYC",
            "accountNumber", "accountNumberEncrypted", "AccountNo",
            "password", "Password",
            "ifsc", "IFSC"
    );

    public static final String MASKED_VALUE = "***MASKED***";
}
