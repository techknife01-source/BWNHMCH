package com.homeopathy.college.config;

import lombok.extern.slf4j.Slf4j;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Slf4j
public class DotenvLoader {

    public static void loadDotenv() {
        List<Path> candidatePaths = List.of(
            Paths.get(".env"),
            Paths.get("../.env"),
            Paths.get("backend/.env")
        );

        for (Path path : candidatePaths) {
            if (Files.exists(path) && Files.isReadable(path) && !Files.isDirectory(path)) {
                try {
                    List<String> lines = Files.readAllLines(path, StandardCharsets.UTF_8);
                    int loadedCount = 0;
                    for (String line : lines) {
                        String trimmed = line.trim();
                        if (trimmed.isEmpty() || trimmed.startsWith("#")) {
                            continue;
                        }
                        int eqIdx = trimmed.indexOf('=');
                        if (eqIdx > 0) {
                            String key = trimmed.substring(0, eqIdx).trim();
                            String value = trimmed.substring(eqIdx + 1).trim();

                            // Strip surrounding single or double quotes
                            if ((value.startsWith("\"") && value.endsWith("\"")) ||
                                (value.startsWith("'") && value.endsWith("'"))) {
                                if (value.length() >= 2) {
                                    value = value.substring(1, value.length() - 1);
                                }
                            }
                            value = value.replace("\\n", "\n");

                            // Environment variables from OS take precedence; set System property if unassigned
                            if (System.getenv(key) == null && System.getProperty(key) == null) {
                                System.setProperty(key, value);
                                loadedCount++;
                            }
                        }
                    }
                    log.info("[DOTENV] Loaded {} environment variables from file: {}", loadedCount, path.toAbsolutePath());
                    break; // Load first valid .env found
                } catch (Exception e) {
                    log.warn("[DOTENV] Failed to read .env file at {}: {}", path.toAbsolutePath(), e.getMessage());
                }
            }
        }
    }
}
