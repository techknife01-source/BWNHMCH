package com.homeopathy.college;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

@SpringBootApplication
@EnableMongoAuditing
public class SmartHomeopathicCollegeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SmartHomeopathicCollegeApplication.class, args);
    }
}
