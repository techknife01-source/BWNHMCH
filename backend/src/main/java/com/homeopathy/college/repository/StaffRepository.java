package com.homeopathy.college.repository;

import com.homeopathy.college.entity.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {

    Optional<Staff> findByEmpId(String empId);

    Optional<Staff> findByNameIgnoreCase(String name);

    List<Staff> findByStatus(String status);
}
