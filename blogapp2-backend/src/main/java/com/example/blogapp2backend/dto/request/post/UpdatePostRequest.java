package com.example.blogapp2backend.dto.request.post;

import lombok.Data;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
public class UpdatePostRequest {

    @Size(min = 5, max = 200, message = "Title must be between 5 and 200 characters")
    private String title;        // Optional - might only update some fields

    @Size(min = 10, message = "Content must be at least 10 characters")
    private String content;      // Optional

    @Size(max = 300, message = "Excerpt cannot exceed 300 characters")
    private String excerpt;      // Optional

    private List<String> tags;   // Optional

    private Boolean published;   // Optional - can publish/unpublish

    private String coverImageUrl; // Optional

    // Note: Uses @Size instead of @NotBlank because fields are optional in updates
    // Note: Service layer will only update non-null fields
}
