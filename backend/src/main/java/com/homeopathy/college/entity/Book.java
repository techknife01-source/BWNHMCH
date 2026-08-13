package com.homeopathy.college.entity;

import com.homeopathy.college.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

@Document(collection = "books")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Book extends BaseEntity {

    @Field("id")
    private String customId;

    private String title;
    private String author;
    private String category;
    private String semester;
    private String department;
    private String subject;
    private String publisher;
    private String description;
    private String fileName;
    private String mimeType;
    private Long fileSize;
    private String googleDriveFileId;
    private String storageProvider; // e.g. "GOOGLE_DRIVE"

    @Builder.Default
    private boolean allowDownload = true;

    @Builder.Default
    private boolean published = true;

    private String uploadedBy;
}

