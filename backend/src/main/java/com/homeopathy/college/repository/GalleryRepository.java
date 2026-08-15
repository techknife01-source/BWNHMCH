package com.homeopathy.college.repository;

import com.homeopathy.college.entity.GalleryItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GalleryRepository extends MongoRepository<GalleryItem, String> {
    List<GalleryItem> findByCategory(String category);
    List<GalleryItem> findByStatus(String status);

    @Query("{ '$or': [ { '_id': ?0 }, { 'id': ?0 }, { 'imageUrl': { '$regex': ?0 } } ] }")
    Optional<GalleryItem> findByIdOrCustomId(String id);

    @Query("{ '$or': [ { 'image.driveFileId': ?0 }, { 'driveFileId': ?0 } ] }")
    Optional<GalleryItem> findByDriveFileId(String driveFileId);
}
