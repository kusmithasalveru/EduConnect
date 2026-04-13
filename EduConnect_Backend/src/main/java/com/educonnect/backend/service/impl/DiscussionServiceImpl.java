package com.educonnect.backend.service.impl;

import com.educonnect.backend.dto.comment.CommentCreateRequest;
import com.educonnect.backend.dto.comment.CommentResponse;
import com.educonnect.backend.dto.post.PostCreateRequest;
import com.educonnect.backend.dto.post.PostResponse;
import com.educonnect.backend.entity.Comment;
import com.educonnect.backend.entity.Post;
import com.educonnect.backend.entity.User;
import com.educonnect.backend.exception.ResourceNotFoundException;
import com.educonnect.backend.repository.CommentRepository;
import com.educonnect.backend.repository.PostRepository;
import com.educonnect.backend.repository.UserRepository;
import com.educonnect.backend.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscussionServiceImpl implements DiscussionService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final UserRepository userRepository;

    @Override
    public PostResponse createPost(PostCreateRequest request) {
        User author = getCurrentUser();
        Post post = Post.builder()
                .author(author)
                .title(request.getTitle())
                .content(request.getContent())
                .build();
        return toPostResponse(postRepository.save(post));
    }

    @Override
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll().stream().map(this::toPostResponse).toList();
    }

    @Override
    public CommentResponse createComment(Long postId, CommentCreateRequest request) {
        User author = getCurrentUser();
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));

        Comment parent = null;
        if (request.getParentCommentId() != null) {
            parent = commentRepository.findById(request.getParentCommentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found"));
        }

        Comment comment = Comment.builder()
                .post(post)
                .author(author)
                .parentComment(parent)
                .content(request.getContent())
                .build();

        return toCommentResponse(commentRepository.save(comment));
    }

    @Override
    public List<CommentResponse> getPostComments(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("Post not found"));
        return commentRepository.findByPost(post).stream().map(this::toCommentResponse).toList();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private PostResponse toPostResponse(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorId(post.getAuthor().getId())
                .authorName(post.getAuthor().getFullName())
                .createdAt(post.getCreatedAt())
                .build();
    }

    private CommentResponse toCommentResponse(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPost().getId())
                .authorId(comment.getAuthor().getId())
                .authorName(comment.getAuthor().getFullName())
                .parentCommentId(comment.getParentComment() == null ? null : comment.getParentComment().getId())
                .content(comment.getContent())
                .createdAt(comment.getCreatedAt())
                .build();
    }
}
