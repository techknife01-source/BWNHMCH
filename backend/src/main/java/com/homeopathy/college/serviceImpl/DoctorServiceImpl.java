package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.entity.Doctor;
import com.homeopathy.college.repository.DoctorRepository;
import com.homeopathy.college.service.DoctorService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorServiceImpl implements DoctorService {

    private final DoctorRepository doctorRepository;

    @Override
    public List<Doctor> getAllDoctors() {
        log.info("[DOCTOR_SERVICE] Fetching all doctors");
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorById(String id) {
        log.info("[DOCTOR_SERVICE] Fetching doctor by ID '{}'", id);
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with ID: " + id));
    }

    @Override
    public Doctor createDoctor(Doctor doctor) {
        log.info("[DOCTOR_SERVICE] Creating new doctor record for '{}'", doctor.getName());
        return doctorRepository.save(doctor);
    }

    @Override
    public Doctor updateDoctor(String id, Doctor doctorUpdates) {
        log.info("[DOCTOR_SERVICE] Updating doctor record ID '{}'", id);
        Doctor existing = getDoctorById(id);
        if (doctorUpdates.getName() != null) existing.setName(doctorUpdates.getName());
        if (doctorUpdates.getDepartment() != null) existing.setDepartment(doctorUpdates.getDepartment());
        if (doctorUpdates.getDesignation() != null) existing.setDesignation(doctorUpdates.getDesignation());
        if (doctorUpdates.getQualification() != null) existing.setQualification(doctorUpdates.getQualification());
        if (doctorUpdates.getSpecialization() != null) existing.setSpecialization(doctorUpdates.getSpecialization());
        if (doctorUpdates.getMedicalRegistrationNumber() != null) existing.setMedicalRegistrationNumber(doctorUpdates.getMedicalRegistrationNumber());
        if (doctorUpdates.getEmail() != null) existing.setEmail(doctorUpdates.getEmail());
        if (doctorUpdates.getPhone() != null) existing.setPhone(doctorUpdates.getPhone());
        if (doctorUpdates.getStatus() != null) existing.setStatus(doctorUpdates.getStatus());
        return doctorRepository.save(existing);
    }

    @Override
    public void deleteDoctor(String id) {
        log.info("[DOCTOR_SERVICE] Deleting doctor record ID '{}'", id);
        Doctor existing = getDoctorById(id);
        doctorRepository.delete(existing);
    }

    @Override
    public Doctor uploadDoctorPhoto(String doctorId, MultipartFile file) {
        Doctor doctor = getDoctorById(doctorId);
        Doctor.DoctorPhoto photo = Doctor.DoctorPhoto.builder()
                .driveFileId("local-" + System.currentTimeMillis())
                .fileName(file.getOriginalFilename())
                .mimeType(file.getContentType())
                .build();
        doctor.setPhoto(photo);
        doctor.setPhotoUrl("/doctors/" + doctorId + "/photo");
        return doctorRepository.save(doctor);
    }

    @Override
    public DoctorPhotoStream getDoctorPhotoStream(String doctorId) {
        byte[] emptySvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\" fill=\"#cbd5e1\"><path d=\"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z\"/></svg>".getBytes();
        return new DoctorPhotoStream(new ByteArrayInputStream(emptySvg), "image/svg+xml");
    }
}
