package com.educonnect.backend.repository;

import com.educonnect.backend.entity.MentorshipRequest;
import com.educonnect.backend.entity.MentorshipSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MentorshipSessionRepository extends JpaRepository<MentorshipSession, Long> {
    List<MentorshipSession> findByMentorshipRequest(MentorshipRequest mentorshipRequest);
}
