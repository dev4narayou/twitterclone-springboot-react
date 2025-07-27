package com.example.blogapp2backend.dto.response.user;

import lombok.Builder;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class PrivateUserResponse {
    private Long id;
    private String username;
    private String displayName;
    private String email;          // Only visible to the user themselves
    private String bio;
    private String website;
    private String location;
    private List<String> roles;    // User can see their own roles
    private Date joinedAt;
    private String profilePictureUrl;
    private Integer postCount;
    private Boolean emailVerified;

    // Note: Still no password hash - that should NEVER be exposed
}
