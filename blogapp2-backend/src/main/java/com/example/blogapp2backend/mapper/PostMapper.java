package com.example.blogapp2backend.mapper;

import com.example.blogapp2backend.dto.request.post.CreatePostRequest;
import com.example.blogapp2backend.dto.response.post.PostResponse;
import com.example.blogapp2backend.dto.response.post.PostSummaryResponse;
import com.example.blogapp2backend.dto.response.user.PublicUserResponse;
import com.example.blogapp2backend.entity.Post;
import com.example.blogapp2backend.entity.User;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {

    public Post toEntity(CreatePostRequest request, User author) {
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setExcerpt(request.getExcerpt());
        post.setTags(request.getTags());
        post.setPublished(request.getPublished());
        post.setCoverImageUrl(request.getCoverImageUrl());
        post.setAuthor(author);
        return post;
    }

    public PostResponse toResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .excerpt(post.getExcerpt())
                .tags(post.getTags())
                .published(post.getPublished())
                .coverImageUrl(post.getCoverImageUrl())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .author(toPublicUserResponse(post.getAuthor()))
                .viewCount(post.getViewCount())
                .commentCount(post.getCommentCount())
                .build();
    }

    public PostSummaryResponse toSummaryResponse(Post post) {
        return PostSummaryResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .excerpt(post.getExcerpt())
                .tags(post.getTags())
                .coverImageUrl(post.getCoverImageUrl())
                .createdAt(post.getCreatedAt())
                .author(toPublicUserResponse(post.getAuthor()))
                .viewCount(post.getViewCount())
                .commentCount(post.getCommentCount())
                .build();
    }

    private PublicUserResponse toPublicUserResponse(User user) {
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
}
