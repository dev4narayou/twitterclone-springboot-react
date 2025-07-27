package com.example.blogapp2backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    private final long MAX_AGE_SECS = 3600;

    @Value("${app.cors.allowedOrigins:http://localhost:3000,http://localhost:5173,http://localhost:5174}")
    private String allowedOriginsString;

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        System.out.println("🌐 WebMvcConfig CORS - allowedOriginsString: '" + allowedOriginsString + "'");

        String[] allowedOrigins = allowedOriginsString.split(",");
        for (int i = 0; i < allowedOrigins.length; i++) {
            allowedOrigins[i] = allowedOrigins[i].trim();
            System.out.println("  -> WebMvc CORS origin: '" + allowedOrigins[i] + "'");
        }

        registry.addMapping("/**")
                .allowedOrigins(allowedOrigins)
                .allowedMethods("HEAD", "OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE")
                .allowCredentials(true)
                .maxAge(MAX_AGE_SECS);

        System.out.println("🌐 WebMvcConfig CORS configuration complete!");
    }
}