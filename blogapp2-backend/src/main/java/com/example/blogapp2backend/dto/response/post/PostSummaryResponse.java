package com.example.blogapp2backend.dto.response.post;

import com.example.blogapp2backend.dto.response.user.PublicUserResponse;
import lombok.Builder;
import lombok.Data;
import java.util.Date;
import java.util.List;

@Data
@Builder
public class PostSummaryResponse {
    private Long id;
    private String title;
    private String excerpt;       // Short summary, not full content
    private List<String> tags;
    private String coverImageUrl;
    private Date createdAt;
    private PublicUserResponse author;
    private Integer viewCount;
    private Integer commentCount;

    // Note: No full content - this is for post lists/feeds
    // Note: Smaller payload for better performance when loading many posts
}
