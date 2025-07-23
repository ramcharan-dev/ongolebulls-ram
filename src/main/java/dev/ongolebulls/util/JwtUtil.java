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
