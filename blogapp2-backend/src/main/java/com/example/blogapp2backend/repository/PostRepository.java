package com.example.blogapp2backend.repository;

import com.example.blogapp2backend.entity.Post;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Find published posts only (for public API)
    Page<Post> findByPublishedTrue(Pageable pageable);

    // Find published post by ID (for public viewing)
    Optional<Post> findByIdAndPublishedTrue(Long id);

    // Find user's posts (including drafts) ordered by creation date
    Page<Post> findByAuthorIdOrderByCreatedAtDesc(Long authorId, Pageable pageable);

    // Find posts by tag
    Page<Post> findByTagsContainingAndPublishedTrue(String tag, Pageable pageable);
}
