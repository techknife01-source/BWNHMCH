package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.dto.request.ForgotPasswordRequest;
import com.homeopathy.college.dto.request.LoginRequest;
import com.homeopathy.college.dto.request.RefreshTokenRequest;
import com.homeopathy.college.dto.request.RegisterRequest;
import com.homeopathy.college.dto.request.ResetPasswordRequest;
import com.homeopathy.college.dto.response.JwtAuthResponse;
import com.homeopathy.college.dto.response.UserResponse;
import com.homeopathy.college.security.UserPrincipal;
import com.homeopathy.college.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication & Authorization Gateway", description = "Endpoints for User Login, Registration, JWT Refresh, OTP Password Reset")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT + Refresh Tokens")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtAuthResponse response = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.success(response, "User authenticated successfully"));
    }

    @PostMapping("/register")
    @Operation(summary = "Register a new user account with assigned role")
    public ResponseEntity<ApiResponse<UserResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserResponse response = authService.register(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "User account registered successfully"));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Renew expired Access Token using valid Refresh Token")
    public ResponseEntity<ApiResponse<JwtAuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        JwtAuthResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Token refreshed successfully"));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke user Refresh Token and terminate session")
    public ResponseEntity<ApiResponse<Void>> logout(@AuthenticationPrincipal UserPrincipal currentUser) {
        authService.logout(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(null, "User logged out successfully"));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Trigger OTP email for password reset workflow")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset OTP dispatched to email"));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Verify OTP code and update user password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.success(null, "Password reset successfully"));
    }

    @GetMapping("/me")
    @Operation(summary = "Fetch current authenticated user profile")
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(@AuthenticationPrincipal UserPrincipal currentUser) {
        log.info("[AUTH] /me request");
        boolean tokenPresent = currentUser != null;
        log.info("[AUTH] Token present: {}", tokenPresent);
        if (currentUser == null) {
            log.info("[AUTH] Token missing or invalid for /me request");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error("Unauthorized access: missing or invalid token"));
        }
        log.info("[AUTH] Token verified");
        log.info("[AUTH] User lookup completed");
        UserResponse response = authService.getCurrentUser(currentUser.getId());
        return ResponseEntity.ok(ApiResponse.success(response, "Profile retrieved successfully"));
    }
}
