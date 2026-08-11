package com.homeopathy.college.service;

import com.homeopathy.college.dto.request.BookRequest;
import com.homeopathy.college.dto.response.BookResponse;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface BookService {
    List<BookResponse> getAllPublishedBooks();
    BookResponse getBookById(String id);
    BookResponse uploadBook(BookRequest request, MultipartFile file, String uploaderUsername);
    BookResponse updateBook(String id, BookRequest request);
    void deleteBook(String id);
    Resource getBookPdfResource(String id);
    String getBookFileName(String id);
}
