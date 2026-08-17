package com.homeopathy.college.service;

import com.homeopathy.college.entity.Staff;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface StaffService {

    List<Staff> getAllStaff();

    Staff getStaffById(String id);

    Staff createStaff(Staff staff);

    Staff updateStaff(String id, Staff staffDetails);

    void deleteStaff(String id);

    Staff uploadStaffPhoto(String id, MultipartFile file);

    void deleteStaffPhoto(String id);
}
