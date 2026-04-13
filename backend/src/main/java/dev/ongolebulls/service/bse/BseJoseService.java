package dev.ongolebulls.service.bse;

import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.*;
import com.nimbusds.jose.jwk.RSAKey;
import lombok.extern.slf4j.Slf4j;
import org.bouncycastle.asn1.pkcs.PrivateKeyInfo;
import org.bouncycastle.asn1.x509.SubjectPublicKeyInfo;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.bouncycastle.openssl.PEMKeyPair;
import org.bouncycastle.openssl.PEMParser;
import org.bouncycastle.openssl.jcajce.JcaPEMKeyConverter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.FileReader;
import java.nio.charset.StandardCharsets;
import java.security.Security;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.util.Base64;

@Service
@Slf4j
public class BseJoseService {

    @Value("${bse.starmf.v2.private-key-path:}")
    private String privateKeyPath;

    @Value("${bse.starmf.v2.bse-public-key-path:}")
    private String bsePublicKeyPath;

    @Value("${bse.starmf.v2.mock-mode:true}")
    private boolean mockMode;

    private RSAPrivateKey memberPrivateKey;
    private RSAPublicKey bsePublicKey;

    @PostConstruct
    public void loadKeys() {
        if (mockMode) {
            log.warn("[BSE] Mock mode enabled. "
                + "Set BSE_V2_MOCK_MODE=false and provide real "
                + "PEM key paths for live integration.");
            return;
        }
        try {
            Security.addProvider(new BouncyCastleProvider());
            memberPrivateKey = loadPrivateKey(privateKeyPath);
            bsePublicKey = loadPublicKey(bsePublicKeyPath);
            log.info("[BSE] JOSE keys loaded successfully.");
        } catch (Exception e) {
            log.error("[BSE] Key loading failed: {}. "
                + "Falling back to mock mode.", e.getMessage());
            mockMode = true;
        }
    }

    /**
     * Encrypt JSON payload: JWE encrypt with BSE public key, then JWS sign with member private key.
     */
    public String encrypt(String jsonPayload) throws Exception {
        if (mockMode) {
            log.debug("[BSE MOCK] Skipping encryption, returning base64 payload");
            return Base64.getEncoder()
                .encodeToString(jsonPayload.getBytes(StandardCharsets.UTF_8));
        }

        // Step 1: JWE encrypt with BSE public key
        JWEHeader jweHeader = new JWEHeader.Builder(
            JWEAlgorithm.RSA_OAEP_256,
            EncryptionMethod.A256GCM).build();
        JWEObject jweObject = new JWEObject(jweHeader, new Payload(jsonPayload));
        jweObject.encrypt(new RSAEncrypter(bsePublicKey));
        String jweCompact = jweObject.serialize();

        // Step 2: JWS sign with member private key
        JWSHeader jwsHeader = new JWSHeader.Builder(JWSAlgorithm.RS256).build();
        JWSObject jwsObject = new JWSObject(jwsHeader, new Payload(jweCompact));
        jwsObject.sign(new RSASSASigner(memberPrivateKey));

        return jwsObject.serialize();
    }

    /**
     * Decrypt JWS response: verify signature with BSE public key, then JWE decrypt with member private key.
     */
    public String decrypt(String jwsCompact) throws Exception {
        if (mockMode) {
            log.debug("[BSE MOCK] Skipping decryption, attempting base64 decode");
            try {
                return new String(Base64.getDecoder().decode(jwsCompact), StandardCharsets.UTF_8);
            } catch (Exception e) {
                return jwsCompact;
            }
        }

        // Step 1: Parse and verify JWS
        JWSObject jwsObject = JWSObject.parse(jwsCompact);
        JWSVerifier verifier = new RSASSAVerifier(bsePublicKey);
        if (!jwsObject.verify(verifier)) {
            throw new RuntimeException(
                "[BSE] Response signature verification FAILED. "
                + "Possible tampering or wrong BSE public key.");
        }

        // Step 2: Extract and decrypt JWE
        String jweCompact = jwsObject.getPayload().toString();
        JWEObject jweObject = JWEObject.parse(jweCompact);
        jweObject.decrypt(new RSADecrypter(memberPrivateKey));

        return jweObject.getPayload().toString();
    }

    private RSAPrivateKey loadPrivateKey(String path) throws Exception {
        try (PEMParser parser = new PEMParser(new FileReader(path, StandardCharsets.UTF_8))) {
            Object obj = parser.readObject();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");
            if (obj instanceof PrivateKeyInfo pki) {
                return (RSAPrivateKey) converter.getPrivateKey(pki);
            }
            if (obj instanceof PEMKeyPair pair) {
                return (RSAPrivateKey) converter.getKeyPair(pair).getPrivate();
            }
            throw new RuntimeException("Unrecognised private key format at: " + path);
        }
    }

    private RSAPublicKey loadPublicKey(String path) throws Exception {
        try (PEMParser parser = new PEMParser(new FileReader(path, StandardCharsets.UTF_8))) {
            Object obj = parser.readObject();
            JcaPEMKeyConverter converter = new JcaPEMKeyConverter().setProvider("BC");
            if (obj instanceof SubjectPublicKeyInfo spki) {
                return (RSAPublicKey) converter.getPublicKey(spki);
            }
            throw new RuntimeException("Unrecognised public key format at: " + path);
        }
    }
}
