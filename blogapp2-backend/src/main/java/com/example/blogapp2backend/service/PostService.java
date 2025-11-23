package com.example.blogapp2backend.service;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.blogapp2backend.dto.request.post.CreatePostRequest;
import com.example.blogapp2backend.dto.request.post.UpdatePostRequest;
import com.example.blogapp2backend.dto.response.PaginatedResponse;
import com.example.blogapp2backend.dto.response.post.PostResponse;
import com.example.blogapp2backend.dto.response.post.PostSummaryResponse;
import com.example.blogapp2backend.entity.Post;
import com.example.blogapp2backend.entity.User;
import com.example.blogapp2backend.mapper.PostMapper;
import com.example.blogapp2backend.repository.PostRepository;
import com.example.blogapp2backend.repository.UserRepository;
import com.example.blogapp2backend.security.UserPrincipal;

/*
PostService acts as the business logic layer for handling posts.
 */
@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PostMapper postMapper;

    public PostResponse createPost(CreatePostRequest request, UserPrincipal currentUser) {

        // 1. Get the authenticated user entity
        User author = userRepository.findById(currentUser.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Convert DTO to entity using mapper
        Post post = postMapper.toEntity(request, author);

        // 3. Set system-managed fields
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        // Initialize counters
        post.setViewCount(0);
        post.setCommentCount(0);

        // 4. Save to database
        Post savedPost = postRepository.save(post);

        // 5. Convert entity back to response DTO
        return postMapper.toResponse(savedPost);
    }

    // Alternative method for backwards compatibility (username string)
    public PostResponse createPost(CreatePostRequest request, String username) {
        // 1. Get the authenticated user entity by username
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 2. Convert DTO to entity using mapper
        Post post = postMapper.toEntity(request, author);

        // 3. Set system-managed fields
        post.setCreatedAt(new Date());
        post.setUpdatedAt(new Date());
        // Initialize counters
        post.setViewCount(0);
        post.setCommentCount(0);

        // 4. Save to database
        Post savedPost = postRepository.save(post);

        // 5. Convert entity back to response DTO
        return postMapper.toResponse(savedPost);
    }

    public PostResponse updatePost(Long postId, UpdatePostRequest request, UserPrincipal currentUser) {
        // 1. Find existing post
        Post existingPost = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        // 2. Security check - only author can update
        if (!existingPost.getAuthor().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update your own posts");
        }

        // 3. Update only non-null fields (partial update)
        if (request.getTitle() != null) {
            existingPost.setTitle(request.getTitle());
        }
        if (request.getContent() != null) {
            existingPost.setContent(request.getContent());
        }
        if (request.getExcerpt() != null) {
            existingPost.setExcerpt(request.getExcerpt());
        }
        if (request.getTags() != null) {
            existingPost.setTags(request.getTags());
        }
        if (request.getPublished() != null) {
            existingPost.setPublished(request.getPublished());
        }
        if (request.getCoverImageUrl() != null) {
            existingPost.setCoverImageUrl(request.getCoverImageUrl());
        }

        // 4. Update timestamp
        existingPost.setUpdatedAt(new Date());

        // 5. Save and return
        Post savedPost = postRepository.save(existingPost);
        return postMapper.toResponse(savedPost);
    }

    public Page<PostSummaryResponse> getPublishedPostSummaries(Pageable pageable) {
        Page<Post> posts = postRepository.findByPublishedTrue(pageable);
        return posts.map(postMapper::toSummaryResponse);
    }

    public PostResponse getPublishedPost(Long postId) {
        Post post = postRepository.findByIdAndPublishedTrue(postId)
                .orElseThrow(() -> new RuntimeException("Published post not found"));

        // Increment view count
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);

        return postMapper.toResponse(post);
    }

    public Page<PostResponse> getUserPosts(Long userId, Pageable pageable) {
        Page<Post> posts = postRepository.findByAuthorIdOrderByCreatedAtDesc(userId, pageable);
        return posts.map(postMapper::toResponse);
    }

    public Page<PostResponse> getUserPublishedPosts(Long userId, Pageable pageable) {
        Page<Post> posts = postRepository.findByAuthorIdAndPublishedTrueOrderByCreatedAtDesc(userId, pageable);
        return posts.map(postMapper::toResponse);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // get posts with pagination
    public PaginatedResponse<Post> getPostsPaginated(int page, int limit) {
        // spring data pages are 0-indexed, but frontend sends 1-indexed
        int pageIndex = Math.max(0, page - 1);

        // create pageable object with sorting by creation date (newest first)
        Pageable pageable = PageRequest.of(pageIndex, limit,
                Sort.by(Sort.Direction.DESC, "createdAt"));

        // get page of posts from repository
        Page<Post> postPage = postRepository.findAll(pageable);

        // build paginated response
        return PaginatedResponse.<Post>builder()
                .data(postPage.getContent())
                .totalItems((int) postPage.getTotalElements())
                .totalPages(postPage.getTotalPages())
                .currentPage(page)
                .hasNext(postPage.hasNext())
                .hasPrevious(postPage.hasPrevious())
                .build();
    }

}
