package com.educonnect.backend.service.impl;

import com.educonnect.backend.dto.mentorship.*;
import com.educonnect.backend.entity.*;
import com.educonnect.backend.exception.BadRequestException;
import com.educonnect.backend.exception.ResourceNotFoundException;
import com.educonnect.backend.repository.MentorshipRequestRepository;
import com.educonnect.backend.repository.MentorshipSessionRepository;
import com.educonnect.backend.repository.UserRepository;
import com.educonnect.backend.service.MentorshipService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MentorshipServiceImpl implements MentorshipService {

    private final MentorshipRequestRepository mentorshipRequestRepository;
    private final MentorshipSessionRepository mentorshipSessionRepository;
    private final UserRepository userRepository;

    @Override
    public MentorshipRequestResponse requestMentorship(MentorshipRequestCreateRequest request) {
        User student = getCurrentUser();
        if (student.getRole() != Role.STUDENT) {
            throw new BadRequestException("Only students can request mentorship");
        }

        User mentor = userRepository.findById(request.getMentorId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentor not found"));
        if (mentor.getRole() != Role.MENTOR) {
            throw new BadRequestException("Selected user is not a mentor");
        }

        MentorshipRequest entity = MentorshipRequest.builder()
                .student(student)
                .mentor(mentor)
                .message(request.getMessage())
                .status(MentorshipStatus.PENDING)
                .build();

        return toResponse(mentorshipRequestRepository.save(entity));
    }

    @Override
    public MentorshipRequestResponse decideRequest(Long requestId, MentorshipDecisionRequest request) {
        MentorshipRequest entity = mentorshipRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship request not found"));

        User mentor = getCurrentUser();
        if (!entity.getMentor().getId().equals(mentor.getId())) {
            throw new BadRequestException("Only assigned mentor can decide");
        }
        if (request.getStatus() == MentorshipStatus.PENDING) {
            throw new BadRequestException("Decision cannot be PENDING");
        }

        entity.setStatus(request.getStatus());
        return toResponse(mentorshipRequestRepository.save(entity));
    }

    @Override
    public MentorshipSessionResponse createSession(MentorshipSessionCreateRequest request) {
        User mentor = getCurrentUser();
        MentorshipRequest mentorshipRequest = mentorshipRequestRepository.findById(request.getMentorshipRequestId())
                .orElseThrow(() -> new ResourceNotFoundException("Mentorship request not found"));

        if (!mentorshipRequest.getMentor().getId().equals(mentor.getId())) {
            throw new BadRequestException("Only assigned mentor can create session");
        }
        if (mentorshipRequest.getStatus() != MentorshipStatus.ACCEPTED) {
            throw new BadRequestException("Request must be accepted first");
        }

        MentorshipSession session = MentorshipSession.builder()
                .mentorshipRequest(mentorshipRequest)
                .scheduledAt(request.getScheduledAt())
                .notes(request.getNotes())
                .build();

        MentorshipSession saved = mentorshipSessionRepository.save(session);
        return MentorshipSessionResponse.builder()
                .id(saved.getId())
                .mentorshipRequestId(saved.getMentorshipRequest().getId())
                .scheduledAt(saved.getScheduledAt())
                .notes(saved.getNotes())
                .build();
    }

    @Override
    public List<MentorshipRequestResponse> getMyMentorshipRequests() {
        User current = getCurrentUser();
        List<MentorshipRequest> requests = current.getRole() == Role.STUDENT
                ? mentorshipRequestRepository.findByStudent(current)
                : mentorshipRequestRepository.findByMentor(current);

        return requests.stream().map(this::toResponse).toList();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private MentorshipRequestResponse toResponse(MentorshipRequest entity) {
        return MentorshipRequestResponse.builder()
                .id(entity.getId())
                .studentId(entity.getStudent().getId())
                .studentName(entity.getStudent().getFullName())
                .mentorId(entity.getMentor().getId())
                .mentorName(entity.getMentor().getFullName())
                .message(entity.getMessage())
                .status(entity.getStatus())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
