package com.example.blogapp2backend.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.example.blogapp2backend.service.UserService;
import com.example.blogapp2backend.entity.User;
import java.util.List;

/*
To mock API calls upon server init (testing H2).
 */
@Configuration
public class ApiMockRunner {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public ApplicationRunner runOnStartup() {
        return args -> {
            // Check if test user already exists
            if (!userService.existsByEmail("test@test.com")) {
                // Create a test user
                User testUser = new User();
                testUser.setUsername("testuser");
                testUser.setEmail("test@test.com");
                testUser.setPasswordHash(passwordEncoder.encode("password"));
                testUser.setDisplayName("Test User");
                testUser.setBio("This is a test user created on startup");
                testUser.setEmailVerified(true);
                testUser.setRoles(List.of("USER"));

                userService.saveUser(testUser);
                System.out.println("Created test user with email: test@test.com");
            } else {
                System.out.println("Test user already exists with email: test@test.com");
            }
        };
    }
}
