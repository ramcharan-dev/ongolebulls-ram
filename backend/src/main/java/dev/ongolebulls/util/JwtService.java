/*
//package dev.ongolebulls.util;
//
//import com.auth0.jwt.JWT;
//import com.auth0.jwt.algorithms.Algorithm;
//import com.auth0.jwt.exceptions.JWTVerificationException;
//import com.auth0.jwt.interfaces.DecodedJWT;
//import com.auth0.jwt.interfaces.JWTVerifier;
//
//import java.util.Date;
//
//public class JwtUtil {
//    private static final String SECRET_KEY = "your_secret_key";
//    private static final long EXPIRATION_TIME = 86400000; // 1 day in milliseconds
//
//    public static String generateToken(String email) {
//        return JWT.create()
//                .withSubject(email)
//                .withIssuedAt(new Date())
//                .withExpiresAt(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
//                .sign(Algorithm.HMAC256(SECRET_KEY));
//    }
//
//    public static String validateToken(String token) {
//        try {
//            JWTVerifier verifier = JWT.require(Algorithm.HMAC256(SECRET_KEY))
//                    .build();
//            DecodedJWT jwt = verifier.verify(token);
//            return jwt.getSubject(); // Returns email
//        } catch (JWTVerificationException e) {
//            return null; // Invalid token
//        }
//    }
//}
package dev.ongolebulls.util;

import dev.ongolebulls.config.AppProperties;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final AppProperties props;

    private Key key() {
        return Keys.hmacShaKeyFor(props.getJwtSecret().getBytes());
    }

    public String createToken(String subject, Map<String, Object> claims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(props.getJwtExpiryMinutes() * 60L);
        return Jwts.builder()
                .setIssuer(props.getJwtIssuer())
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(exp))
                .signWith(key())
                .compact();
    }
}
*/
