package dev.ongolebulls.bse.elog.mapping;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.ThreadLocalRandom;

@Component
@Slf4j
public class ElogParamBuilder {

    @Value("${bse.starmf.user.id:}")
    private String bseUserId;

    @Value("${bse.starmf.member.id:}")
    private String bseMemberId;

    @Value("${bse.starmf.password:}")
    private String bsePassword;

    @Value("${bse.elog.loopback-url:}")
    private String defaultLoopbackUrl;

    @Value("${bse.elog.allow-loopback-msg:Y}")
    private String allowLoopbackMsg;

    public Map<String, String> build(String clientCode, String holder,
                                     String documentType, String intRefNo,
                                     String loopbackUrl) {
        Map<String, String> params = new LinkedHashMap<>();
        params.put("userid", bseUserId);
        params.put("memberid", bseMemberId);
        params.put("password", bsePassword);
        params.put("clientcode", clientCode);
        params.put("holder", holder != null ? holder : "FH");
        params.put("documenttype", documentType != null ? documentType : "NRM");
        params.put("intrefno", intRefNo);
        params.put("loopbackurl", loopbackUrl != null ? loopbackUrl : defaultLoopbackUrl);
        params.put("allowloopbackmsg", allowLoopbackMsg);
        return params;
    }

    public String generateIntRefNo() {
        return "ELOG-" + System.currentTimeMillis() + "-"
                + String.format("%04d", ThreadLocalRandom.current().nextInt(10000));
    }
}
