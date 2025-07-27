package com.example.blogapp2backend.service;

import com.example.blogapp2backend.dto.response.JwtResponse;
import com.example.blogapp2backend.dto.request.LoginRequest;
import com.example.blogapp2backend.dto.request.RegisterRequest;
import com.example.blogapp2backend.dto.response.UserResponse;
import com.example.blogapp2backend.entity.User;
import com.example.blogapp2backend.security.JwtTokenProvider;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;

@Service
public class AuthenticationService {

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    public UserResponse register(RegisterRequest registerRequest) {
        if (registerRequest.getUserName() == null || registerRequest.getEmail() == null || registerRequest.getPassword() == null) {
            throw new IllegalArgumentException("Invalid registration details");
        }

        // check if username or email already exists
        if (userService.existsByUsername(registerRequest.getUserName())) {
            throw new IllegalArgumentException("Username is already taken!");
        }

        if (userService.existsByEmail(registerRequest.getEmail())) {
            throw new IllegalArgumentException("Email is already in use!");
        }

        // create a new user entity
        User newUser = new User();
        newUser.setUsername(registerRequest.getUserName());
        newUser.setEmail(registerRequest.getEmail());

        // hash the password properly
        newUser.setPasswordHash(passwordEncoder.encode(registerRequest.getPassword()));

        // set default role
        newUser.setRoles(Arrays.asList("USER"));

        // save the user using UserService
        User savedUser = userService.saveUser(newUser);

        // convert to UserResponse DTO
        return UserResponse.builder()
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .roles(savedUser.getRoles()) // return the roles list
                .build();
    }

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String jwt = tokenProvider.generateToken(authentication);

        // get the user details from authentication
        User user = userService.findByUsernameOrEmail(loginRequest.getUsernameOrEmail(), loginRequest.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return JwtResponse.builder()
                .accessToken(jwt)
                .tokenType("Bearer")
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();
    }
}
