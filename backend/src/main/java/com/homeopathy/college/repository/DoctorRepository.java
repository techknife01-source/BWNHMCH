package com.homeopathy.college.repository;

import com.homeopathy.college.entity.Doctor;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends MongoRepository<Doctor, String> {
    List<Doctor> findByDepartmentId(String departmentId);
    List<Doctor> findByStatus(String status);
}
