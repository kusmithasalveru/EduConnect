package com.educonnect.backend.controller;

import com.educonnect.backend.dto.comment.CommentCreateRequest;
import com.educonnect.backend.dto.comment.CommentResponse;
import com.educonnect.backend.dto.post.PostCreateRequest;
import com.educonnect.backend.dto.post.PostResponse;
import com.educonnect.backend.service.DiscussionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/discussions")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;

    @PostMapping("/posts")
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody PostCreateRequest request) {
        return ResponseEntity.ok(discussionService.createPost(request));
    }

    @GetMapping("/posts")
    public ResponseEntity<List<PostResponse>> getPosts() {
        return ResponseEntity.ok(discussionService.getAllPosts());
    }

    @PostMapping("/posts/{postId}/comments")
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long postId,
                                                         @Valid @RequestBody CommentCreateRequest request) {
        return ResponseEntity.ok(discussionService.createComment(postId, request));
    }

    @GetMapping("/posts/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        return ResponseEntity.ok(discussionService.getPostComments(postId));
    }
}
