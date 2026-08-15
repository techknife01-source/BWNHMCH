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
@RequestMapping("/faculty")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Faculty Management", description = "Endpoints for managing faculty directory and photo uploads")
public class FacultyController {

    private final FacultyService facultyService;

    @GetMapping
    @Operation(summary = "Get all faculty members")
    public ResponseEntity<ApiResponse<List<Faculty>>> getAllFaculty() {
        List<Faculty> facultyList = facultyService.getAllFaculty();
        return ResponseEntity.ok(ApiResponse.success(facultyList, "Faculty members retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get faculty member by ID")
    public ResponseEntity<ApiResponse<Faculty>> getFacultyById(@PathVariable("id") String id) {
        Faculty faculty = facultyService.getFacultyById(id);
        return ResponseEntity.ok(ApiResponse.success(faculty, "Faculty member retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Create a new faculty member")
    public ResponseEntity<ApiResponse<Faculty>> createFaculty(@RequestBody Faculty faculty) {
        Faculty created = facultyService.createFaculty(faculty);
        return ResponseEntity.ok(ApiResponse.success(created, "Faculty member created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Update an existing faculty member")
    public ResponseEntity<ApiResponse<Faculty>> updateFaculty(
            @PathVariable("id") String id,
            @RequestBody Faculty faculty) {
        Faculty updated = facultyService.updateFaculty(id, faculty);
        return ResponseEntity.ok(ApiResponse.success(updated, "Faculty member updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Delete faculty member and photo")
    public ResponseEntity<ApiResponse<Void>> deleteFaculty(@PathVariable("id") String id) {
        facultyService.deleteFaculty(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Faculty member deleted"));
    }

    @PostMapping(value = "/{facultyId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Upload photo for faculty member to Google Drive")
    public ResponseEntity<ApiResponse<Faculty>> uploadFacultyPhoto(
            @PathVariable("facultyId") String facultyId,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "file", required = false) MultipartFile filePart) {

        MultipartFile targetFile = (photo != null && !photo.isEmpty()) ? photo : filePart;
        log.info("[FACULTY PHOTO API] Received photo upload request for facultyId='{}'", facultyId);
        Faculty updated = facultyService.uploadFacultyPhoto(facultyId, targetFile);
        return ResponseEntity.ok(ApiResponse.success(updated, "Faculty photo uploaded and saved successfully"));
    }

    @GetMapping("/{facultyId}/photo")
    @Operation(summary = "Stream faculty photo from Google Drive (Public Endpoint)")
    public ResponseEntity<InputStreamResource> streamFacultyPhoto(@PathVariable("facultyId") String facultyId) {
        log.info("[FACULTY PHOTO API] Streaming photo for facultyId='{}'", facultyId);
        FacultyService.FacultyPhotoStream photoStream = facultyService.getFacultyPhotoStream(facultyId);

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
