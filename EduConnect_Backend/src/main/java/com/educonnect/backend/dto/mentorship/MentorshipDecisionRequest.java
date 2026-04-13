package com.educonnect.backend.dto.mentorship;

import com.educonnect.backend.entity.MentorshipStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class MentorshipDecisionRequest {
    @NotNull
    private MentorshipStatus status;
}
