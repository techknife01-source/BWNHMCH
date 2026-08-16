package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.entity.GalleryItem;
import com.homeopathy.college.exception.BadRequestException;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.repository.GalleryRepository;
import com.homeopathy.college.service.GalleryService;
import com.homeopathy.college.service.GoogleDriveService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class GalleryServiceImpl implements GalleryService {

    private final GalleryRepository galleryRepository;
    private final GoogleDriveService googleDriveService;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"
    );
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

    @PostConstruct
    public void migrateExistingNullIdRecords() {
        try {
            log.info("[GALLERY MIGRATION] Scanning for MongoDB gallery documents missing unique IDs...");
            List<GalleryItem> items = galleryRepository.findAll();
            int fixedCount = 0;
            for (GalleryItem item : items) {
                boolean updated = false;
                if (item.getId() == null || item.getId().isBlank()) {
                    String generatedId = "gal-migrated-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
                    item.setId(generatedId);
                    item.setCustomId(generatedId);
                    updated = true;
                } else if (item.getCustomId() == null || item.getCustomId().isBlank()) {
                    item.setCustomId(item.getId());
                    updated = true;
                }
                if (updated) {
                    galleryRepository.save(item);
                    fixedCount++;
                }
            }
            log.info("[GALLERY MIGRATION] Migration complete. Assigned unique non-null IDs to {} records.", fixedCount);
        } catch (Exception e) {
            log.warn("[GALLERY MIGRATION] Migration notice: {}", e.getMessage());
        }
    }

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
        if (item == null) {
            item = new GalleryItem();
        }
        if (item.getId() == null || item.getId().isBlank()) {
            String uniqueId = "gal-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
            item.setId(uniqueId);
            item.setCustomId(uniqueId);
        } else if (item.getCustomId() == null || item.getCustomId().isBlank()) {
            item.setCustomId(item.getId());
        }

        if (item.getStatus() == null || item.getStatus().isBlank()) {
            item.setStatus("Active");
        }

        log.info("[GALLERY SERVICE] Saving new GalleryItem with id='{}', customId='{}'", item.getId(), item.getCustomId());
        return galleryRepository.save(item);
    }

    @Override
    public GalleryItem updateItem(String id, GalleryItem details) {
        GalleryItem item = getItemById(id);
        if (details.getTitle() != null) item.setTitle(details.getTitle());
        if (details.getDescription() != null) item.setDescription(details.getDescription());
        if (details.getCategory() != null) item.setCategory(details.getCategory());
        if (details.getStatus() != null) item.setStatus(details.getStatus());

        // Preserve existing ID identity on update
        if (item.getCustomId() == null || item.getCustomId().isBlank()) {
            item.setCustomId(item.getId());
        }

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
        if (item.getId() == null || item.getId().isBlank()) {
            item.setId(galleryId);
            item.setCustomId(galleryId);
        } else if (item.getCustomId() == null || item.getCustomId().isBlank()) {
            item.setCustomId(item.getId());
        }

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
        String galleryId = "gal-" + System.currentTimeMillis() + "-" + UUID.randomUUID().toString().substring(0, 8);
        GalleryItem newItem = GalleryItem.builder()
                .id(galleryId)
                .customId(galleryId)
                .title(title != null && !title.isBlank() ? title : "Gallery Photo")
                .description(description != null ? description : "")
                .category(category != null && !category.isBlank() ? category : "General")
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

        GalleryItem item = null;
        try {
            item = galleryRepository.findByIdOrCustomId(galleryId).orElse(null);
            if (item == null && versionOrDriveId != null && !versionOrDriveId.isBlank()) {
                item = galleryRepository.findByDriveFileId(versionOrDriveId).orElse(null);
            }
        } catch (Exception e) {
            log.warn("[GALLERY_IMAGE] Database lookup exception for '{}': {}", galleryId, e.getMessage());
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
            throw new ResourceNotFoundException("Gallery image", "galleryId", galleryId);
        }

        InputStream stream = googleDriveService.downloadFile(driveFileId);
        if (stream == null) {
            throw new ResourceNotFoundException("Google Drive file", "driveFileId", driveFileId);
        }

        return new GalleryImageStream(stream, mimeType);
    }
}
