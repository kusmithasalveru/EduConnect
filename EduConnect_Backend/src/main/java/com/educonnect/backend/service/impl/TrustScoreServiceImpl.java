package com.educonnect.backend.service.impl;

import com.educonnect.backend.dto.trust.TrustScoreResponse;
import com.educonnect.backend.entity.User;
import com.educonnect.backend.exception.ResourceNotFoundException;
import com.educonnect.backend.repository.*;
import com.educonnect.backend.service.TrustScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrustScoreServiceImpl implements TrustScoreService {

    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final MentorshipRequestRepository mentorshipRequestRepository;
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;

    @Override
    public TrustScoreResponse recalculateForCurrentUser() {
        User user = getCurrentUser();

        int coursePoints = enrollmentRepository.findByStudent(user).size() * 10;
        int mentorshipPoints = (int) mentorshipRequestRepository.findByStudent(user).stream()
                .filter(r -> r.getStatus().name().equals("ACCEPTED"))
                .count() * 15;

        int postPoints = (int) postRepository.findAll().stream().filter(p -> p.getAuthor().getId().equals(user.getId())).count() * 5;
        int commentPoints = (int) commentRepository.findAll().stream().filter(c -> c.getAuthor().getId().equals(user.getId())).count() * 2;

        int total = coursePoints + mentorshipPoints + postPoints + commentPoints;
        user.setTrustScore(total);
        userRepository.save(user);

        return TrustScoreResponse.builder()
                .userId(user.getId())
                .trustScore(total)
                .rationale("Score = course(" + coursePoints + ") + mentorship(" + mentorshipPoints + ") + post(" + postPoints + ") + comment(" + commentPoints + ")")
                .build();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }
}
