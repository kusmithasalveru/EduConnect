package com.educonnect.backend.dto.mentorship;

import com.educonnect.backend.entity.MentorshipStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MentorshipRequestResponse {
    private Long id;
    private Long studentId;
    private String studentName;
    private Long mentorId;
    private String mentorName;
    private String message;
    private MentorshipStatus status;
    private LocalDateTime createdAt;
}
