package com.homeopathy.college.service;

import com.homeopathy.college.common.PageResponse;
import com.homeopathy.college.entity.AuditLog;

public interface AuditLogService {

    void logAction(String userId, String username, String role, String action, String module, String details, String ipAddress, String status);

    PageResponse<AuditLog> getLogsForUser(String userId, int page, int size);

    PageResponse<AuditLog> getLogsForModule(String module, int page, int size);
}
