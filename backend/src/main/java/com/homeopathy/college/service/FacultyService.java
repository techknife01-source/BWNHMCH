package com.homeopathy.college.service;

import com.homeopathy.college.entity.Faculty;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface FacultyService {
    List<Faculty> getAllFaculty();
    Faculty getFacultyById(String id);
    Faculty createFaculty(Faculty faculty);
    Faculty updateFaculty(String id, Faculty faculty);
    void deleteFaculty(String id);

    Faculty uploadFacultyPhoto(String facultyId, MultipartFile file);
    FacultyPhotoStream getFacultyPhotoStream(String facultyId);

    class FacultyPhotoStream {
        private final InputStream inputStream;
        private final String mimeType;

        public FacultyPhotoStream(InputStream inputStream, String mimeType) {
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
