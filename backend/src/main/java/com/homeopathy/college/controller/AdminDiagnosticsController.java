package com.homeopathy.college.controller;

import com.google.api.services.drive.model.File;
import com.homeopathy.college.service.GoogleDriveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/diagnostics")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Admin Diagnostics", description = "System and integration diagnostic endpoints for administrators")
public class AdminDiagnosticsController {

    private final GoogleDriveService googleDriveService;

    @GetMapping("/google-drive")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Diagnostic endpoint for verifying Google Drive connection and folder access")
    public ResponseEntity<Map<String, Object>> checkGoogleDriveDiagnostic() {
        Map<String, Object> response = new LinkedHashMap<>();
        boolean isConfigured = googleDriveService.isConfigured();
        response.put("configured", isConfigured);

        if (!isConfigured) {
            response.put("authenticated", false);
            response.put("folderAccessible", false);
            response.put("status", "FAILED");
            return ResponseEntity.ok(response);
        }

        try {
            File folder = googleDriveService.getFolderMetadata(null);
            if (folder != null && folder.getId() != null) {
                response.put("authenticated", true);
                response.put("folderAccessible", true);
                response.put("status", "CONNECTED");
            } else {
                response.put("authenticated", true);
                response.put("folderAccessible", false);
                response.put("status", "FAILED");
            }
        } catch (Exception e) {
            log.error("[AdminDiagnostics] Google Drive check error: {}", e.getMessage());
            response.put("authenticated", false);
            response.put("folderAccessible", false);
            response.put("status", "FAILED");
        }

        return ResponseEntity.ok(response);
    }
}
