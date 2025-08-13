package dev.ongolebulls.dto;

import lombok.Data;

@Data
public class OtpEmailVerifyRequest { private String email; private String otp; }
