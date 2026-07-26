package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.dto.request.ForgotPasswordRequest;
import com.homeopathy.college.dto.request.LoginRequest;
import com.homeopathy.college.dto.request.RefreshTokenRequest;
import com.homeopathy.college.dto.request.RegisterRequest;
import com.homeopathy.college.dto.request.ResetPasswordRequest;
import com.homeopathy.college.dto.response.JwtAuthResponse;
import com.homeopathy.college.dto.response.UserResponse;
import com.homeopathy.college.entity.RefreshToken;
import com.homeopathy.college.entity.User;
import com.homeopathy.college.exception.BadRequestException;
import com.homeopathy.college.exception.DuplicateResourceException;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.exception.TokenRefreshException;
import com.homeopathy.college.mapper.UserMapper;
import com.homeopathy.college.repository.RefreshTokenRepository;
import com.homeopathy.college.repository.UserRepository;
import com.homeopathy.college.security.JwtTokenProvider;
import com.homeopathy.college.security.UserPrincipal;
import com.homeopathy.college.service.AuthService;
import com.homeopathy.college.service.MailService;
import com.homeopathy.college.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserMapper userMapper;
    private final MailService mailService;

    @Value("${app.jwt.refresh-expiration-ms:604800000}")
    private long refreshTokenExpirationMs;

    @Override
    @Transactional
    public JwtAuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));

        RefreshToken refreshToken = createRefreshToken(user.getId());

        return JwtAuthResponse.builder()
                .accessToken(jwt)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .avatar(user.getAvatar())
                .department(user.getDepartment())
                .roles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()))
                .build();
    }

    @Override
    @Transactional
    public UserResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new DuplicateResourceException("Username '" + registerRequest.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new DuplicateResourceException("Email '" + registerRequest.getEmail() + "' is already registered");
        }

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .fullName(registerRequest.getFullName())
                .phoneNumber(registerRequest.getPhoneNumber())
                .department(registerRequest.getDepartment())
                .registrationNo(registerRequest.getRegistrationNo())
                .roles(registerRequest.getRoles())
                .enabled(true)
                .accountNonLocked(true)
                .build();

        User savedUser = userRepository.save(user);

        try {
            mailService.sendWelcomeEmail(savedUser.getEmail(), savedUser.getFullName(), savedUser.getRoles().iterator().next().name());
        } catch (Exception e) {
            log.error("Failed to send welcome email to: {}", savedUser.getEmail(), e);
        }

        return userMapper.toUserResponse(savedUser);
    }

    @Override
    @Transactional
    public JwtAuthResponse refreshToken(RefreshTokenRequest request) {
        String requestRefreshToken = request.getRefreshToken();

        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUserId)
                .map(userId -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    
                    UserPrincipal principal = UserPrincipal.create(user);
                    Authentication auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                    
                    String token = tokenProvider.generateToken(auth);
                    return JwtAuthResponse.builder()
                            .accessToken(token)
                            .refreshToken(requestRefreshToken)
                            .tokenType("Bearer")
                            .userId(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .fullName(user.getFullName())
                            .avatar(user.getAvatar())
                            .department(user.getDepartment())
                            .roles(user.getRoles().stream().map(Enum::name).collect(Collectors.toSet()))
                            .build();
                })
                .orElseThrow(() -> new TokenRefreshException(requestRefreshToken, "Refresh token is not in database!"));
    }

    @Override
    @Transactional
    public void logout(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        String otp = OtpUtil.generate6DigitOtp();
        user.setOtpSecret(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);

        mailService.sendOtpEmail(user.getEmail(), otp);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", request.getEmail()));

        if (user.getOtpSecret() == null || !user.getOtpSecret().equals(request.getOtp())) {
            throw new BadRequestException("Invalid or expired OTP code");
        }

        if (user.getOtpExpiry() != null && LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new BadRequestException("OTP code has expired. Please request a new one.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtpSecret(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        mailService.sendPasswordResetConfirmation(user.getEmail());
    }

    @Override
    public UserResponse getCurrentUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
        return userMapper.toUserResponse(user);
    }

    private RefreshToken createRefreshToken(String userId) {
        refreshTokenRepository.deleteByUserId(userId);

        RefreshToken refreshToken = RefreshToken.builder()
                .userId(userId)
                .token(UUID.randomUUID().toString())
                .expiryDate(Instant.now().plusMillis(refreshTokenExpirationMs))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().compareTo(Instant.now()) < 0) {
            refreshTokenRepository.delete(token);
            throw new TokenRefreshException(token.getToken(), "Refresh token was expired. Please make a new signin request");
        }
        return token;
    }
}
