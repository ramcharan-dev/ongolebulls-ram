package dev.ongolebulls.bse.nominee.dto;

public record NomineeRequest(
        Long investorId,
        String clientCode,
        // Nominee 1 (required)
        String nomineeName,
        String nomineeRelation,
        int nomineePercentage,
        String nomineeDob,
        String nomineeMinorFlag,
        // Guardian 1 (required if minor)
        String guardianName,
        String guardianPan,
        // Nominee 2 (optional)
        String nominee2Name,
        String nominee2Relation,
        Integer nominee2Percentage,
        String nominee2Dob,
        String nominee2MinorFlag,
        String guardian2Name,
        String guardian2Pan,
        // Nominee 3 (optional)
        String nominee3Name,
        String nominee3Relation,
        Integer nominee3Percentage,
        String nominee3Dob,
        String nominee3MinorFlag,
        String guardian3Name,
        String guardian3Pan
) {}