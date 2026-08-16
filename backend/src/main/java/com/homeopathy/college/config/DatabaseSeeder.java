package com.homeopathy.college.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    @Override
    public void run(String... args) throws Exception {
        log.info("[STARTUP] DatabaseSeeder: Startup auto-seeding disabled to preserve persistent database state.");
    }
}
