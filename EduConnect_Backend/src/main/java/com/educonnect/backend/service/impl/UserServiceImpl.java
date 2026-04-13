package com.educonnect.backend.service.impl;

import com.educonnect.backend.dto.user.UpdateProfileRequest;
import com.educonnect.backend.dto.user.UploadProfileImageResponse;
import com.educonnect.backend.dto.user.UserResponse;
import com.educonnect.backend.entity.User;
import com.educonnect.backend.exception.ResourceNotFoundException;
import com.educonnect.backend.repository.UserRepository;
import com.educonnect.backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getMyProfile() {
        User user = getCurrentUser();
        return toResponse(user);
    }

    @Override
    public UserResponse updateMyProfile(UpdateProfileRequest request) {
        User user = getCurrentUser();
        user.setFullName(request.getFullName());
        user.setBio(request.getBio());
        userRepository.save(user);
        return toResponse(user);
    }

    @Override
    public UploadProfileImageResponse uploadProfileImage(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Profile image file is required");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        User user = getCurrentUser();
        String originalName = Objects.requireNonNullElse(file.getOriginalFilename(), "profile.jpg");
        String safeName = originalName.replaceAll("[^a-zA-Z0-9\\.\\-_]", "_");
        String filename = UUID.randomUUID() + "-" + safeName;

        Path uploadDir = Path.of("uploads", "profile-images").toAbsolutePath().normalize();
        Path target = uploadDir.resolve(filename);

        try {
            Files.createDirectories(uploadDir);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to upload profile image", e);
        }

        String profileImageUrl = "/uploads/profile-images/" + filename;
        user.setProfileImage(profileImageUrl);
        userRepository.save(user);

        return UploadProfileImageResponse.builder()
                .profileImageUrl(profileImageUrl)
                .build();
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    private UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .role(user.getRole())
                .trustScore(user.getTrustScore())
                .bio(user.getBio())
                .profileImage(user.getProfileImage())
                .build();
    }
}
