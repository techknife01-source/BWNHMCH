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

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017/bwnhmch}")
    private String mongoUri;

    @EventListener(ApplicationReadyEvent.class)
    public void validateConnection() {
        log.info("========== MongoDB Connection Validator ==========");

        String sanitizedUri = MongoConfig.sanitizeUri(mongoUri);
        String dbName = "bwnhmch";
        String username = "None";
        String hosts = "Unknown";
        String authSource = "default";
        boolean isSrv = sanitizedUri.startsWith("mongodb+srv://");

        try {
            ConnectionString connectionString = new ConnectionString(sanitizedUri);
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
            if (connectionString.getCredential() != null && connectionString.getCredential().getSource() != null) {
                authSource = connectionString.getCredential().getSource();
            }
        } catch (Exception e) {
            log.warn("Unable to parse sanitized MongoDB URI details: {}", e.getMessage());
        }

        try {
            if (mongoTemplate.getDb() != null && ("Unknown".equals(dbName) || "bwnhmch".equals(dbName))) {
                dbName = mongoTemplate.getDb().getName();
            }

            mongoTemplate.executeCommand(new Document("ping", 1));
            log.info("MongoDB Connection Status: SUCCESS");
            log.info("SRV Protocol (Atlas): [{}]", isSrv);
            log.info("MongoDB Host(s)     : [{}]", hosts);
            log.info("MongoDB Database    : [{}]", dbName);
            log.info("MongoDB Username    : [{}]", username);
            log.info("Authentication Source: [{}]", authSource);
        } catch (Exception e) {
            log.error("MongoDB Connection Status: FAILED");
            log.error("SRV Protocol (Atlas): [{}]", isSrv);
            log.error("MongoDB Host(s)     : [{}]", hosts);
            log.error("MongoDB Database    : [{}]", dbName);
            log.error("MongoDB Username    : [{}]", username);
            log.error("Authentication Source: [{}]", authSource);
            log.error("Failure Reason      : {}", e.getMessage());
            if (e.getMessage() != null && (e.getMessage().contains("auth") || e.getMessage().contains("Authentication"))) {
                log.error("Troubleshooting Tip: 'bad auth : authentication failed' usually means:");
                log.error("1. The database password or username in MONGODB_URI environment variable is incorrect.");
                log.error("2. The database user credentials in MongoDB Atlas were not created under the 'admin' authSource or permissions are restricted.");
                log.error("3. Special characters in the password (e.g. '@', ':', '/') must be URL-encoded (e.g. '@' -> '%40').");
            }
        }
        log.info("===============================================");
    }
}
