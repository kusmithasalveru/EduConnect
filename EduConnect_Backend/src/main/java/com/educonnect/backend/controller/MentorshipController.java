package com.educonnect.backend.controller;

import com.educonnect.backend.dto.mentorship.*;
import com.educonnect.backend.service.MentorshipService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mentorship")
@RequiredArgsConstructor
public class MentorshipController {

    private final MentorshipService mentorshipService;

    @PostMapping("/requests")
    public ResponseEntity<MentorshipRequestResponse> requestMentorship(@Valid @RequestBody MentorshipRequestCreateRequest request) {
        return ResponseEntity.ok(mentorshipService.requestMentorship(request));
    }

    @PutMapping("/requests/{requestId}/decision")
    public ResponseEntity<MentorshipRequestResponse> decide(@PathVariable Long requestId,
                                                            @Valid @RequestBody MentorshipDecisionRequest request) {
        return ResponseEntity.ok(mentorshipService.decideRequest(requestId, request));
    }

    @PostMapping("/sessions")
    public ResponseEntity<MentorshipSessionResponse> createSession(@Valid @RequestBody MentorshipSessionCreateRequest request) {
        return ResponseEntity.ok(mentorshipService.createSession(request));
    }

    @GetMapping("/requests/me")
    public ResponseEntity<List<MentorshipRequestResponse>> myRequests() {
        return ResponseEntity.ok(mentorshipService.getMyMentorshipRequests());
    }
}
