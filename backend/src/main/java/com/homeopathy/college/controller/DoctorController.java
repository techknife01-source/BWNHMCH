package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.entity.Doctor;
import com.homeopathy.college.service.DoctorService;
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
@RequestMapping({"/doctors", "/api/v1/doctors"})
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Doctors Management", description = "Endpoints for managing doctor directory and photo uploads")
public class DoctorController {

    private final DoctorService doctorService;

    @GetMapping
    @Operation(summary = "Get all doctor members")
    public ResponseEntity<ApiResponse<List<Doctor>>> getAllDoctors() {
        log.info("[DOCTOR_API] GET /doctors request received");
        List<Doctor> doctorList = doctorService.getAllDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctorList, "Doctor records retrieved successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get doctor record by ID")
    public ResponseEntity<ApiResponse<Doctor>> getDoctorById(@PathVariable("id") String id) {
        log.info("[DOCTOR_API] GET /doctors/{} request received", id);
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor, "Doctor record retrieved successfully"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Create a new doctor record")
    public ResponseEntity<ApiResponse<Doctor>> createDoctor(@RequestBody Doctor doctor) {
        log.info("[DOCTOR_API] POST /doctors request received for '{}'", doctor.getName());
        Doctor created = doctorService.createDoctor(doctor);
        return ResponseEntity.ok(ApiResponse.success(created, "Doctor record created successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Update an existing doctor record")
    public ResponseEntity<ApiResponse<Doctor>> updateDoctor(@PathVariable("id") String id, @RequestBody Doctor doctor) {
        log.info("[DOCTOR_API] PUT /doctors/{} request received", id);
        Doctor updated = doctorService.updateDoctor(id, doctor);
        return ResponseEntity.ok(ApiResponse.success(updated, "Doctor record updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Delete a doctor record")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable("id") String id) {
        log.info("[DOCTOR_API] DELETE /doctors/{} request received", id);
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Doctor record deleted successfully"));
    }

    @PostMapping("/{doctorId}/photo")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Upload photo for a doctor record")
    public ResponseEntity<ApiResponse<Doctor>> uploadDoctorPhoto(
            @PathVariable("doctorId") String doctorId,
            @RequestParam(value = "photo", required = false) MultipartFile photoFile,
            @RequestPart(value = "file", required = false) MultipartFile multipartFile) {
        MultipartFile fileToUpload = photoFile != null ? photoFile : multipartFile;
        log.info("[DOCTOR_API] POST /doctors/{}/photo request received", doctorId);
        Doctor updated = doctorService.uploadDoctorPhoto(doctorId, fileToUpload);
        return ResponseEntity.ok(ApiResponse.success(updated, "Doctor photo uploaded successfully"));
    }

    @GetMapping("/{doctorId}/photo")
    @Operation(summary = "Get photo for a doctor record")
    public ResponseEntity<InputStreamResource> getDoctorPhoto(@PathVariable("doctorId") String doctorId) {
        log.info("[DOCTOR_API] GET /doctors/{}/photo request received", doctorId);
        DoctorService.DoctorPhotoStream photoStream = doctorService.getDoctorPhotoStream(doctorId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, photoStream.getMimeType())
                .body(new InputStreamResource(photoStream.getInputStream()));
    }
}
