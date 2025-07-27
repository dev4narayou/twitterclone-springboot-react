package com.example.blogapp2backend.dto.response.post;

import com.example.blogapp2backend.dto.response.user.PublicUserResponse;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private List<String> tags;
    private Boolean published;
    private String coverImageUrl;
    private Date createdAt;
    private Date updatedAt;
    private PublicUserResponse author;  // Nested DTO - only public info about author
    private Integer viewCount;
    private Integer commentCount;

    // Note: Full post data for when someone views a specific post
}
