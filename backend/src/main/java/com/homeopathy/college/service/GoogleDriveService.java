package com.homeopathy.college.service;

import com.google.api.services.drive.model.File;
import java.io.InputStream;

public interface GoogleDriveService {
    String uploadFile(InputStream inputStream, String fileName, String mimeType, long size);
    InputStream downloadFile(String fileId);
    boolean isConfigured();
    File getFileMetadata(String fileId);
    File getFolderMetadata(String folderId);
}
