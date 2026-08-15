package com.homeopathy.college.repository;

import com.homeopathy.college.entity.Faculty;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyRepository extends MongoRepository<Faculty, String> {
    List<Faculty> findByDepartmentId(String departmentId);
    List<Faculty> findByStatus(String status);
}
