package com.educonnect.backend.dto.user;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UploadProfileImageResponse {
    private String profileImageUrl;
}
