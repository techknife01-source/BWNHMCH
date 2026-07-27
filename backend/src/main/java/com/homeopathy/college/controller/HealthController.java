package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.constants.AppConstants;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping
@RequiredArgsConstructor
@Slf4j
@Tag(name = "System Health & Status", description = "Liveness and Readiness Probe Endpoint")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    @GetMapping("/health")
    @Operation(summary = "Check backend microservice health & environment details")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealthStatus() {
        Map<String, Object> status = new HashMap<>();
        status.put("status", "UP");
        status.put("service", "Smart Homeopathic Medical College Backend API");
        status.put("institution", AppConstants.INSTITUTION_NAME);
        status.put("estd", AppConstants.INSTITUTION_ESTD);
        status.put("timestamp", LocalDateTime.now().toString());

        try {
            mongoTemplate.executeCommand(new Document("ping", 1));
            status.put("database", "MongoDB Connected");
            status.put("databaseStatus", "UP");
        } catch (Exception e) {
            log.warn("Health check MongoDB ping failed: {}", e.getMessage());
            if (e.getMessage() != null && (e.getMessage().contains("auth") || e.getMessage().contains("Authentication"))) {
                status.put("database", "MongoDB Authentication Failed");
            } else {
                status.put("database", "MongoDB Connection Failed");
            }
            status.put("databaseStatus", "DOWN");
            status.put("databaseError", e.getMessage());
        }

        return ResponseEntity.ok(ApiResponse.success(status, "Backend health status check complete"));
    }
}
