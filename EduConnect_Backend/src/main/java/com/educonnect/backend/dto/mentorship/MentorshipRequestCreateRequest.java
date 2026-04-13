package com.educonnect.backend.dto.mentorship;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MentorshipRequestCreateRequest {
    @NotNull
    private Long mentorId;
    @NotBlank
    private String message;
}
