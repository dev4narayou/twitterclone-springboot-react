package com.example.blogapp2backend.dto.request.user;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

@Data
public class UpdateProfileRequest {

    @Size(min = 2, max = 50, message = "Display name must be between 2 and 50 characters")
    private String displayName;

    @Email(message = "Email should be valid")
    private String email;

    @Size(max = 500, message = "Bio cannot exceed 500 characters")
    private String bio;

    private String website;

    private String location;

    private String profilePictureUrl;

    // Note: No password field here - that would be a separate ChangePasswordRequest
    // Note: No username field - usernames typically can't be changed
}
