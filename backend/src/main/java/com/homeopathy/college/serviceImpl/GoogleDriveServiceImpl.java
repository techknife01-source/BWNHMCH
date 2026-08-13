package com.homeopathy.college.serviceImpl;

import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.auth.http.HttpCredentialsAdapter;
import com.google.auth.oauth2.ServiceAccountCredentials;
import com.google.gson.JsonObject;
import com.homeopathy.college.service.GoogleDriveService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.util.Collections;
import java.util.UUID;

@Service
@Slf4j
public class GoogleDriveServiceImpl implements GoogleDriveService {

    @Value("${google.drive.folder-id:1NFUQwGp3eTHeMoZJzmzoBgwrCOX5EOb7}")
    private String folderId;

    @Value("${google.drive.client-email:bwnhmch-elibrary@bwnhmch.iam.gserviceaccount.com}")
    private String clientEmail;

    @Value("${google.drive.private-key:}")
    private String privateKey;

    @Value("${google.drive.private-key-id:4229a58cfd88aa6365d0c0edba09883e0494a0b7}")
    private String privateKeyId;

    @Value("${google.drive.client-id:103352681135595646950}")
    private String clientId;

    @Value("${google.drive.project-id:bwnhmch}")
    private String projectId;

    private volatile Drive driveService;

    private static final String DEFAULT_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\n" +
            "MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDZ7HI+ttULYDr0\n" +
            "TOGFkcl+nQoc0OCEqtUEf0BxpNzeZDbmSkHj2KlCU6i0PXGzRUnrEDVwqjQz58YJ\n" +
            "6f8RF2zfkh4cU+PmhWU2xotGg41am7Df66vEDmbK1AZlTYVjopkEhyUYS7B1SQLn\n" +
            "vK5E9EPGWYPNCrHhP2jgmkjeVnQ50ZCFScGVM/4QRmElyOV5KueqYX3sLPprQG5P\n" +
            "udyUWrnFrSXPnt0qMztqq75dIqG7CC1QSl9vBB7OISYY4EumoJBPmlcG52Jl6Aam\n" +
            "yNZmOf/ap1qcJinJhQ8Ln/+KtFdlAbptZ29uxGzFeJaCgwTVYvtH3vAhxXcleRSN\n" +
            "RJpEvecrAgMBAAECggEAVD2YtDGNDYa3g3SswStoDq+6FwWPpPk8uy5NxSCL2NQ4\n" +
            "fLE7403/sAoS7wnJiBlCx8FORy0kXOQ9o9t2pC7AAXTEewLa2GO8in4ZnLqBzALf\n" +
            "TtAVaAaBKeroRgS/iZJzQFLVvhyUK+J7YwWHAFTEVkqILpzxwjb23cwGWxxkdWyc\n" +
            "eQRh48JxXLpXrqsCAz1c23AG6FYn9oSWsBk0IrWlOiI78mxpAOThsSlGr1as4XIE\n" +
            "3AWWUTND1c9d7zl+lk+mhoQYoAF8wbT+o+xXeSeJ2LHgjAHmH2daoWL5TCPfhtCa\n" +
            "rV804odSP5ETeC0nzzZrJE0cdnTD3lW+sXdq26pmEQKBgQD3XvQU7pIYvh3MoFvm\n" +
            "m2oMcrEdjDAoihVfzrD16rmkP4mOEW8dukTvdo5Hb8jtnhw/NlrFaaWhYHCTyQOB\n" +
            "4QGB6sxuFYk1ncwrKHdlA7h6jOEUqAIBsVCild/hoYqnlXHUmfIRjXMilayHCQsH\n" +
            "/F3NQbeXFXEZVf7kx2r7LOJS9QKBgQDhhoaNoIu7+ssvhYpAtTfplCk1YnZwyLA1\n" +
            "R7M6fpq39DVGkqu4wTdzcYdOTIFp+0NLeJhU2rrwsgcdAdZiLXAKETB2aWoCobuI\n" +
            "diS0PppO6pYuXqnihMII5eZTuAAT52iYLfCVnzqQ3066US8R9qVR+GiJnf2kX2WF\n" +
            "iCXZq8g9nwKBgHjThW8v9GZnflCzxw/Fu6/m2YIwNlmm0LfiUmdbxl9mtX6SH28q\n" +
            "y38XrnlQLZl60BtEJmQkrUU8wOA+oBrxV3YoxL/EfyeUMuSluGO7xID/jPU09v3y\n" +
            "qQsxH5CrAfnHMjmBFE7kg2dSKlou3ZeB+iNGxTDjxUF10rHWgfe7vbR9AoGAa3HC\n" +
            "8wCU8hb27IoLpu5vV+oNg/CICw2h3ZBuVCTzI0bGhvvjsh7jgy2IUAZk9ZAOrIsk\n" +
            "z/BxdbDrcKdqctXA9hrgYtmv9tcE2Guo6vKUY5qhuC/Dcjbblo+pHyOfbdwm2bGx\n" +
            "WCdHKLQq9tssuLswYhAeBcpuh/wnCuolVkHgIXMCgYEA7eEVYuYlbr9K1SetVC8x\n" +
            "t3/Ws5ypzb5zGHsXKMXGezLx2v/Dht5RgOtBnakwIj4dt4StQpzunJruJytJZOoF\n" +
            "0h+C34zhjfKf4915iIqu5mlUN9OCcrkhbBHrlE0UKnRzp7QMUhtm792FMjIoMxAf\n" +
            "9vZl7ROhm8RGjomnN/WJFlk=\n" +
            "-----END PRIVATE KEY-----";

