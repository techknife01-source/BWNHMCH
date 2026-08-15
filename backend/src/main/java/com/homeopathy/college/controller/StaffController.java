package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.entity.Faculty;
import com.homeopathy.college.service.FacultyService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/staff")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Hospital & Faculty Staff Management", description = "Endpoints for managing hospital staff directory and photo uploads")
public class StaffController {

    private final FacultyService facultyService;

    @GetMapping
    @Operation(summary = "Get all staff members")
    public ResponseEntity<ApiResponse<List<Faculty>>> getAllStaff() {
        log.info("[STAFF_API] GET /staff request received");
        List<Faculty> staffList = facultyService.getAllFaculty();
        return ResponseEntity.ok(ApiResponse.success(staffList, "Staff members retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get staff member by ID")
    public ResponseEntity<ApiResponse<Faculty>> getStaffById(@PathVariable("id") String id) {
        log.info("[STAFF_API] GET /staff/{} request received", id);
        Faculty staff = facultyService.getFacultyById(id);
        return ResponseEntity.ok(ApiResponse.success(staff, "Staff member retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Create a new staff member")
    public ResponseEntity<ApiResponse<Faculty>> createStaff(@RequestBody Faculty staff) {
        log.info("[STAFF_API] POST /staff request received for '{}'", staff.getName());
        Faculty created = facultyService.createFaculty(staff);
        return ResponseEntity.ok(ApiResponse.success(created, "Staff member created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Update an existing staff member")
    public ResponseEntity<ApiResponse<Faculty>> updateStaff(
            @PathVariable("id") String id,
            @RequestBody Faculty staff) {
        log.info("[STAFF_API] PUT /staff/{} request received", id);
        Faculty updated = facultyService.updateFaculty(id, staff);
        return ResponseEntity.ok(ApiResponse.success(updated, "Staff member updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Delete staff member and photo")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable("id") String id) {
        log.info("[STAFF_API] DELETE /staff/{} request received", id);
        facultyService.deleteFaculty(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Staff member deleted successfully"));
    }

    @PostMapping(value = "/{staffId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Upload photo for staff member to Google Drive")
    public ResponseEntity<ApiResponse<Faculty>> uploadStaffPhoto(
            @PathVariable("staffId") String staffId,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "file", required = false) MultipartFile filePart) {

        MultipartFile targetFile = (photo != null && !photo.isEmpty()) ? photo : filePart;
        log.info("[STAFF_API] POST /staff/{}/photo request received", staffId);
        Faculty updated = facultyService.uploadFacultyPhoto(staffId, targetFile);
        return ResponseEntity.ok(ApiResponse.success(updated, "Staff photo uploaded and saved successfully"));
    }

    @GetMapping("/{staffId}/photo")
    @Operation(summary = "Stream staff photo from Google Drive (Public Endpoint)")
    public ResponseEntity<InputStreamResource> streamStaffPhoto(@PathVariable("staffId") String staffId) {
        log.info("[STAFF_API] GET /staff/{}/photo request received", staffId);
        FacultyService.FacultyPhotoStream photoStream = facultyService.getFacultyPhotoStream(staffId);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(photoStream.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.IMAGE_JPEG;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000, immutable")
                .contentType(mediaType)
                .body(new InputStreamResource(photoStream.getInputStream()));
    }
}
