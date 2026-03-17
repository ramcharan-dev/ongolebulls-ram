package dev.ongolebulls.bse.nominee.mapping;

import dev.ongolebulls.bse.nominee.dto.NomineeRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;

@Component
@Slf4j
public class NomineeParamBuilder {

    @Value("${bse.starmf.user.id:}")
    private String bseUserId;

    @Value("${bse.starmf.member.id:}")
    private String bseMemberId;

    @Value("${bse.starmf.password:}")
    private String bsePassword;

    public Map<String, String> buildFlagPayload(String clientCode) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("userid", bseUserId);
        params.put("memberid", bseMemberId);
        params.put("password", bsePassword);
        params.put("clientcode", clientCode);
        params.put("nominationflag", "Y");
        return params;
    }

    public Map<String, String> buildRegistrationPayload(NomineeRequest request, String clientCode) {
        Map<String, String> params = new LinkedHashMap<>();

        // BSE credentials
        params.put("userid", bseUserId);
        params.put("memberid", bseMemberId);
        params.put("password", bsePassword);
        params.put("clientcode", clientCode);

        // Nominee 1 (required)
        params.put("nominee1_name", safe(request.nomineeName()));
        params.put("nominee1_relation", safe(request.nomineeRelation()));
        params.put("nominee1_percentage", String.valueOf(request.nomineePercentage()));
        params.put("nominee1_dob", safe(request.nomineeDob()));
        params.put("nominee1_minorflag", safe(request.nomineeMinorFlag(), "N"));
        params.put("nominee1_guardianname", safe(request.guardianName()));
        params.put("nominee1_guardianpan", safe(request.guardianPan()));
        params.put("nominee1_guardianrelation", "");
        params.put("nominee1_guardianeligible", "");
        params.put("nominee1_address1", "");
        params.put("nominee1_address2", "");
        params.put("nominee1_address3", "");
        params.put("nominee1_city", "");
        params.put("nominee1_state", "");
        params.put("nominee1_pincode", "");
        params.put("nominee1_panexempt", "");
        params.put("nominee1_pan", "");
        params.put("nominee1_guardianaddress1", "");
        params.put("nominee1_guardianaddress2", "");
        params.put("nominee1_guardianaddress3", "");
        params.put("nominee1_guardiancity", "");
        params.put("nominee1_guardianstate", "");
        params.put("nominee1_guardianpincode", "");

        // Nominee 2 (optional)
        params.put("nominee2_name", safe(request.nominee2Name()));
        params.put("nominee2_relation", safe(request.nominee2Relation()));
        params.put("nominee2_percentage", request.nominee2Percentage() != null
                ? String.valueOf(request.nominee2Percentage()) : "");
        params.put("nominee2_dob", safe(request.nominee2Dob()));
        params.put("nominee2_minorflag", safe(request.nominee2MinorFlag()));
        params.put("nominee2_guardianname", safe(request.guardian2Name()));
        params.put("nominee2_guardianpan", safe(request.guardian2Pan()));
        params.put("nominee2_guardianrelation", "");
        params.put("nominee2_guardianeligible", "");
        params.put("nominee2_address1", "");
        params.put("nominee2_address2", "");
        params.put("nominee2_address3", "");
        params.put("nominee2_city", "");
        params.put("nominee2_state", "");
        params.put("nominee2_pincode", "");
        params.put("nominee2_panexempt", "");
        params.put("nominee2_pan", "");

        // Nominee 3 (optional)
        params.put("nominee3_name", safe(request.nominee3Name()));
        params.put("nominee3_relation", safe(request.nominee3Relation()));
        params.put("nominee3_percentage", request.nominee3Percentage() != null
                ? String.valueOf(request.nominee3Percentage()) : "");
        params.put("nominee3_dob", safe(request.nominee3Dob()));
        params.put("nominee3_minorflag", safe(request.nominee3MinorFlag()));
        params.put("nominee3_guardianname", safe(request.guardian3Name()));
        params.put("nominee3_guardianpan", safe(request.guardian3Pan()));
        params.put("nominee3_guardianrelation", "");
        params.put("nominee3_guardianeligible", "");
        params.put("nominee3_address1", "");
        params.put("nominee3_address2", "");
        params.put("nominee3_address3", "");
        params.put("nominee3_city", "");
        params.put("nominee3_state", "");
        params.put("nominee3_pincode", "");
        params.put("nominee3_panexempt", "");
        params.put("nominee3_pan", "");

        return params;
    }

    private String safe(String value) {
        return value != null ? value : "";
    }

    private String safe(String value, String defaultValue) {
        return (value != null && !value.isBlank()) ? value : defaultValue;
    }
}