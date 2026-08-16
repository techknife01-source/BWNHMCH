package com.homeopathy.college.config;

import com.homeopathy.college.entity.Faculty;
import com.homeopathy.college.repository.FacultyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class DatabaseSeeder implements CommandLineRunner {

    private final FacultyRepository facultyRepository;

    @Override
    public void run(String... args) throws Exception {
        log.info("[STARTUP] Checking MongoDB database seeder status...");
        seedFacultyMembers();
    }

    private void seedFacultyMembers() {
        try {
            List<Faculty> allSeedRecords = getHistoricalFacultyAndStaffList();
            int insertedCount = 0;
            int existingCount = 0;

            List<Faculty> existingList = facultyRepository.findAll();

            for (Faculty seed : allSeedRecords) {
                boolean exists = existingList.stream().anyMatch(f ->
                        (f.getId() != null && f.getId().equalsIgnoreCase(seed.getId()))
                        || (seed.getEmpId() != null && f.getEmpId() != null && seed.getEmpId().equalsIgnoreCase(f.getEmpId()))
                        || (seed.getRegistrationNumber() != null && !seed.getRegistrationNumber().isBlank() && f.getRegistrationNumber() != null && seed.getRegistrationNumber().equalsIgnoreCase(f.getRegistrationNumber()))
                        || (seed.getName() != null && f.getName() != null && seed.getName().equalsIgnoreCase(f.getName()))
                );

                if (!exists) {
                    facultyRepository.save(seed);
                    insertedCount++;
                } else {
                    existingCount++;
                }
            }

            log.info("[STARTUP] Faculty database sync complete. Inserted new records: {}, Preserved existing records: {}, Total in collection: {}",
                    insertedCount, existingCount, facultyRepository.count());
        } catch (Exception e) {
            log.error("[STARTUP] Error seeding faculty members: ", e);
        }
    }

    private List<Faculty> getHistoricalFacultyAndStaffList() {
        return Arrays.asList(
                Faculty.builder()
                        .id("fac-test-001")
                        .slNo(1)
                        .empId("TEST-FAC-001")
                        .name("Rajesh Pal")
                        .designation("Assistant Professor")
                        .department("Homoeopathic Medicine")
                        .departmentId("med")
                        .qualification("BHMS, MD (Hom)")
                        .specialization("Homoeopathic Medicine")
                        .email("rajesh.pal@bhmc.edu.in")
                        .phone("+91 98000 00001")
                        .registrationNumber("TEST-FAC-001")
                        .joiningDate("2024-01-01")
                        .status("Active")
                        .build()
        );
    }
}
