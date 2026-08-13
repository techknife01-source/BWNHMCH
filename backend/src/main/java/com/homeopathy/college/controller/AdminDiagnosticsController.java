package com.homeopathy.college.controller;

import com.google.api.services.drive.model.File;
import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.service.GoogleDriveService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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

    @Value("${google.drive.folder-id:}")
    private String folderId;

    @Value("${google.drive.client-email:}")
    private String clientEmail;

    @Value("${google.drive.private-key:}")
    private String privateKey;

    @GetMapping("/google-drive")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(summary = "Diagnostic endpoint for verifying Google Drive configuration and folder access")
    public ResponseEntity<ApiResponse<Map<String, Object>>> checkGoogleDriveDiagnostic() {
        Map<String, Object> data = new LinkedHashMap<>();

        boolean clientConfigured = clientEmail != null && !clientEmail.isBlank();
        boolean privateKeyConfigured = privateKey != null && !privateKey.isBlank();
        boolean folderConfigured = folderId != null && !folderId.isBlank();
        boolean configured = clientConfigured && privateKeyConfigured;

        data.put("configured", configured);
        data.put("folderConfigured", folderConfigured);
        data.put("clientConfigured", clientConfigured);
        data.put("privateKeyConfigured", privateKeyConfigured);

        boolean folderAccessible = false;
        if (configured && folderConfigured) {
            try {
                File folder = googleDriveService.getFolderMetadata(folderId);
                if (folder != null && folder.getId() != null) {
                    folderAccessible = true;
                }
            } catch (Exception e) {
                log.error("[AdminDiagnostics] Google Drive folder check failed: {}", e.getMessage());
            }
        }
        data.put("folderAccessible", folderAccessible);

        return ResponseEntity.ok(ApiResponse.success(data, "Google Drive diagnostic status retrieved"));
    }
}
