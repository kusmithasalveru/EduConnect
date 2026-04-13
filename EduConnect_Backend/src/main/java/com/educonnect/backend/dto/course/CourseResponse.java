package com.educonnect.backend.dto.course;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class CourseResponse {
    private Long id;
    private String title;
    private String description;
    private Long mentorId;
    private String mentorName;
    private Long enrolledCount;
}
