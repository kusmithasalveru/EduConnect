package com.educonnect.backend.service;

import com.educonnect.backend.dto.mentorship.*;

import java.util.List;

public interface MentorshipService {
    MentorshipRequestResponse requestMentorship(MentorshipRequestCreateRequest request);
    MentorshipRequestResponse decideRequest(Long requestId, MentorshipDecisionRequest request);
    MentorshipSessionResponse createSession(MentorshipSessionCreateRequest request);
    List<MentorshipRequestResponse> getMyMentorshipRequests();
}
