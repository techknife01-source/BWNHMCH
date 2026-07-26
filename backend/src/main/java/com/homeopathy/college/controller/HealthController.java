package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.constants.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping
@Tag(name = "System Health & Status", description = "Liveness and Readiness Probe Endpoint")
public class HealthController {

    @GetMapping("/health")
    @Operation(summary = "Check backend microservice health & environment details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Smart Homeopathic Medical College Backend API");
        status.put("institution", AppConstants.INSTITUTION_NAME);
        status.put("estd", AppConstants.INSTITUTION_ESTD);
        status.put("timestamp", LocalDateTime.now().toString());

        return ResponseEntity.ok(ApiResponse.success(status, "Backend service is healthy and operating normally"));
    }
}
