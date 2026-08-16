package com.homeopathy.college.service;

import com.homeopathy.college.entity.Doctor;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface DoctorService {
    List<Doctor> getAllDoctors();
    Doctor getDoctorById(String id);
    Doctor createDoctor(Doctor doctor);
    Doctor updateDoctor(String id, Doctor doctor);
    void deleteDoctor(String id);

    Doctor uploadDoctorPhoto(String doctorId, MultipartFile file);
    DoctorPhotoStream getDoctorPhotoStream(String doctorId);

    class DoctorPhotoStream {
        private final InputStream inputStream;
        private final String mimeType;

        public DoctorPhotoStream(InputStream inputStream, String mimeType) {
            this.inputStream = inputStream;
            this.mimeType = mimeType;
        }

        public InputStream getInputStream() {
            return inputStream;
        }

        public String getMimeType() {
            return mimeType;
        }
    }
}
