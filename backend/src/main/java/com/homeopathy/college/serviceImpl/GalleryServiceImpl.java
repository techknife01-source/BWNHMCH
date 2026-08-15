package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.entity.GalleryItem;
import com.homeopathy.college.exception.BadRequestException;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.repository.GalleryRepository;
import com.homeopathy.college.service.GalleryService;
import com.homeopathy.college.service.GoogleDriveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;
    private final GoogleDriveService googleDriveService;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

    @Override
    public List<GalleryItem> getAllItems() {
        return galleryRepository.findAll();
    }

    @Override
    public GalleryItem getItemById(String id) {
        return galleryRepository.findByIdOrCustomId(id)
                .or(() -> galleryRepository.findByDriveFileId(id))
                .orElseThrow(() -> new ResourceNotFoundException("Gallery item", "id", id));
    }

    @Override
    public GalleryItem createItem(GalleryItem item) {
        if (item.getStatus() == null) {
            item.setStatus("Active");
        }
        return galleryRepository.save(item);
    }

    @Override
    public GalleryItem updateItem(String id, GalleryItem details) {
        GalleryItem item = getItemById(id);
        if (details.getTitle() != null) item.setTitle(details.getTitle());
        if (details.getDescription() != null) item.setDescription(details.getDescription());
        if (details.getCategory() != null) item.setCategory(details.getCategory());
        if (details.getStatus() != null) item.setStatus(details.getStatus());

        return galleryRepository.save(item);
    }

    @Override
    public void deleteItem(String id) {
        GalleryItem item = getItemById(id);
        if (item.getImage() != null && item.getImage().getDriveFileId() != null) {
            String driveFileId = item.getImage().getDriveFileId();
            try {
                log.info("[GALLERY IMAGE] Deleting associated Drive image ID '{}'", driveFileId);
                googleDriveService.deleteFile(driveFileId);
            } catch (Exception e) {
                log.warn("[GALLERY IMAGE] Failed to delete Google Drive file '{}': {}", driveFileId, e.getMessage());
            }
        }
        galleryRepository.delete(item);
    }

    @Override
    public GalleryItem uploadGalleryImage(String galleryId, MultipartFile file) {
        log.info("[GALLERY IMAGE] Upload started for galleryId='{}'", galleryId);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid image format. Allowed formats: JPEG, PNG, WebP.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Image file size exceeds 15MB maximum limit.");
        }

        GalleryItem item = getItemById(galleryId);
        String oldDriveFileId = (item.getImage() != null) ? item.getImage().getDriveFileId() : null;

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            fileName = "gallery-" + galleryId + ".jpg";
        }

        String newDriveFileId;
        try {
            log.info("[GALLERY IMAGE] Uploading image '{}' ({} bytes) to Google Drive...", fileName, file.getSize());
            newDriveFileId = googleDriveService.uploadFile(
                    file.getInputStream(),
                    fileName,
                    contentType,
                    file.getSize()
            );
            log.info("[GALLERY IMAGE] Upload to Google Drive successful. driveFileId='{}'", newDriveFileId);
        } catch (Exception e) {
            log.error("[GALLERY IMAGE] Google Drive upload failed for galleryId='{}': {}", galleryId, e.getMessage(), e);
            throw new FileUploadException("Google Drive upload failed: " + e.getMessage(), e);
        }

        GalleryItem.GalleryImage imageMeta = GalleryItem.GalleryImage.builder()
                .driveFileId(newDriveFileId)
                .fileName(fileName)
                .mimeType(contentType)
                .build();

        item.setImage(imageMeta);
        item.setImageUrl("/api/v1/gallery/" + galleryId + "/image?v=" + newDriveFileId);

        try {
            GalleryItem saved = galleryRepository.save(item);
            log.info("[GALLERY IMAGE] MongoDB update successful for galleryId='{}'", galleryId);
            log.info("[GALLERY_UPLOAD] id={} driveFileId={} mongoSaved=true driveUpload=true", galleryId, newDriveFileId);

            if (oldDriveFileId != null && !oldDriveFileId.isBlank() && !oldDriveFileId.equals(newDriveFileId)) {
                try {
                    log.info("[GALLERY IMAGE] Deleting previous Google Drive image ID '{}'", oldDriveFileId);
                    googleDriveService.deleteFile(oldDriveFileId);
                } catch (Exception deleteErr) {
                    log.warn("[GALLERY IMAGE] Could not delete old Drive image ID '{}': {}", oldDriveFileId, deleteErr.getMessage());
                }
            }

            return saved;
        } catch (Exception dbErr) {
            log.error("[GALLERY IMAGE] MongoDB save failed for galleryId='{}'. Cleaning up uploaded Drive file '{}': {}",
                    galleryId, newDriveFileId, dbErr.getMessage(), dbErr);
            try {
                googleDriveService.deleteFile(newDriveFileId);
            } catch (Exception cleanupErr) {
                log.error("[GALLERY IMAGE] Failed to cleanup new Drive file '{}': {}", newDriveFileId, cleanupErr.getMessage());
            }
            throw new FileUploadException("Failed to persist gallery image metadata: " + dbErr.getMessage(), dbErr);
        }
    }

    @Override
    public GalleryItem createGalleryItemWithImage(String title, String description, String category, MultipartFile file) {
        String galleryId = "gal-" + System.currentTimeMillis() + "-" + (int)(Math.random() * 1000);
        GalleryItem newItem = GalleryItem.builder()
                .id(galleryId)
                .title(title != null ? title : "Gallery Photo")
                .description(description != null ? description : "")
                .category(category != null ? category : "General")
                .status("Active")
                .uploadDate(java.time.LocalDate.now().toString())
                .build();

        GalleryItem saved = createItem(newItem);
        if (file != null && !file.isEmpty()) {
            return uploadGalleryImage(saved.getId(), file);
        }
        return saved;
    }

    @Override
    public GalleryImageStream getGalleryImageStream(String galleryId) {
        return getGalleryImageStream(galleryId, null);
    }

    @Override
    public GalleryImageStream getGalleryImageStream(String galleryId, String versionOrDriveId) {
        log.info("[GALLERY_IMAGE] CONTROLLER HIT id={}", galleryId);
        log.info("[GALLERY_IMAGE] REQUEST");
        log.info("[GALLERY_IMAGE] ID: {}", galleryId);
        log.info("[GALLERY_IMAGE] DATABASE LOOKUP");

        GalleryItem item = null;
        try {
            item = galleryRepository.findByIdOrCustomId(galleryId).orElse(null);
            if (item == null && versionOrDriveId != null && !versionOrDriveId.isBlank()) {
                item = galleryRepository.findByDriveFileId(versionOrDriveId).orElse(null);
            }
        } catch (Exception e) {
            log.warn("[GALLERY_IMAGE] Database lookup exception for '{}': {}", galleryId, e.getMessage());
        }

        log.info("[GALLERY_IMAGE] MONGO FOUND = {}", item != null);
        if (item != null) {
            log.info("[GALLERY_IMAGE] APPLICATION ID = {}", item.getId());
            log.info("[GALLERY_IMAGE] MONGO _id = {}", item.getId());
            log.info("[GALLERY_IMAGE] DRIVE FILE ID = {}", item.getImage() != null ? item.getImage().getDriveFileId() : "NONE");
            log.info("[GALLERY_IMAGE] MIME TYPE = {}", item.getImage() != null ? item.getImage().getMimeType() : "NONE");
            log.info("[GALLERY_IMAGE] IMAGE URL = {}", item.getImageUrl());
        }

        String driveFileId = null;
        String mimeType = "image/jpeg";

        if (item != null && item.getImage() != null && item.getImage().getDriveFileId() != null) {
            driveFileId = item.getImage().getDriveFileId();
            if (item.getImage().getMimeType() != null) {
                mimeType = item.getImage().getMimeType();
            }
        }

        if ((driveFileId == null || driveFileId.isBlank()) && versionOrDriveId != null && versionOrDriveId.trim().length() > 10) {
            driveFileId = versionOrDriveId.trim();
        }

        if (driveFileId == null || driveFileId.isBlank()) {
            if (item == null) {
                log.warn("[GALLERY_IMAGE] RECORD NOT FOUND: {}", galleryId);
            } else {
                log.warn("[GALLERY_IMAGE] DRIVE FILE ID MISSING: {}", galleryId);
            }
            throw new ResourceNotFoundException("Gallery image", "galleryId", galleryId);
        }

        log.info("[GALLERY_IMAGE] DRIVE DOWNLOAD START");
        log.info("[GALLERY_IMAGE] DRIVE FILE ID = {}", driveFileId);

        InputStream stream = googleDriveService.downloadFile(driveFileId);
        if (stream == null) {
            log.error("[GALLERY_IMAGE] DRIVE FILE NOT FOUND: {}", driveFileId);
            throw new ResourceNotFoundException("Google Drive file", "driveFileId", driveFileId);
        }

        log.info("[GALLERY_IMAGE] DRIVE DOWNLOAD SUCCESS");
        return new GalleryImageStream(stream, mimeType);
    }
}
