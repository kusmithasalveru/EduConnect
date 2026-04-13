package com.educonnect.backend.repository;

import com.educonnect.backend.entity.Comment;
import com.educonnect.backend.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByPost(Post post);
}
