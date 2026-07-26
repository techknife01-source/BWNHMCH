package com.homeopathy.college.serviceImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.service.CloudinaryService;
import com.homeopathy.college.util.FileUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> uploadFile(MultipartFile file, String folder) {
        FileUtil.validateFile(file);

        try {
            return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "folder", "bhmch/" + (folder != null ? folder : "general"),
                    "resource_type", "auto"
            ));
        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary", e);
            throw new FileUploadException("Failed to upload file to Cloudinary storage: " + e.getMessage(), e);
        }
    }

    @Override
    @SuppressWarnings("unchecked")
    public Map<String, Object> deleteFile(String publicId) {
        try {
            return cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary publicId: {}", publicId, e);
            throw new FileUploadException("Failed to delete file from Cloudinary: " + e.getMessage(), e);
        }
    }
}
