package com.homeopathy.college.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "gallery")
public class GalleryItem {

    @Id
    private String id;
    private String title;
    private String description;
    private String category;
    private String uploadDate;
    private String status;
    private String imageUrl;

    private GalleryImage image;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class GalleryImage {
        private String driveFileId;
        private String fileName;
        private String mimeType;
    }
}
