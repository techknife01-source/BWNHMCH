package com.homeopathy.college.config;

import com.homeopathy.college.entity.Role;
import com.homeopathy.college.entity.User;
import com.homeopathy.college.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.HashSet;

@Component
@RequiredArgsConstructor
@Slf4j
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MongoTemplate mongoTemplate;

    @Override
    public void run(String... args) {
        log.info("[STARTUP] Attempting MongoDB database initialization and default user seeding...");

        try {
            // Ensure collection exists in MongoDB database
            if (!mongoTemplate.collectionExists(User.class)) {
                mongoTemplate.createCollection(User.class);
                log.info("[STARTUP] Created 'users' collection in database '{}'", mongoTemplate.getDb().getName());
            }

            // Seed default accounts
            seedUser("superadmin", "superadmin@bwnhmch.com", "SuperAdmin@123", "Super Admin", Role.ROLE_SUPER_ADMIN);
            seedUser("admin", "admin@bwnhmch.com", "Admin@123", "System Administrator", Role.ROLE_ADMIN);
            seedUser("principal", "principal@bwnhmch.com", "Principal@123", "College Principal", Role.ROLE_PRINCIPAL);
            seedUser("viceprincipal", "viceprincipal@bwnhmch.com", "VicePrincipal@123", "Vice Principal", Role.ROLE_VICE_PRINCIPAL);
            seedUser("hod", "hod@bwnhmch.com", "Hod@123", "Head of Department", Role.ROLE_HOD);
            seedUser("faculty1", "faculty1@bwnhmch.com", "Faculty@123", "Faculty Member", Role.ROLE_FACULTY);
            seedUser("librarian", "librarian@bwnhmch.com", "Library@123", "Librarian", Role.ROLE_LIBRARIAN);
            seedUser("accountant", "accounts@bwnhmch.com", "Accounts@123", "Chief Accountant", Role.ROLE_ACCOUNTANT);
            seedUser("admission", "admission@bwnhmch.com", "Admission@123", "Admission Cell Officer", Role.ROLE_ADMISSION_CELL);
            seedUser("student1", "student1@bwnhmch.com", "Student@123", "Student One", Role.ROLE_STUDENT);

            log.info("[STARTUP] Database seeding completed successfully.");
        } catch (Throwable e) {
            log.error("[STARTUP] Database seeding skipped or failed due to MongoDB error: {}", e.getMessage());
            log.warn("[STARTUP] Application startup continues gracefully without crashing.");
        }
    }

    private void seedUser(String username, String email, String rawPassword, String fullName, Role role) {
        try {
            if (Boolean.TRUE.equals(userRepository.existsByUsername(username)) || Boolean.TRUE.equals(userRepository.existsByEmail(email))) {
                log.info("User with username '{}' or email '{}' already exists. Skipping creation.", username, email);
                return;
            }

            User user = User.builder()
                    .username(username)
                    .email(email)
                    .password(passwordEncoder.encode(rawPassword))
                    .fullName(fullName)
                    .roles(new HashSet<>(Collections.singletonList(role)))
                    .enabled(true)
                    .accountNonLocked(true)
                    .failedAttempt(0)
                    .build();

            userRepository.save(user);
            log.info("Seeded default user: {} ({}) with role {}", username, email, role);
        } catch (Throwable e) {
            log.error("Failed to seed user '{}' ({}): {}", username, email, e.getMessage());
        }
    }
}
