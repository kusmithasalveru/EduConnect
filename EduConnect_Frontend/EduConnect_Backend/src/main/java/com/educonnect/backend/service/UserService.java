package com.educonnect.backend.service;

import com.educonnect.backend.dto.user.UpdateProfileRequest;
import com.educonnect.backend.dto.user.UploadProfileImageResponse;
import com.educonnect.backend.dto.user.UserResponse;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    UserResponse getMyProfile();
    UserResponse updateMyProfile(UpdateProfileRequest request);
    UploadProfileImageResponse uploadProfileImage(MultipartFile file);
}
