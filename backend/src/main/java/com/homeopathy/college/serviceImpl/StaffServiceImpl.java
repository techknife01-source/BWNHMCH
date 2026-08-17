package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.entity.Staff;
import com.homeopathy.college.exception.BadRequestException;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.repository.StaffRepository;
import com.homeopathy.college.service.GoogleDriveService;
import com.homeopathy.college.service.StaffService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.Arrays;
import java.util.Comparator;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class StaffServiceImpl implements StaffService {

    private final StaffRepository staffRepository;
    private final GoogleDriveService googleDriveService;

    private static final List<String> ALLOWED_IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/webp"
    );
    private static final long MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB

    @Override
    public List<Staff> getAllStaff() {
        List<Staff> list = staffRepository.findAll();
        list.removeIf(s -> (s.getId() != null && s.getId().startsWith("f-"))
                || "ACADEMIC FACULTY".equalsIgnoreCase(s.getCategory()));
        list.sort(Comparator.comparing(s -> s.getDisplayOrder() != null ? s.getDisplayOrder() : (s.getSlNo() != null ? s.getSlNo() : 999)));
        return list;
    }

    @Override
    public Staff getStaffById(String id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff member", "id", id));
    }

    @Override
    public Staff createStaff(Staff staff) {
        if (staff.getStatus() == null || staff.getStatus().isEmpty()) {
            staff.setStatus("ACTIVE");
        } else {
            staff.setStatus(staff.getStatus().toUpperCase());
        }

        if (staff.getPhotoUrl() != null && staff.getPhotoUrl().startsWith("blob:")) {
            staff.setPhotoUrl(null);
        }

        if (staff.getSlNo() == null) {
            long count = staffRepository.count();
            staff.setSlNo((int) count + 1);
        }
        if (staff.getDisplayOrder() == null) {
            staff.setDisplayOrder(staff.getSlNo());
        }

        if (staff.getEmpId() == null || staff.getEmpId().trim().isEmpty()) {
            staff.setEmpId(String.format("SL-%02d", staff.getSlNo()));
        }

        Staff saved = staffRepository.save(staff);
        log.info("[STAFF_SERVICE] Successfully created staff member ID '{}' with name '{}'", saved.getId(), saved.getName());
        return saved;
    }

    @Override
    public Staff updateStaff(String id, Staff staffDetails) {
        Staff existing = getStaffById(id);

        if (staffDetails.getName() != null && !staffDetails.getName().trim().isEmpty()) {
            existing.setName(staffDetails.getName().trim());
        }
        if (staffDetails.getDesignation() != null) {
            existing.setDesignation(staffDetails.getDesignation().trim());
        }
        if (staffDetails.getDepartment() != null) {
            existing.setDepartment(staffDetails.getDepartment().trim());
        }
        if (staffDetails.getRoleCategory() != null) {
            existing.setRoleCategory(staffDetails.getRoleCategory());
        }
        if (staffDetails.getStaffCategory() != null) {
            existing.setStaffCategory(staffDetails.getStaffCategory());
        }
        if (staffDetails.getCategory() != null) {
            existing.setCategory(staffDetails.getCategory());
        }
        if (staffDetails.getQualification() != null) {
            existing.setQualification(staffDetails.getQualification());
        }
        if (staffDetails.getSpecialization() != null) {
            existing.setSpecialization(staffDetails.getSpecialization());
        }
        if (staffDetails.getEmail() != null) {
            existing.setEmail(staffDetails.getEmail());
        }
        if (staffDetails.getPhone() != null) {
            existing.setPhone(staffDetails.getPhone());
            existing.setContactNumber(staffDetails.getPhone());
        }
        if (staffDetails.getContactNumber() != null) {
            existing.setContactNumber(staffDetails.getContactNumber());
            existing.setPhone(staffDetails.getContactNumber());
        }
        if (staffDetails.getRegistrationNumber() != null) {
            existing.setRegistrationNumber(staffDetails.getRegistrationNumber());
        }
        if (staffDetails.getJoiningDate() != null) {
            existing.setJoiningDate(staffDetails.getJoiningDate());
        }
        if (staffDetails.getPromotionDate() != null) {
            existing.setPromotionDate(staffDetails.getPromotionDate());
        }
        if (staffDetails.getExperienceYears() != null) {
            existing.setExperienceYears(staffDetails.getExperienceYears());
        }
        if (staffDetails.getBiography() != null) {
            existing.setBiography(staffDetails.getBiography());
        }
        if (staffDetails.getAvailability() != null) {
            existing.setAvailability(staffDetails.getAvailability());
        }
        if (staffDetails.getDutyShift() != null) {
            existing.setDutyShift(staffDetails.getDutyShift());
        }
        if (staffDetails.getOpdCounter() != null) {
            existing.setOpdCounter(staffDetails.getOpdCounter());
        }
        if (staffDetails.getStatus() != null) {
            existing.setStatus(staffDetails.getStatus().toUpperCase());
        }
        if (staffDetails.getPhotoUrl() != null && !staffDetails.getPhotoUrl().startsWith("blob:")) {
            existing.setPhotoUrl(staffDetails.getPhotoUrl());
        }

        Staff updated = staffRepository.save(existing);
        log.info("[STAFF_SERVICE] Successfully updated staff member ID '{}'", updated.getId());
        return updated;
    }

    @Override
    public void deleteStaff(String id) {
        Staff existing = getStaffById(id);
        if (existing.getPhoto() != null && existing.getPhoto().getDriveFileId() != null) {
            try {
                googleDriveService.deleteFile(existing.getPhoto().getDriveFileId());
            } catch (Exception e) {
                log.warn("[STAFF_SERVICE] Failed to delete photo for staff '{}': {}", id, e.getMessage());
            }
        }
        staffRepository.deleteById(id);
        log.info("[STAFF_SERVICE] Deleted staff member ID '{}'", id);
    }

    @Override
    public Staff uploadStaffPhoto(String id, MultipartFile file) {
        Staff staff = getStaffById(id);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Image file is required");
        }
        if (file.getSize() > MAX_FILE_SIZE) {
            throw new BadRequestException("File size exceeds maximum limit of 15MB");
        }
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_IMAGE_TYPES.contains(contentType.toLowerCase())) {
            throw new BadRequestException("Invalid file type. Allowed types: JPEG, JPG, PNG, WEBP");
        }

        try (InputStream inputStream = file.getInputStream()) {
            String fileName = file.getOriginalFilename();
            if (fileName == null || fileName.isBlank()) {
                fileName = "staff-" + id + ".jpg";
            }

            if (staff.getPhoto() != null && staff.getPhoto().getDriveFileId() != null) {
                try {
                    googleDriveService.deleteFile(staff.getPhoto().getDriveFileId());
                } catch (Exception e) {
                    log.warn("[STAFF_SERVICE] Could not delete old photo for staff '{}': {}", id, e.getMessage());
                }
            }

            String driveFileId = googleDriveService.uploadFile(inputStream, fileName, contentType, file.getSize());
            Staff.StaffPhoto photo = Staff.StaffPhoto.builder()
                    .driveFileId(driveFileId)
                    .fileName(fileName)
                    .mimeType(contentType)
                    .build();

            staff.setPhoto(photo);
            staff.setPhotoUrl("/api/v1/staff/" + id + "/photo?v=" + driveFileId);
            return staffRepository.save(staff);
        } catch (Exception e) {
            log.error("[STAFF_SERVICE] Photo upload error for staff '{}': {}", id, e.getMessage(), e);
            throw new FileUploadException("Failed to upload staff photo: " + e.getMessage());
        }
    }

    @Override
    public void deleteStaffPhoto(String id) {
        Staff staff = getStaffById(id);
        if (staff.getPhoto() != null && staff.getPhoto().getDriveFileId() != null) {
            googleDriveService.deleteFile(staff.getPhoto().getDriveFileId());
            staff.setPhoto(null);
            staff.setPhotoUrl(null);
            staffRepository.save(staff);
        }
    }
}
