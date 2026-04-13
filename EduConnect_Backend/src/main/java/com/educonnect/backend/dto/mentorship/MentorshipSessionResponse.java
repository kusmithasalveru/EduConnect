package com.educonnect.backend.dto.mentorship;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MentorshipSessionResponse {
    private Long id;
    private Long mentorshipRequestId;
    private LocalDateTime scheduledAt;
    private String notes;
}
