package com.educonnect.backend.dto.mentorship;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MentorshipSessionCreateRequest {
    @NotNull
    private Long mentorshipRequestId;

    @NotNull
    @Future
    private LocalDateTime scheduledAt;

    @NotBlank
    private String notes;
}
