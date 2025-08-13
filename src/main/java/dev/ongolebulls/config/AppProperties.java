package dev.ongolebulls.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "app")
public class AppProperties {
    private String uploadDir = "uploads";
    private boolean recaptchaEnabled = false;
    private String recaptchaSecret = "";

    public String getUploadDir() { return uploadDir; }
    public void setUploadDir(String uploadDir) { this.uploadDir = uploadDir; }

    public boolean isRecaptchaEnabled() { return recaptchaEnabled; }
    public void setRecaptchaEnabled(boolean recaptchaEnabled) { this.recaptchaEnabled = recaptchaEnabled; }

    public String getRecaptchaSecret() { return recaptchaSecret; }
    public void setRecaptchaSecret(String recaptchaSecret) { this.recaptchaSecret = recaptchaSecret; }
}
