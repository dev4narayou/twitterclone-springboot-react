package com.example.blogapp2backend.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenProvider.class);

    @Value("${app.jwtSecret}")
    private String jwtSecret;

    @Value("${app.jwtExpirationInMs}")
    private int jwtExpirationInMs;

    private SecretKey getSigningKey() {
        // Ensure the key is properly encoded and meets minimum length requirements
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            logger.warn("JWT secret key is shorter than recommended 256 bits (32 bytes)");
        }
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationInMs);

        String token = Jwts.builder()
                .setSubject(Long.toString(userPrincipal.getId()))
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey())
                .compact();

        logger.debug("Generated JWT token for user ID: {}", userPrincipal.getId());
        return token;
    }

    public Long getUserIdFromJWT(String token) {
        try {
            Claims claims = Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return Long.parseLong(claims.getSubject());
        } catch (Exception ex) {
            logger.error("Error extracting user ID from JWT token", ex);
            throw ex;
        }
    }

    public boolean validateToken(String authToken) {
        if (authToken == null || authToken.trim().isEmpty()) {
            logger.error("JWT token is null or empty");
            return false;
        }

        // Check for common frontend issues
        if ("undefined".equals(authToken) || "null".equals(authToken)) {
            logger.error("JWT token is '{}' - frontend is not properly setting the token", authToken);
            return false;
        }

        // Basic JWT format check (should have 2 dots for JWS)
        if (authToken.split("\\.").length != 3) {
            logger.error("JWT token has invalid format - expected 3 parts separated by dots, got: {}", authToken.split("\\.").length);
            return false;
        }

        // Log the token format for debugging (first and last few characters only)
        if (logger.isDebugEnabled()) {
            String tokenPreview = authToken.length() > 20 ?
                authToken.substring(0, 10) + "..." + authToken.substring(authToken.length() - 10) :
                authToken;
            logger.debug("Validating JWT token: {}", tokenPreview);
        }

        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(authToken);
            logger.debug("JWT token validation successful");
            return true;
        } catch (MalformedJwtException ex) {
            logger.error("Invalid JWT token - malformed: {}", ex.getMessage());
        } catch (ExpiredJwtException ex) {
            logger.error("Expired JWT token: {}", ex.getMessage());
        } catch (UnsupportedJwtException ex) {
            logger.error("Unsupported JWT token: {}", ex.getMessage());
        } catch (IllegalArgumentException ex) {
            logger.error("JWT claims string is empty: {}", ex.getMessage());
        } catch (SecurityException ex) {
            logger.error("JWT token security error: {}", ex.getMessage());
        } catch (Exception ex) {
            logger.error("JWT token validation error: {}", ex.getMessage(), ex);
        }
        return false;
    }
}