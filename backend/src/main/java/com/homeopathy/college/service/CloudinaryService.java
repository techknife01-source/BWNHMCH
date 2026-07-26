package com.homeopathy.college.service;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {

    Map<String, Object> uploadFile(MultipartFile file, String folder);

    Map<String, Object> deleteFile(String publicId);
}
