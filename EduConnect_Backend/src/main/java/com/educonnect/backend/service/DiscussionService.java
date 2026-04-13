package com.educonnect.backend.service;

import com.educonnect.backend.dto.comment.CommentCreateRequest;
import com.educonnect.backend.dto.comment.CommentResponse;
import com.educonnect.backend.dto.post.PostCreateRequest;
import com.educonnect.backend.dto.post.PostResponse;

import java.util.List;

public interface DiscussionService {
    PostResponse createPost(PostCreateRequest request);
    List<PostResponse> getAllPosts();
    CommentResponse createComment(Long postId, CommentCreateRequest request);
    List<CommentResponse> getPostComments(Long postId);
}
