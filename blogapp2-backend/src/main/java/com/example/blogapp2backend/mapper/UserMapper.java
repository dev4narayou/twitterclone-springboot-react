package com.example.blogapp2backend.mapper;

import com.example.blogapp2backend.dto.request.user.UpdateProfileRequest;
import com.example.blogapp2backend.dto.response.user.PrivateUserResponse;
import com.example.blogapp2backend.dto.response.user.PublicUserResponse;
import com.example.blogapp2backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public PublicUserResponse toPublicResponse(User user) {
        return PublicUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .website(user.getWebsite())
                .location(user.getLocation())
                .joinedAt(user.getCreatedAt())
                .build();
    }

    public PrivateUserResponse toPrivateResponse(User user) {
        return PrivateUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .displayName(user.getDisplayName())
                .bio(user.getBio())
                .website(user.getWebsite())
                .location(user.getLocation())
                .emailVerified(user.getEmailVerified())
                .profilePictureUrl(user.getProfilePictureUrl())
                .roles(user.getRoles())
                .joinedAt(user.getCreatedAt())
                .build();
    }

    public void updateFromRequest(User user, UpdateProfileRequest request) {
        if (request.getDisplayName() != null) {
            user.setDisplayName(request.getDisplayName());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }
        if (request.getWebsite() != null) {
            user.setWebsite(request.getWebsite());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(request.getProfilePictureUrl());
        }
    }
}
