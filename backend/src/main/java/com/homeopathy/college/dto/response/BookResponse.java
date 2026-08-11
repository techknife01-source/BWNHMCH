package com.homeopathy.college.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookResponse {
    private String id;
    private String title;
    private String author;
    private String category;
    private String semester;
    private String description;
    private String fileName;
    private String mimeType;
    private Long fileSize;
    private String googleDriveFileId;
    private String pdfUrl;
    private boolean published;
    private String uploadedBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
