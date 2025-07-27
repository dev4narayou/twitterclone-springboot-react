package com.example.blogapp2backend.dto.response.user;

import lombok.Builder;
import lombok.Data;
import java.util.Date;

@Data
@Builder
public class PublicUserResponse {
    private Long id;
    private String username;
    private String displayName;
    private String bio;
    private String website;
    private String location;
    private Date joinedAt;
    private Integer postCount;
}
