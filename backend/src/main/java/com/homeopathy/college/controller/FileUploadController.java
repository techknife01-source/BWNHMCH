package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.service.CloudinaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/files")
@RequiredArgsConstructor
@Tag(name = "Cloud Media & Document Service", description = "Endpoints for uploading & removing files via Cloudinary CDN")
public class FileUploadController {

    private final CloudinaryService cloudinaryService;

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Upload image or document to Cloudinary CDN")
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadFile(
            @RequestPart("file") MultipartFile file,
            @RequestParam(value = "folder", required = false, defaultValue = "documents") String folder) {

        Map<String, Object> uploadResult = cloudinaryService.uploadFile(file, folder);
        return ResponseEntity.ok(ApiResponse.success(uploadResult, "File uploaded successfully"));
    }

    @DeleteMapping("/delete")
    @Operation(summary = "Delete file from Cloudinary CDN by public ID")
    public ResponseEntity<ApiResponse<Map<String, Object>>> deleteFile(@RequestParam("publicId") String publicId) {
        Map<String, Object> result = cloudinaryService.deleteFile(publicId);
        return ResponseEntity.ok(ApiResponse.success(result, "File deleted successfully"));
    }
}
