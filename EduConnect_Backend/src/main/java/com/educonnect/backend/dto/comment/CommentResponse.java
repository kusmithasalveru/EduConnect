package com.educonnect.backend.dto.comment;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class CommentResponse {
    private Long id;
    private Long postId;
    private Long authorId;
    private String authorName;
    private Long parentCommentId;
    private String content;
    private LocalDateTime createdAt;
}
