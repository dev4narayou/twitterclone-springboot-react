package com.example.blogapp2backend.controller;

import com.example.blogapp2backend.dto.request.post.CreatePostRequest;
import com.example.blogapp2backend.dto.request.post.UpdatePostRequest;
import com.example.blogapp2backend.dto.response.post.PostResponse;
import com.example.blogapp2backend.dto.response.post.PostSummaryResponse;
import com.example.blogapp2backend.security.CurrentUser;
import com.example.blogapp2backend.security.UserPrincipal;
import com.example.blogapp2backend.service.PostService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class BlogPostController {

    @Autowired
    private PostService postService;

    // PUBLIC: Get post summaries for listing (lighter payload)
    @GetMapping
    public ResponseEntity<Page<PostSummaryResponse>> getPostSummaries(Pageable pageable) {
        // Create pageable with default sorting by createdAt descending (newest first)
        Pageable sortedPageable = PageRequest.of(
            pageable.getPageNumber(),
            pageable.getPageSize(),
            Sort.by(Sort.Direction.DESC, "createdAt")
        );
        Page<PostSummaryResponse> posts = postService.getPublishedPostSummaries(sortedPageable);
        return ResponseEntity.ok(posts);
    }

    // PUBLIC: Get full post details
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPost(@PathVariable Long postId) {
        PostResponse post = postService.getPublishedPost(postId);
        return ResponseEntity.ok(post);
    }

    // AUTHENTICATED: Create new post
    @PostMapping
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PostResponse> createPost(
            @Valid @RequestBody CreatePostRequest request,
            @CurrentUser UserPrincipal currentUser) {

        PostResponse createdPost = postService.createPost(request, currentUser);
        return new ResponseEntity<>(createdPost, HttpStatus.CREATED);
    }

    // AUTHENTICATED: Update existing post (owner only)
    @PutMapping("/{postId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<PostResponse> updatePost(
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePostRequest request,
            @CurrentUser UserPrincipal currentUser) {

        PostResponse updatedPost = postService.updatePost(postId, request, currentUser);
        return ResponseEntity.ok(updatedPost);
    }

    // AUTHENTICATED: Get user's own posts (including drafts)
    @GetMapping("/my-posts")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<Page<PostResponse>> getMyPosts(
            @CurrentUser UserPrincipal currentUser,
            Pageable pageable) {

        Page<PostResponse> myPosts = postService.getUserPosts(currentUser.getId(), pageable);
        return ResponseEntity.ok(myPosts);
    }
}
