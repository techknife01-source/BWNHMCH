package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.entity.GalleryItem;
import com.homeopathy.college.service.GalleryService;
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
@RequestMapping("/gallery")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Gallery Management", description = "Endpoints for managing campus gallery items and image uploads")
public class GalleryController {

    private final GalleryService galleryService;

    @GetMapping
    @Operation(summary = "Get all gallery items")
    public ResponseEntity<ApiResponse<List<GalleryItem>>> getAllItems() {
        List<GalleryItem> items = galleryService.getAllItems();
        return ResponseEntity.ok(ApiResponse.success(items, "Gallery items retrieved"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get gallery item by ID")
    public ResponseEntity<ApiResponse<GalleryItem>> getItemById(@PathVariable("id") String id) {
        GalleryItem item = galleryService.getItemById(id);
        return ResponseEntity.ok(ApiResponse.success(item, "Gallery item retrieved"));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Create gallery item metadata")
    public ResponseEntity<ApiResponse<GalleryItem>> createItem(@RequestBody GalleryItem item) {
        GalleryItem created = galleryService.createItem(item);
        return ResponseEntity.ok(ApiResponse.success(created, "Gallery item created"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Update gallery item metadata")
    public ResponseEntity<ApiResponse<GalleryItem>> updateItem(
            @PathVariable("id") String id,
            @RequestBody GalleryItem item) {
        GalleryItem updated = galleryService.updateItem(id, item);
        return ResponseEntity.ok(ApiResponse.success(updated, "Gallery item updated"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Delete gallery item and associated Drive image")
    public ResponseEntity<ApiResponse<Void>> deleteItem(@PathVariable("id") String id) {
        galleryService.deleteItem(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Gallery item deleted"));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Create gallery item and upload image file to Google Drive")
    public ResponseEntity<ApiResponse<GalleryItem>> createAndUploadGalleryItem(
            @RequestParam(value = "title", required = false, defaultValue = "Campus Gallery Photo") String title,
            @RequestParam(value = "description", required = false, defaultValue = "") String description,
            @RequestParam(value = "category", required = false, defaultValue = "Events") String category,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "file", required = false) MultipartFile filePart) {

        MultipartFile targetFile = (image != null && !image.isEmpty()) ? image : filePart;
        log.info("[GALLERY UPLOAD] request received title='{}'", title);
        if (targetFile != null) {
            log.info("[GALLERY UPLOAD] filename='{}', contentType='{}', size={} bytes",
                    targetFile.getOriginalFilename(), targetFile.getContentType(), targetFile.getSize());
        } else {
            log.warn("[GALLERY UPLOAD] No image or file MultipartFile target found in request!");
        }

        try {
            GalleryItem created = galleryService.createGalleryItemWithImage(title, description, category, targetFile);
            log.info("[GALLERY UPLOAD] SUCCESS id='{}'", created.getId());
            return ResponseEntity.ok(ApiResponse.success(created, "Gallery image uploaded successfully"));
        } catch (Exception e) {
            log.error("[GALLERY UPLOAD] FAILED title='{}': {}", title, e.getMessage(), e);
            log.error("[GALLERY UPLOAD] FAILED exceptionClass={} exceptionMessage={} rootCause={}",
                    e.getClass().getName(), e.getMessage(), e.getCause() != null ? e.getCause().getMessage() : "None");
            throw e;
        }
    }

    @PostMapping(value = "/{galleryId}/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ADMIN', 'PRINCIPAL')")
    @Operation(summary = "Upload image for existing gallery item to Google Drive")
    public ResponseEntity<ApiResponse<GalleryItem>> uploadGalleryImage(
            @PathVariable("galleryId") String galleryId,
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestPart(value = "file", required = false) MultipartFile filePart) {

        MultipartFile targetFile = (image != null && !image.isEmpty()) ? image : filePart;
        log.info("[GALLERY UPLOAD] request received for galleryId='{}'", galleryId);
        if (targetFile != null) {
            log.info("[GALLERY UPLOAD] filename='{}', contentType='{}', size={} bytes",
                    targetFile.getOriginalFilename(), targetFile.getContentType(), targetFile.getSize());
        }

        try {
            GalleryItem updated = galleryService.uploadGalleryImage(galleryId, targetFile);
            log.info("[GALLERY UPLOAD] SUCCESS for galleryId='{}'", galleryId);
            return ResponseEntity.ok(ApiResponse.success(updated, "Gallery image uploaded successfully"));
        } catch (Exception e) {
            log.error("[GALLERY UPLOAD] FAILED galleryId='{}': {}", galleryId, e.getMessage(), e);
            throw e;
        }
    }

    @GetMapping("/{galleryId}/image")
    @Operation(summary = "Stream gallery image from Google Drive (Public Endpoint)")
    public ResponseEntity<InputStreamResource> streamGalleryImage(
            @PathVariable("galleryId") String galleryId,
            @RequestParam(value = "v", required = false) String v) {
        log.info("[GALLERY_IMAGE] CONTROLLER HIT id={}", galleryId);
        GalleryService.GalleryImageStream imageStream = galleryService.getGalleryImageStream(galleryId, v);

        MediaType mediaType;
        try {
            mediaType = MediaType.parseMediaType(imageStream.getMimeType());
        } catch (Exception e) {
            mediaType = MediaType.IMAGE_JPEG;
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "public, max-age=31536000, immutable")
                .contentType(mediaType)
                .body(new InputStreamResource(imageStream.getInputStream()));
    }
}
