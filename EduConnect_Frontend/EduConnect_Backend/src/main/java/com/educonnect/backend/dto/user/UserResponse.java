package com.educonnect.backend.dto.user;

import com.educonnect.backend.entity.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private Role role;
    private Integer trustScore;
    private String bio;
    private String profileImage;
}
