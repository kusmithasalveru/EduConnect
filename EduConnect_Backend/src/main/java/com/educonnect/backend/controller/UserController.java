package com.educonnect.backend.controller;

import com.educonnect.backend.dto.user.UpdateProfileRequest;
import com.educonnect.backend.dto.user.UploadProfileImageResponse;
import com.educonnect.backend.dto.user.UserResponse;
import com.educonnect.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMyProfile() {
        return ResponseEntity.ok(userService.getMyProfile());
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateMyProfile(request));
    }

    @PostMapping(value = "/upload-profile-pic", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadProfileImageResponse> uploadProfileImage(@RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadProfileImage(file));
    }
}
