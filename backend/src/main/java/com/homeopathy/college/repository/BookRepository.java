package com.homeopathy.college.repository;

import com.homeopathy.college.entity.Book;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookRepository extends MongoRepository<Book, String> {
    List<Book> findByPublishedTrue();
    List<Book> findByCategoryAndPublishedTrue(String category);
    Optional<Book> findByCustomId(String customId);
}

