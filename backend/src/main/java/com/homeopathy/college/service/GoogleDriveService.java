package com.homeopathy.college.service;

import java.io.InputStream;

public interface GoogleDriveService {
    String uploadFile(InputStream inputStream, String fileName, String mimeType, long size);
    InputStream downloadFile(String fileId);
}
