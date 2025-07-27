package com.example.blogapp2backend.dto.response;

import lombok.Builder;
import lombok.Data;
import java.util.List;

@Data
@Builder
public class JwtResponse {
    private String accessToken;
    private String tokenType;
    private Long id;
    private String username;
    private String email;
    private List<String> roles;
}
