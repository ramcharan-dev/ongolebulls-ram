/*
package dev.ongolebulls.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class EncryptionService {

    private final byte[] key;

    public EncryptionService(@Value("${encryption.key}") String base64Key) {
        // Decode Base64 into raw 32 bytes
        this.key = Base64.getDecoder().decode(base64Key);
    }

    public String encrypt(String plaintext) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding"); // explicitly set mode
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] enc = cipher.doFinal(plaintext.getBytes());
            return Base64.getEncoder().encodeToString(enc);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public String decrypt(String cipherText) {
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] dec = cipher.doFinal(Base64.getDecoder().decode(cipherText));
            return new String(dec);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
*/
package dev.ongolebulls.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class EncryptionService {

    private final byte[] key;

    public EncryptionService(@Value("${encryption.key}") String base64Key) {
        // Decode Base64 into raw 32 bytes
        this.key = Base64.getDecoder().decode(base64Key);
    }

    public String encrypt(String plaintext) {
        if (plaintext == null || plaintext.isBlank()) {
            return null; // safely handle null or empty input
        }
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding"); // explicitly set mode
            cipher.init(Cipher.ENCRYPT_MODE, keySpec);
            byte[] enc = cipher.doFinal(plaintext.getBytes());
            return Base64.getEncoder().encodeToString(enc);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }

    public String decrypt(String cipherText) {
        if (cipherText == null || cipherText.isBlank()) {
            return null; // safely handle null or empty input
        }
        try {
            SecretKeySpec keySpec = new SecretKeySpec(key, "AES");
            Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
            cipher.init(Cipher.DECRYPT_MODE, keySpec);
            byte[] dec = cipher.doFinal(Base64.getDecoder().decode(cipherText));
            return new String(dec);
        } catch (Exception ex) {
            throw new RuntimeException(ex);
        }
    }
}
