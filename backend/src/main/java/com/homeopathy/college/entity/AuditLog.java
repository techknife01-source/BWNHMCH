package com.homeopathy.college.entity;

import com.homeopathy.college.common.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
@Document(collection = "audit_logs")
public class AuditLog extends BaseEntity {

    private String userId;
    private String username;
    private String userRole;
    private String action;
    private String module;
    private String details;
    private String ipAddress;
    private String userAgent;
    private String status; // SUCCESS / FAILED
}
