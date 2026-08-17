package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.entity.Staff;
import com.homeopathy.college.service.StaffService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
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
@RequestMapping({"/staff", "/api/v1/staff"})
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Hospital & Faculty Staff Management", description = "Endpoints for managing hospital staff directory and photo uploads")
public class StaffController {

    private final StaffService staffService;

    @GetMapping
    @Operation(summary = "Get all staff members")
    public ResponseEntity<ApiResponse<List<Staff>>> getAllStaff() {
        log.info("[STAFF_API] GET /staff request received");
        List<Staff> staffList = staffService.getAllStaff();
        return ResponseEntity.ok(ApiResponse.success(staffList, "Staff members retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get staff member by ID")
    public ResponseEntity<ApiResponse<Staff>> getStaffById(@PathVariable("id") String id) {
        log.info("[STAFF_API] GET /staff/{} request received", id);
        Staff staff = staffService.getStaffById(id);
        return ResponseEntity.ok(ApiResponse.success(staff, "Staff member retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Create a new staff member")
    public ResponseEntity<ApiResponse<Staff>> createStaff(@RequestBody Staff staff) {
        log.info("[STAFF_API] POST /staff request received for '{}'", staff.getName());
        Staff created = staffService.createStaff(staff);
        return ResponseEntity.ok(ApiResponse.success(created, "Staff member created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Update an existing staff member")
    public ResponseEntity<ApiResponse<Staff>> updateStaff(
            @PathVariable("id") String id,
            @RequestBody Staff staff) {
        log.info("[STAFF_API] PUT /staff/{} request received", id);
        Staff updated = staffService.updateStaff(id, staff);
        return ResponseEntity.ok(ApiResponse.success(updated, "Staff member updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Delete staff member and photo")
    public ResponseEntity<ApiResponse<Void>> deleteStaff(@PathVariable("id") String id) {
        log.info("[STAFF_API] DELETE /staff/{} request received", id);
        staffService.deleteStaff(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Staff member deleted successfully"));
    }

    @PostMapping(value = "/{staffId}/photo", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Upload photo for staff member")
    public ResponseEntity<ApiResponse<Staff>> uploadStaffPhoto(
            @PathVariable("staffId") String staffId,
            @RequestParam(value = "photo", required = false) MultipartFile photo,
            @RequestPart(value = "file", required = false) MultipartFile filePart) {

        MultipartFile targetFile = (photo != null && !photo.isEmpty()) ? photo : filePart;
        log.info("[STAFF_API] POST /staff/{}/photo request received", staffId);
        Staff updated = staffService.uploadStaffPhoto(staffId, targetFile);
        return ResponseEntity.ok(ApiResponse.success(updated, "Staff photo uploaded and saved successfully"));
    }

    @DeleteMapping("/{staffId}/photo")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Delete photo for staff member")
    public ResponseEntity<ApiResponse<Void>> deleteStaffPhoto(@PathVariable("staffId") String staffId) {
        log.info("[STAFF_API] DELETE /staff/{}/photo request received", staffId);
        staffService.deleteStaffPhoto(staffId);
        return ResponseEntity.ok(ApiResponse.success(null, "Staff photo deleted successfully"));
    }
}
