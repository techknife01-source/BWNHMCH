package com.homeopathy.college;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@Slf4j
@SpringBootApplication
public class SmartHomeopathicCollegeApplication {

    public static void main(String[] args) {
        log.info("[STARTUP] Starting BWNHMCH backend service...");
        log.info("[STARTUP] Java/Spring Boot initialization in progress...");
        log.info("[STARTUP] Database configuration loaded");
        log.info("[STARTUP] Google Drive configuration loaded (lazy mode)");

        try {
            SpringApplication.run(SmartHomeopathicCollegeApplication.class, args);
            log.info("[STARTUP] Starting HTTP server completed successfully!");
        } catch (Exception e) {
            log.error("[STARTUP] Application startup failed with exception:", e);
            throw e;
        }
    }
}
