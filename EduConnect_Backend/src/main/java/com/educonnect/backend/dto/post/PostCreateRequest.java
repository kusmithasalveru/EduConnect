package com.educonnect.backend.dto.post;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class PostCreateRequest {
    @NotBlank
    private String title;
    @NotBlank
    private String content;
}
