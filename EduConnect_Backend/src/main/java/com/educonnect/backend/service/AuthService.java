package com.educonnect.backend.service;

import com.educonnect.backend.dto.auth.AuthResponse;
import com.educonnect.backend.dto.auth.LoginRequest;
import com.educonnect.backend.dto.auth.RegisterRequest;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
}
