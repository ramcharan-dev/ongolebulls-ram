package dev.ongolebulls.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
public class RecaptchaService {
    @Value("${recaptcha.secret}")
    private String secret;

    private static final String VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

    public boolean verify(String token) {
        if (token == null || token.isBlank()) return false;
        RestTemplate rt = new RestTemplate();
        String url = VERIFY_URL + "?secret=" + secret + "&response=" + token;
        Map<String,Object> resp = rt.getForObject(url, Map.class);
        if (resp == null) return false;
        Object success = resp.get("success");
        return success != null && Boolean.TRUE.equals(success);
    }
}
