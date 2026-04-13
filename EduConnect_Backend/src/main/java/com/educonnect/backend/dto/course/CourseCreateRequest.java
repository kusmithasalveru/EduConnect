package com.educonnect.backend.dto.course;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CourseCreateRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String description;
}
