package com.homeopathy.college.serviceImpl;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.GoogleCredentials;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.auth.oauth2.UserCredentials;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.service.GoogleDriveService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.security.PrivateKey;
import java.util.Collections;

@Service
@Slf4j
public class GoogleDriveServiceImpl implements GoogleDriveService {

    @Value("${google.drive.folder-id:1IRcwRPZ9d0Tk-cp-bCYZwKOUX7Cg3dsC}")
    private String folderId;

    @Value("${google.drive.client-id:}")
    private String clientId;

    @Value("${google.drive.client-secret:}")
    private String clientSecret;

    @Value("${google.drive.refresh-token:}")
    private String refreshToken;

    @Value("${google.drive.client-email:}")
    private String clientEmail;

    @Value("${google.drive.private-key:}")
    private String privateKey;

    private volatile Drive driveService;

    private Drive getDriveService() {
        if (driveService == null) {
            synchronized (this) {
                if (driveService == null) {
                    try {
                        log.info("[LIBRARY] Initializing Google Drive Service...");
                        GoogleCredentials credentials = null;

                        String effClientId = (clientId != null) ? clientId.trim() : "";
                        String effClientSecret = (clientSecret != null) ? clientSecret.trim() : "";
                        String effRefreshToken = (refreshToken != null) ? refreshToken.trim() : "";
                        String effClientEmail = (clientEmail != null) ? clientEmail.trim() : "";
                        String effPrivateKey = (privateKey != null) ? privateKey.trim() : "";

                        if (!effRefreshToken.isEmpty() && !effClientId.isEmpty() && !effClientSecret.isEmpty()) {
                            log.info("[LIBRARY] Google Drive authenticating via OAuth 2.0 User Credentials (bwnhmch@gmail.com)...");
                            credentials = UserCredentials.newBuilder()
                                    .setClientId(effClientId)
                                    .setClientSecret(effClientSecret)
                                    .setRefreshToken(effRefreshToken)
                                    .build();
                        } else if (!effClientEmail.isEmpty() && !effPrivateKey.isEmpty()) {
                            log.info("[LIBRARY] Google Drive authenticating via Service Account Credentials...");
                            PrivateKey pk = parsePrivateKey(effPrivateKey);
                            credentials = ServiceAccountCredentials.newBuilder()
                                    .setClientEmail(effClientEmail)
                                    .setPrivateKey(pk)
                                    .setScopes(Collections.singletonList(DriveScopes.DRIVE))
                                    .build();
                        } else {
                            log.error("[LIBRARY] Missing Google Drive authentication credentials.");
                            throw new FileUploadException("Google Drive credentials (OAuth 2.0 or Service Account) are not configured.");
                        }

                        HttpCredentialsAdapter adapter = new HttpCredentialsAdapter(credentials) {
                            @Override
                            public void initialize(com.google.api.client.http.HttpRequest request) throws java.io.IOException {
                                super.initialize(request);
                                request.setConnectTimeout(30000);
                                request.setReadTimeout(90000);
                            }
                        };

                        driveService = new Drive.Builder(
                                GoogleNetHttpTransport.newTrustedTransport(),
                                GsonFactory.getDefaultInstance(),
                                adapter)
                                .setApplicationName("Smart Homeopathic Medical College E-Library")
                                .build();

                        log.info("[LIBRARY] Google Drive Service initialized successfully.");
                    } catch (Exception e) {
                        log.error("[LIBRARY] Failed to initialize Google Drive Service: {}", e.getMessage(), e);
                        driveService = null;
                        throw new FileUploadException("Failed to initialize Google Drive Service: " + e.getMessage(), e);
                    }
                }
            }
        }
        return driveService;
    }

