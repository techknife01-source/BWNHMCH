package com.homeopathy.college.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "gallery")
public class GalleryItem {

    @Id
    private String id;

    @Field("id")
    private String customId;

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

    public void setId(String id) {
        this.id = id;
        if (this.customId == null || this.customId.isBlank()) {
            this.customId = id;
        }
    }

    public String getId() {
        if (this.id != null && !this.id.isBlank()) {
            return this.id;
        }
        return this.customId;
    }

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
