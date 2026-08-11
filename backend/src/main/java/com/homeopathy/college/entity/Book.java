package com.homeopathy.college.entity;

import com.homeopathy.college.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "books")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Book extends BaseEntity {

    private String title;
    private String author;
    private String category;
    private String semester;
    private String description;
    private String fileName;
    private String mimeType;
    private Long fileSize;
    private String googleDriveFileId;
    private String storageProvider; // e.g. "GOOGLE_DRIVE" or "LOCAL"
    private boolean published;
    private String uploadedBy;
}