    private PrivateKey parsePrivateKey(String keyPem) {
        if (keyPem != null && !keyPem.isBlank()) {
            try {
                String sanitized = keyPem.replace("\\n", "\n").replace("\\r", "").trim();
                String cleanPem = sanitized.replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "")
                        .replaceAll("\\s+", "");
                byte[] decoded = java.util.Base64.getDecoder().decode(cleanPem);
                return java.security.KeyFactory.getInstance("RSA")
                        .generatePrivate(new java.security.spec.PKCS8EncodedKeySpec(decoded));
            } catch (Exception e) {
                log.error("[GOOGLE DRIVE] Failed to parse private key PEM: {}", e.getMessage(), e);
                throw new IllegalArgumentException("Invalid RSA private key PEM: " + e.getMessage(), e);
            }
        }
        throw new IllegalArgumentException("Invalid or empty RSA private key PEM");
    }

    @Override
    public boolean isConfigured() {
        boolean oauthConfigured = refreshToken != null && !refreshToken.isBlank() &&
                clientId != null && !clientId.isBlank() &&
                clientSecret != null && !clientSecret.isBlank();
        boolean saConfigured = clientEmail != null && !clientEmail.isBlank() &&
                privateKey != null && !privateKey.isBlank();
        return oauthConfigured || saConfigured;
    }

    @Override
    public File getFileMetadata(String fileId) {
        if (fileId == null || fileId.isBlank()) return null;
        try {
            Drive drive = getDriveService();
            return drive.files().get(fileId)
                    .setSupportsAllDrives(true)
                    .setFields("id, name, mimeType, size")
                    .execute();
        } catch (Exception e) {
            log.warn("[LIBRARY] Failed to fetch file metadata for file ID '{}': {}", fileId, e.getMessage());
            return null;
        }
    }

    @Override
    public File getFolderMetadata(String folderIdToTest) {
        String targetFolder = (folderIdToTest != null && !folderIdToTest.isBlank()) ? folderIdToTest : this.folderId;
        if (targetFolder == null || targetFolder.isBlank()) return null;
        try {
            Drive drive = getDriveService();
            File folder = drive.files().get(targetFolder)
                    .setSupportsAllDrives(true)
                    .setFields("id, name, mimeType")
                    .execute();
            log.info("[LIBRARY] Target folder verified folderId={}", targetFolder);
            return folder;
        } catch (Exception e) {
            log.error("[LIBRARY] Target folder verification failed for folderId='{}': {}", targetFolder, e.getMessage());
            return null;
        }
    }

    @Override
    public String uploadFile(InputStream inputStream, String fileName, String mimeType, long size) {
        log.info("[LIBRARY] Upload started fileName='{}', mimeType='{}', size={} bytes", fileName, mimeType, size);
        Drive drive = getDriveService();
        if (drive == null) {
            throw new FileUploadException("Google Drive service is not available.");
        }

        try {
            File fileMetadata = new File();
            fileMetadata.setName(fileName);
            if (folderId != null && !folderId.isBlank()) {
                fileMetadata.setParents(Collections.singletonList(folderId.trim()));
            }

            InputStreamContent mediaContent = new InputStreamContent(mimeType, inputStream);
            if (size > 0) {
                mediaContent.setLength(size);
            }

            log.info("[LIBRARY] Google Drive upload started");
            File uploadedFile = drive.files().create(fileMetadata, mediaContent)
                    .setSupportsAllDrives(true)
                    .setFields("id, name, mimeType, size")
                    .execute();

            if (uploadedFile == null || uploadedFile.getId() == null || uploadedFile.getId().isBlank()) {
                log.error("[LIBRARY] Google Drive upload returned empty file ID.");
                throw new FileUploadException("Google Drive returned empty or null file ID.");
            }

            String fileId = uploadedFile.getId();
            log.info("[LIBRARY] Google Drive file ID: {}", fileId);
            return fileId;
        } catch (FileUploadException e) {
            throw e;
        } catch (Exception e) {
            log.error("[LIBRARY] Google Drive upload failed for '{}': {}", fileName, e.getMessage(), e);
            throw new FileUploadException("Google Drive upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public InputStream downloadFile(String fileId) {
        log.info("[GOOGLE DRIVE] File stream retrieval started for file ID: {}", fileId);
        if (fileId == null || fileId.isBlank()) {
            throw new IllegalArgumentException("Google Drive file ID cannot be blank.");
        }

        Drive drive = getDriveService();
        if (drive == null) {
            throw new RuntimeException("Google Drive service is not available.");
        }

        try {
            InputStream mediaStream = drive.files().get(fileId)
                    .setSupportsAllDrives(true)
                    .executeMediaAsInputStream();
            log.info("[GOOGLE DRIVE] File stream retrieval successful for file ID: {}", fileId);
            return mediaStream;
        } catch (Exception e) {
            log.error("[GOOGLE DRIVE] File stream retrieval failed for file ID '{}': {}", fileId, e.getMessage(), e);
            throw new RuntimeException("Failed to stream file from Google Drive: " + e.getMessage(), e);
        }
    }

    @Override
    public void deleteFile(String fileId) {
        log.info("[LIBRARY] Google Drive delete started for file ID: {}", fileId);
        if (fileId == null || fileId.isBlank()) return;

        try {
            Drive drive = getDriveService();
            if (drive != null) {
                drive.files().delete(fileId)
                        .setSupportsAllDrives(true)
                        .execute();
                log.info("[LIBRARY] Google Drive delete successful for file ID: {}", fileId);
            }
        } catch (Exception e) {
            log.warn("[LIBRARY] Failed to delete Google Drive file ID '{}': {}", fileId, e.getMessage());
        }
    }
}


