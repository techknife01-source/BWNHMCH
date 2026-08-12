package com.homeopathy.college.serviceImpl;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.homeopathy.college.service.GoogleDriveService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.Collections;

@Service
@Slf4j
public class GoogleDriveServiceImpl implements GoogleDriveService {

    @Value("${google.drive.folder-id:1NFUQwGp3eTHeMoZJzmzoBgwrCOX5EOb7}")
    private String folderId;

    @Value("${google.drive.client-email:bwnhmch-elibrary@bwnhmch.iam.gserviceaccount.com}")
    private String clientEmail;

    @Value("${google.drive.private-key:}")
    private String privateKey;

    private volatile Drive driveService;

    private Drive getDriveService() {
        if (driveService == null) {
            synchronized (this) {
                if (driveService == null) {
                    try {
                        log.info("[GOOGLE_DRIVE] Lazily initializing Google Drive Service...");
                        if (privateKey == null || privateKey.isBlank()) {
                            log.warn("[GOOGLE_DRIVE] GOOGLE_DRIVE_PRIVATE_KEY is not set.");
                            throw new IllegalStateException("Google Drive Service Account key is missing.");
                        }

                        String formattedKey = privateKey.replace("\\n", "\n").trim();
                        if (!formattedKey.contains("-----BEGIN PRIVATE KEY-----")) {
                            formattedKey = "-----BEGIN PRIVATE KEY-----\n" + formattedKey + "\n-----END PRIVATE KEY-----";
                        }

                        String jsonCredentials = String.format(
                                "{\n" +
                                "  \"type\": \"service_account\",\n" +
                                "  \"client_email\": \"%s\",\n" +
                                "  \"private_key\": \"%s\"\n" +
                                "}",
                                clientEmail,
                                formattedKey.replace("\n", "\\n").replace("\"", "\\\"")
                        );

                        ServiceAccountCredentials credentials = (ServiceAccountCredentials) ServiceAccountCredentials
                                .fromStream(new ByteArrayInputStream(jsonCredentials.getBytes(StandardCharsets.UTF_8)))
                                .createScoped(Collections.singletonList(DriveScopes.DRIVE));

                        HttpCredentialsAdapter adapter = new HttpCredentialsAdapter(credentials) {
                            @Override
                            public void initialize(com.google.api.client.http.HttpRequest request) throws java.io.IOException {
                                super.initialize(request);
                                request.setConnectTimeout(15000); // 15 seconds connect timeout
                                request.setReadTimeout(60000);    // 60 seconds read timeout
                            }
                        };

                        driveService = new Drive.Builder(
                                GoogleNetHttpTransport.newTrustedTransport(),
                                GsonFactory.getDefaultInstance(),
                                adapter)
                                .setApplicationName("Smart Homeopathic Medical College E-Library")
                                .build();

                        log.info("[GOOGLE_DRIVE] Google Drive Service initialized successfully.");
                    } catch (Exception e) {
                        log.error("[GOOGLE_DRIVE] Failed to initialize Google Drive Service: {}", e.getMessage());
                        throw new RuntimeException("Google Drive service initialization failed: " + e.getMessage(), e);
                    }
                }
            }
        }
        return driveService;
    }

    @Override
    public boolean isConfigured() {
        boolean present = clientEmail != null && !clientEmail.isBlank() && privateKey != null && !privateKey.isBlank();
        log.info("[E-LIBRARY] Google Drive configuration present: {}", present);
        log.info("[E-LIBRARY] Google Drive folder configured: {}", folderId != null && !folderId.isBlank());
        return present;
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
            log.warn("[GOOGLE_DRIVE] Failed to fetch file metadata for file ID '{}': {}", fileId, e.getMessage());
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
            log.info("[E-LIBRARY] Google Drive folder accessible: true");
            return folder;
        } catch (Exception e) {
            log.error("[E-LIBRARY] Google Drive folder accessible: false - Error: {}", e.getMessage());
            return null;
        }
    }

    @Override
    public String uploadFile(InputStream inputStream, String fileName, String mimeType, long size) {
        try {
            Drive drive = getDriveService();

            File fileMetadata = new File();
            fileMetadata.setName(fileName);
            if (folderId != null && !folderId.isBlank()) {
                fileMetadata.setParents(Collections.singletonList(folderId));
            }

            InputStreamContent mediaContent = new InputStreamContent(mimeType, inputStream);
            if (size > 0) {
                mediaContent.setLength(size);
            }

            File uploadedFile = drive.files().create(fileMetadata, mediaContent)
                    .setSupportsAllDrives(true)
                    .setFields("id, name, mimeType, size")
                    .execute();

            if (uploadedFile == null || uploadedFile.getId() == null) {
                throw new IllegalStateException("Google Drive returned empty response or missing file ID.");
            }

            log.info("[E-LIBRARY] Upload completed");
            log.info("[E-LIBRARY] Google Drive file ID: {}", uploadedFile.getId());
            if (uploadedFile.getSize() != null) {
                log.info("[E-LIBRARY] Google Drive stored size: {} bytes", uploadedFile.getSize());
            }

            return uploadedFile.getId();
        } catch (Exception e) {
            log.error("[GOOGLE_DRIVE] PDF upload failed for file '{}': {}", fileName, e.getMessage());
            throw new RuntimeException("Google Drive PDF upload failed: " + e.getMessage(), e);
        }
    }

    @Override
    public InputStream downloadFile(String fileId) {
        try {
            Drive drive = getDriveService();
            log.info("[GOOGLE_DRIVE] Streaming PDF file with ID: {}", fileId);
            return drive.files().get(fileId)
                    .setSupportsAllDrives(true)
                    .executeMediaAsInputStream();
        } catch (Exception e) {
            log.error("[GOOGLE_DRIVE] PDF streaming failed for file ID '{}': {}", fileId, e.getMessage());
            throw new RuntimeException("Failed to stream PDF from Google Drive: " + e.getMessage(), e);
        }
    }
}
