package com.homeopathy.college.config;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@Slf4j
public class MongoConfig {

    @Value("${spring.data.mongodb.uri:mongodb://localhost:27017/bwnhmch}")
    private String rawMongoUri;

    public static String sanitizeUri(String rawUri) {
        if (rawUri == null) {
            return "mongodb://localhost:27017/bwnhmch";
        }
        String uri = rawUri.trim();

        // Strip leading and trailing quotes or newlines
        boolean changed = true;
        while (changed) {
            changed = false;
            uri = uri.replaceAll("[\\r\\n]", "").trim();
            if ((uri.startsWith("\"") && uri.endsWith("\"")) ||
                (uri.startsWith("'") && uri.endsWith("'"))) {
                uri = uri.substring(1, uri.length() - 1).trim();
                changed = true;
            } else if (uri.startsWith("\"") || uri.startsWith("'")) {
                uri = uri.substring(1).trim();
                changed = true;
            } else if (uri.endsWith("\"") || uri.endsWith("'")) {
                uri = uri.substring(0, uri.length() - 1).trim();
                changed = true;
            }
        }

        if (uri.isEmpty()) {
            return "mongodb://localhost:27017/bwnhmch";
        }

        // Ensure mongodb+srv:// URIs explicitly specify authSource=admin if not present
        if (uri.startsWith("mongodb+srv://") && !uri.toLowerCase().contains("authsource=")) {
            if (uri.contains("?")) {
                uri = uri + "&authSource=admin";
            } else {
                uri = uri + "?authSource=admin";
            }
        }

        return uri;
    }

    @Bean
    public MongoClient mongoClient() {
        String sanitizedUri = sanitizeUri(rawMongoUri);

        try {
            ConnectionString connectionString = new ConnectionString(sanitizedUri);

            boolean isSrv = sanitizedUri.startsWith("mongodb+srv://");
            String dbName = connectionString.getDatabase() != null ? connectionString.getDatabase() : "bwnhmch";
            String username = connectionString.getUsername() != null ? connectionString.getUsername() : "None";
            List<String> hostsList = connectionString.getHosts();
            String hosts = (hostsList != null && !hostsList.isEmpty()) ? String.join(", ", hostsList) : "Unknown";
            String authSource = (connectionString.getCredential() != null && connectionString.getCredential().getSource() != null)
                    ? connectionString.getCredential().getSource()
                    : (isSrv ? "admin" : "default");

            log.info("========== MongoDB Configuration Audit ==========");
            log.info("Atlas SRV Protocol : {}", isSrv ? "YES (mongodb+srv://)" : "NO (mongodb://)");
            log.info("Mongo Host(s)       : {}", hosts);
            log.info("Target Database     : {}", dbName);
            log.info("Mongo Username      : {}", username);
            log.info("Auth Source         : {}", authSource);
            log.info("Retry Writes        : {}", sanitizedUri.contains("retryWrites=true") ? "ENABLED" : "NOT SET");
            log.info("================================================");

            if (!"bwnhmch".equalsIgnoreCase(dbName)) {
                log.warn("Target database in URI is '{}'. Note: BWNHMCH application expects database 'bwnhmch'.", dbName);
            }

            MongoClientSettings settings = MongoClientSettings.builder()
                    .applyConnectionString(connectionString)
                    .build();

            return MongoClients.create(settings);
        } catch (Exception e) {
            log.error("Failed to construct MongoClient with sanitized URI: {}. Error: {}", sanitizedUri, e.getMessage());
            throw e;
        }
    }
}