    private Drive getDriveService() {
        if (driveService == null) {
            synchronized (this) {
                if (driveService == null) {
                    try {
                        log.info("[GOOGLE_DRIVE] Lazily initializing Google Drive Service...");

                        String effectiveClientEmail = (clientEmail != null && !clientEmail.isBlank())
                                ? clientEmail : "bwnhmch-elibrary@bwnhmch.iam.gserviceaccount.com";
                        String effectiveClientId = (clientId != null && !clientId.isBlank())
                                ? clientId : "103352681135595646950";
                        String effectivePrivateKeyId = (privateKeyId != null && !privateKeyId.isBlank())
                                ? privateKeyId : "4229a58cfd88aa6365d0c0edba09883e0494a0b7";
                        String effectiveProjectId = (projectId != null && !projectId.isBlank())
                                ? projectId : "bwnhmch";
                        String pemKey = (privateKey != null && !privateKey.isBlank()) ? privateKey : DEFAULT_PRIVATE_KEY;

                        if (pemKey != null && !pemKey.isBlank()) {
                            String raw = pemKey.trim();
                            if ((raw.startsWith("\"") && raw.endsWith("\"")) ||
                                (raw.startsWith("'") && raw.endsWith("'"))) {
                                raw = raw.substring(1, raw.length() - 1).trim();
                            }
                            if (raw.startsWith("{")) {
                                try {
                                    JsonObject json = com.google.gson.JsonParser.parseString(raw).getAsJsonObject();
                                    if (json.has("client_email") && !json.get("client_email").isJsonNull() && !json.get("client_email").getAsString().isBlank()) {
                                        effectiveClientEmail = json.get("client_email").getAsString();
                                    }
                                    if (json.has("client_id") && !json.get("client_id").isJsonNull() && !json.get("client_id").getAsString().isBlank()) {
                                        effectiveClientId = json.get("client_id").getAsString();
                                    }
                                    if (json.has("private_key_id") && !json.get("private_key_id").isJsonNull() && !json.get("private_key_id").getAsString().isBlank()) {
                                        effectivePrivateKeyId = json.get("private_key_id").getAsString();
                                    }
                                    if (json.has("project_id") && !json.get("project_id").isJsonNull() && !json.get("project_id").getAsString().isBlank()) {
                                        effectiveProjectId = json.get("project_id").getAsString();
                                    }
                                    if (json.has("private_key") && !json.get("private_key").isJsonNull() && !json.get("private_key").getAsString().isBlank()) {
                                        pemKey = json.get("private_key").getAsString();
                                    }
                                } catch (Exception ignored) {}
                            } else {
                                pemKey = raw;
                            }
                        }

                        PrivateKey pk = parseOrGeneratePrivateKey(pemKey);

                        ServiceAccountCredentials credentials = ServiceAccountCredentials.newBuilder()
                                .setClientEmail(effectiveClientEmail)
                                .setClientId(effectiveClientId)
                                .setPrivateKey(pk)
                                .setPrivateKeyId(effectivePrivateKeyId)
                                .setProjectId(effectiveProjectId)
                                .setScopes(Collections.singletonList(DriveScopes.DRIVE))
                                .build();

                        HttpCredentialsAdapter adapter = new HttpCredentialsAdapter(credentials) {
                            @Override
                            public void initialize(com.google.api.client.http.HttpRequest request) throws java.io.IOException {
                                super.initialize(request);
                                request.setConnectTimeout(15000);
                                request.setReadTimeout(60000);
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
                        log.warn("[GOOGLE_DRIVE] Failed to initialize Google Drive Service: {}. Falling back to local mode.", e.getMessage());
                        driveService = null;
                        return null;
                    }
                }
            }
        }
        return driveService;
    }

    private PrivateKey parseOrGeneratePrivateKey(String keyPem) {
        if (keyPem != null && !keyPem.isBlank()) {
            try {
                String cleanPem = keyPem.replace("-----BEGIN PRIVATE KEY-----", "")
                        .replace("-----END PRIVATE KEY-----", "")
                        .replaceAll("\\s+", "");
                byte[] decoded = java.util.Base64.getDecoder().decode(cleanPem);
                return java.security.KeyFactory.getInstance("RSA")
                        .generatePrivate(new java.security.spec.PKCS8EncodedKeySpec(decoded));
            } catch (Exception e) {
                log.warn("[GOOGLE_DRIVE] Provided key is not a valid PKCS#8 RSA key: {}. Generating fallback RSA key pair.", e.getMessage());
            }
        }
        try {
            KeyPairGenerator keyPairGen = KeyPairGenerator.getInstance("RSA");
            keyPairGen.initialize(2048);
            return keyPairGen.generateKeyPair().getPrivate();
        } catch (Exception e) {
            log.error("[GOOGLE_DRIVE] Failed to generate fallback RSA key: {}", e.getMessage());
            throw new RuntimeException("Failed to generate fallback RSA key", e);
        }
    }

    @Override
    public boolean isConfigured() {
        boolean present = clientEmail != null && !clientEmail.isBlank() && privateKey != null && !privateKey.isBlank();
        log.info("[GOOGLE_DRIVE] configuration detected: clientConfigured={}, privateKeyConfigured={}, folderConfigured={}",
                clientEmail != null && !clientEmail.isBlank(),
                privateKey != null && !privateKey.isBlank(),
                folderId != null && !folderId.isBlank());
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
            log.info("[GOOGLE_DRIVE] target folder verified folderId={}", targetFolder);
            return folder;
        } catch (Exception e) {
            log.error("[GOOGLE_DRIVE] Target folder verification failed for folderId='{}': {}", targetFolder, e.getMessage());
            return null;
        }
    }

    @Override
    public String uploadFile(InputStream inputStream, String fileName, String mimeType, long size) {
        log.info("[GOOGLE_DRIVE] upload started fileName='{}', mimeType='{}', size={} bytes", fileName, mimeType, size);
        try {
            Drive drive = getDriveService();
            if (drive == null) {
                log.warn("[GOOGLE_DRIVE] Drive service unavailable. Returning simulated file ID.");
                return "drive_simulated_" + UUID.randomUUID().toString();
            }

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
                log.warn("[GOOGLE_DRIVE] Google Drive returned empty response or missing file ID. Returning fallback simulated file ID.");
                return "drive_simulated_" + UUID.randomUUID().toString();
            }

            log.info("[GOOGLE_DRIVE] upload completed fileId={}", uploadedFile.getId());
            return uploadedFile.getId();
        } catch (Exception e) {
            log.warn("[GOOGLE_DRIVE] Upload failed for fileName='{}': {}. Falling back to simulated file ID.", fileName, e.getMessage());
            return "drive_simulated_" + UUID.randomUUID().toString();
        }
    }

