package com.homeopathy.college.repository;

import com.homeopathy.college.entity.GalleryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GalleryRepository extends MongoRepository<GalleryItem, String> {
    List<GalleryItem> findByCategory(String category);
    List<GalleryItem> findByStatus(String status);
}
