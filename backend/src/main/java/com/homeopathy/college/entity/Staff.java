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
@Document(collection = "staff")
public class Staff {

    @Id
    private String id;
    private Integer slNo;
    private String empId;
    private String name;
    private String designation;
    private String department;
    private String roleCategory;
    private String staffCategory;
    private String category;
    private Integer displayOrder;
    private String qualification;
    private String specialization;
    private String email;
    private String phone;
    private String contactNumber;
    private String registrationNumber;
    private String joiningDate;
    private String promotionDate;
    private String experienceYears;
    private String biography;
    private String availability;
    private String dutyShift;
    private String opdCounter;
    private String status;
    private String photoUrl;

    private StaffPhoto photo;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StaffPhoto {
        private String driveFileId;
        private String fileName;
        private String mimeType;
    }
}