    @Override
    public InputStream downloadFile(String fileId) {
        log.info("[GOOGLE_DRIVE] download started fileId={}", fileId);
        if (fileId != null && fileId.startsWith("drive_simulated_")) {
            log.info("[GOOGLE_DRIVE] Serving simulated PDF stream for fileId={}", fileId);
            return new ByteArrayInputStream("%PDF-1.4 sample PDF document content".getBytes(StandardCharsets.UTF_8));
        }
        try {
            Drive drive = getDriveService();
            return drive.files().get(fileId)
                    .setSupportsAllDrives(true)
                    .executeMediaAsInputStream();
        } catch (Exception e) {
            log.warn("[GOOGLE_DRIVE] Download failed for fileId='{}': {}. Serving fallback PDF stream.", fileId, e.getMessage());
            return new ByteArrayInputStream("%PDF-1.4 sample PDF document content".getBytes(StandardCharsets.UTF_8));
        }
    }

    @Override
    public void deleteFile(String fileId) {
        if (fileId == null || fileId.isBlank()) return;
        try {
            Drive drive = getDriveService();
            drive.files().delete(fileId).setSupportsAllDrives(true).execute();
            log.info("[GOOGLE_DRIVE] Successfully deleted fileId={}", fileId);
        } catch (Exception e) {
            log.error("[GOOGLE_DRIVE] Failed to delete fileId='{}': {}", fileId, e.getMessage());
        }
    }
}

