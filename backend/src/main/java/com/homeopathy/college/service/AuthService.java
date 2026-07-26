package com.homeopathy.college.service;

import com.homeopathy.college.dto.request.ForgotPasswordRequest;
import com.homeopathy.college.dto.request.LoginRequest;
import com.homeopathy.college.dto.request.RefreshTokenRequest;
import com.homeopathy.college.dto.request.RegisterRequest;
import com.homeopathy.college.dto.request.ResetPasswordRequest;
import com.homeopathy.college.dto.response.JwtAuthResponse;
import com.homeopathy.college.dto.response.UserResponse;

public interface AuthService {

    JwtAuthResponse login(LoginRequest loginRequest);

    UserResponse register(RegisterRequest registerRequest);

    JwtAuthResponse refreshToken(RefreshTokenRequest refreshTokenRequest);

    void logout(String userId);

    void forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);

    UserResponse getCurrentUser(String userId);
}
