package com.homeopathy.college.constants;

public class SecurityConstants {

    public static final String TOKEN_HEADER = "Authorization";
    public static final String TOKEN_PREFIX = "Bearer ";

    public static final String[] PUBLIC_URLS = {
            "/auth/**",
            "/api/v1/auth/**",
            "/health",
            "/api/v1/health",
            "/v3/api-docs/**",
            "/api/v1/v3/api-docs/**",
            "/swagger-ui/**",
            "/api/v1/swagger-ui/**",
            "/swagger-ui.html",
            "/api/v1/swagger-ui.html",
            "/error",
            "/api/v1/error"
    };
}
