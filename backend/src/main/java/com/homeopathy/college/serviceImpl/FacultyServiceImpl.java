package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.entity.Faculty;
import com.homeopathy.college.exception.BadRequestException;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.repository.FacultyRepository;
import com.homeopathy.college.service.FacultyService;
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
public class FacultyServiceImpl implements FacultyService {

    private final FacultyRepository facultyRepository;
    private final GoogleDriveService googleDriveService;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

    @Override
    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    @Override
    public Faculty getFacultyById(String id) {
        return facultyRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Faculty member", "id", id));
    }

    @Override
    public Faculty createFaculty(Faculty faculty) {
        if (faculty.getStatus() == null) {
            faculty.setStatus("Active");
        }
        if (faculty.getPhotoUrl() != null && faculty.getPhotoUrl().startsWith("blob:")) {
            faculty.setPhotoUrl(null);
        }
        return facultyRepository.save(faculty);
    }

    @Override
    public Faculty updateFaculty(String id, Faculty details) {
        Faculty faculty = getFacultyById(id);
        if (details.getName() != null && !details.getName().isBlank()) faculty.setName(details.getName());
        if (details.getDesignation() != null && !details.getDesignation().isBlank()) faculty.setDesignation(details.getDesignation());
        if (details.getDepartment() != null && !details.getDepartment().isBlank()) faculty.setDepartment(details.getDepartment());
        if (details.getDepartmentId() != null && !details.getDepartmentId().isBlank()) faculty.setDepartmentId(details.getDepartmentId());
        if (details.getQualification() != null && !details.getQualification().isBlank()) faculty.setQualification(details.getQualification());
        if (details.getSpecialization() != null) faculty.setSpecialization(details.getSpecialization());
        if (details.getEmail() != null && !details.getEmail().isBlank()) faculty.setEmail(details.getEmail());
        if (details.getPhone() != null) faculty.setPhone(details.getPhone());
        if (details.getRegistrationNumber() != null) faculty.setRegistrationNumber(details.getRegistrationNumber());
        if (details.getJoiningDate() != null) faculty.setJoiningDate(details.getJoiningDate());
        if (details.getPromotionDate() != null) faculty.setPromotionDate(details.getPromotionDate());
        if (details.getExperienceYears() != null) faculty.setExperienceYears(details.getExperienceYears());
        if (details.getBiography() != null) faculty.setBiography(details.getBiography());
        if (details.getStatus() != null && !details.getStatus().isBlank()) faculty.setStatus(details.getStatus());
        if (details.getPhotoUrl() != null && !details.getPhotoUrl().isBlank() && !details.getPhotoUrl().startsWith("blob:")) {
            faculty.setPhotoUrl(details.getPhotoUrl());
        }
        if (details.getPhoto() != null) {
            faculty.setPhoto(details.getPhoto());
        }

        return facultyRepository.save(faculty);
    }

    @Override
    public void deleteFaculty(String id) {
        Faculty faculty = getFacultyById(id);
        if (faculty.getPhoto() != null && faculty.getPhoto().getDriveFileId() != null) {
            String driveFileId = faculty.getPhoto().getDriveFileId();
            try {
                log.info("[FACULTY PHOTO] Deleting associated Drive photo ID '{}'", driveFileId);
                googleDriveService.deleteFile(driveFileId);
            } catch (Exception e) {
                log.warn("[FACULTY PHOTO] Failed to delete Google Drive file '{}': {}", driveFileId, e.getMessage());
            }
        }
        facultyRepository.delete(faculty);
    }

    @Override
    public Faculty uploadFacultyPhoto(String facultyId, MultipartFile file) {
        log.info("[FACULTY PHOTO] Upload started for facultyId='{}'", facultyId);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Photo file cannot be empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid image format. Allowed formats: JPEG, PNG, WebP.");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("Image file size exceeds 15MB maximum limit.");
        }

        Faculty faculty = getFacultyById(facultyId);

        String oldDriveFileId = (faculty.getPhoto() != null) ? faculty.getPhoto().getDriveFileId() : null;

        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isBlank()) {
            fileName = "faculty-" + facultyId + ".jpg";
        }

        String newDriveFileId;
        try {
            log.info("[FACULTY PHOTO] Uploading photo '{}' ({} bytes) to Google Drive...", fileName, file.getSize());
            newDriveFileId = googleDriveService.uploadFile(
                    file.getInputStream(),
                    fileName,
                    contentType,
                    file.getSize()
            );
            log.info("[FACULTY PHOTO] Upload to Google Drive successful. driveFileId='{}'", newDriveFileId);
        } catch (Exception e) {
            log.error("[FACULTY PHOTO] Google Drive upload failed for facultyId='{}': {}", facultyId, e.getMessage(), e);
            throw new FileUploadException("Google Drive upload failed: " + e.getMessage(), e);
        }

        Faculty.FacultyPhoto photoMeta = Faculty.FacultyPhoto.builder()
                .driveFileId(newDriveFileId)
                .fileName(fileName)
                .mimeType(contentType)
                .build();

        faculty.setPhoto(photoMeta);
        faculty.setPhotoUrl("/api/v1/faculty/" + facultyId + "/photo?v=" + newDriveFileId);

        try {
            Faculty saved = facultyRepository.save(faculty);
            log.info("[FACULTY PHOTO] MongoDB update successful for facultyId='{}'", facultyId);

            // Clean up old Drive file if updated
            if (oldDriveFileId != null && !oldDriveFileId.isBlank() && !oldDriveFileId.equals(newDriveFileId)) {
                try {
                    log.info("[FACULTY PHOTO] Deleting previous Google Drive photo ID '{}'", oldDriveFileId);
                    googleDriveService.deleteFile(oldDriveFileId);
                } catch (Exception deleteErr) {
                    log.warn("[FACULTY PHOTO] Could not delete old Drive photo ID '{}': {}", oldDriveFileId, deleteErr.getMessage());
                }
            }

            return saved;
        } catch (Exception dbErr) {
            log.error("[FACULTY PHOTO] MongoDB save failed for facultyId='{}'. Cleaning up uploaded Drive file '{}': {}",
                    facultyId, newDriveFileId, dbErr.getMessage(), dbErr);
            try {
                googleDriveService.deleteFile(newDriveFileId);
            } catch (Exception cleanupErr) {
                log.error("[FACULTY PHOTO] Failed to cleanup new Drive file '{}': {}", newDriveFileId, cleanupErr.getMessage());
            }
            throw new FileUploadException("Failed to persist faculty photo metadata: " + dbErr.getMessage(), dbErr);
        }
    }

    @Override
    public FacultyPhotoStream getFacultyPhotoStream(String facultyId) {
        Faculty faculty = getFacultyById(facultyId);
        if (faculty.getPhoto() == null || faculty.getPhoto().getDriveFileId() == null) {
            throw new ResourceNotFoundException("Faculty photo", "facultyId", facultyId);
        }

        String driveFileId = faculty.getPhoto().getDriveFileId();
        String mimeType = faculty.getPhoto().getMimeType();
        if (mimeType == null || mimeType.isBlank()) {
            mimeType = "image/jpeg";
        }

        InputStream stream = googleDriveService.downloadFile(driveFileId);
        return new FacultyPhotoStream(stream, mimeType);
    }
}
