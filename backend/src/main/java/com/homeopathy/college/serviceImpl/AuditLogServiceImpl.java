package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.common.PageResponse;
import com.homeopathy.college.entity.AuditLog;
import com.homeopathy.college.repository.AuditLogRepository;
import com.homeopathy.college.service.AuditLogService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuditLogServiceImpl implements AuditLogService {

    private final AuditLogRepository auditLogRepository;

    @Async
    @Override
    public void logAction(String userId, String username, String role, String action, String module, String details, String ipAddress, String status) {
        try {
            AuditLog auditLog = AuditLog.builder()
                    .userId(userId)
                    .username(username)
                    .userRole(role)
                    .action(action)
                    .module(module)
                    .details(details)
                    .ipAddress(ipAddress)
                    .status(status)
                    .build();

            auditLogRepository.save(auditLog);
            log.info("Audit logged: user={} action={} module={}", username, action, module);
        } catch (Exception e) {
            log.error("Failed to persist audit log entry", e);
        }
    }

    @Override
    public PageResponse<AuditLog> getLogsForUser(String userId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AuditLog> pageResult = auditLogRepository.findByUserId(userId, pageable);

        return PageResponse.<AuditLog>builder()
                .content(pageResult.getContent())
                .pageNo(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .last(pageResult.isLast())
                .build();
    }

    @Override
    public PageResponse<AuditLog> getLogsForModule(String module, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        Page<AuditLog> pageResult = auditLogRepository.findByModule(module, pageable);

        return PageResponse.<AuditLog>builder()
                .content(pageResult.getContent())
                .pageNo(pageResult.getNumber())
                .pageSize(pageResult.getSize())
                .totalElements(pageResult.getTotalElements())
                .totalPages(pageResult.getTotalPages())
                .last(pageResult.isLast())
                .build();
    }
}
