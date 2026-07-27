package com.homeopathy.college.config;

import com.mongodb.ConnectionString;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class MongoConnectionValidator {

    private final MongoTemplate mongoTemplate;

    @Value("${spring.data.mongodb.uri:}")
    private String mongoUri;

    @EventListener(ApplicationReadyEvent.class)
    public void validateConnection() {
        log.info("========== MongoDB Connection Audit ==========");

        String dbName = "Unknown";
        String username = "None";
        String hosts = "Unknown";

        if (mongoUri != null && !mongoUri.trim().isEmpty()) {
            try {
                ConnectionString connectionString = new ConnectionString(mongoUri);
                if (connectionString.getDatabase() != null) {
                    dbName = connectionString.getDatabase();
                }
                if (connectionString.getUsername() != null) {
                    username = connectionString.getUsername();
                }
                List<String> hostList = connectionString.getHosts();
                if (hostList != null && !hostList.isEmpty()) {
                    hosts = String.join(", ", hostList);
                }
            } catch (Exception e) {
                log.warn("Unable to parse MongoDB URI string details: {}", e.getMessage());
            }
        }

        try {
            if ("Unknown".equals(dbName) && mongoTemplate.getDb() != null) {
                dbName = mongoTemplate.getDb().getName();
            }

            mongoTemplate.executeCommand(new Document("ping", 1));
            log.info("MongoDB Connection SUCCESSFUL!");
            log.info("MongoDB Host(s): [{}]", hosts);
            log.info("MongoDB Database: [{}]", dbName);
            log.info("MongoDB Username: [{}]", username);
        } catch (Exception e) {
            log.error("MongoDB Connection FAILED!");
            log.error("MongoDB Host(s): [{}]", hosts);
            log.error("MongoDB Database: [{}]", dbName);
            log.error("MongoDB Username: [{}]", username);
            log.error("MongoDB Error Details: {}", e.getMessage());
        }
        log.info("===============================================");
    }
}
