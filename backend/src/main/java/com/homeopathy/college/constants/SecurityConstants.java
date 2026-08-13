package com.homeopathy.college.constants;

public class SecurityConstants {

    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";

    public static final String[] PUBLIC_URLS = {
            "/auth/login",
            "/auth/register",
            "/auth/refresh",
            "/auth/forgot-password",
            "/auth/reset-password",
            "/api/v1/auth/login",
            "/api/v1/auth/register",
            "/api/v1/auth/refresh",
            "/api/v1/auth/forgot-password",
            "/api/v1/auth/reset-password",
            "/health",
            "/api/v1/health",
            "/actuator/health",
            "/api/v1/actuator/health",
            "/v3/api-docs/**",
            "/api/v1/v3/api-docs/**",
            "/swagger-ui/**",
            "/api/v1/swagger-ui/**",
            "/swagger-ui.html",
            "/api/v1/swagger-ui.html",
            "/documents/**",
            "/api/v1/documents/**",
            "/downloads/**",
            "/api/v1/downloads/**",
            "/error",
            "/api/v1/error"
    };
}
