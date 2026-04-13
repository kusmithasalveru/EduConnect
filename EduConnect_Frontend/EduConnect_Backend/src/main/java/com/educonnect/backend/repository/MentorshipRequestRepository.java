package com.educonnect.backend.repository;

import com.educonnect.backend.entity.MentorshipRequest;
import com.educonnect.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MentorshipRequestRepository extends JpaRepository<MentorshipRequest, Long> {
    List<MentorshipRequest> findByStudent(User student);
    List<MentorshipRequest> findByMentor(User mentor);
}
