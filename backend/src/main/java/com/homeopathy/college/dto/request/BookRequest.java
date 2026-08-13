package com.homeopathy.college.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class BookRequest {
    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    private String category;
    private String semester;
    private String department;
    private String subject;
    private String publisher;
    private String description;
    private Boolean allowDownload = true;
    private Boolean published = true;
}
