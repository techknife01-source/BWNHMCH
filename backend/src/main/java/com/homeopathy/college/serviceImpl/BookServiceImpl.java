package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.dto.request.BookRequest;
import com.homeopathy.college.dto.response.BookResponse;
import com.homeopathy.college.entity.Book;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.repository.BookRepository;
import com.homeopathy.college.service.BookService;
import com.homeopathy.college.service.GoogleDriveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;
    private final GoogleDriveService googleDriveService;

    @Override
    public List<BookResponse> getAllPublishedBooks() {
        return bookRepository.findByPublishedTrue().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public BookResponse getBookById(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        return mapToResponse(book);
    }

    @Override
    public BookResponse uploadBook(BookRequest request, MultipartFile file, String uploaderUsername) {
        log.info("[E-LIBRARY] Uploading new PDF book: '{}'", request.getTitle());

        String driveFileId = null;
        if (file != null && !file.isEmpty()) {
            try {
                driveFileId = googleDriveService.uploadFile(
                        file.getInputStream(),
                        file.getOriginalFilename(),
                        file.getContentType() != null ? file.getContentType() : "application/pdf",
                        file.getSize()
                );
            } catch (Exception e) {
                log.error("[E-LIBRARY] Failed to upload PDF file to Google Drive: {}", e.getMessage());
                throw new RuntimeException("Google Drive upload failed: " + e.getMessage(), e);
            }
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .semester(request.getSemester())
                .description(request.getDescription())
                .fileName(file != null ? file.getOriginalFilename() : null)
                .mimeType("application/pdf")
                .fileSize(file != null ? file.getSize() : 0L)
                .googleDriveFileId(driveFileId)
                .storageProvider("GOOGLE_DRIVE")
                .published(request.getPublished() != null ? request.getPublished() : true)
                .uploadedBy(uploaderUsername)
                .build();

        Book savedBook = bookRepository.save(book);
        log.info("[E-LIBRARY] Book '{}' saved to MongoDB with ID '{}'", savedBook.getTitle(), savedBook.getId());

        return mapToResponse(savedBook);
    }

    @Override
    public BookResponse updateBook(String id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

        book.setTitle(request.getTitle());
        book.setAuthor(request.getAuthor());
        if (request.getCategory() != null) book.setCategory(request.getCategory());
        if (request.getSemester() != null) book.setSemester(request.getSemester());
        if (request.getDescription() != null) book.setDescription(request.getDescription());
        if (request.getPublished() != null) book.setPublished(request.getPublished());

        Book updatedBook = bookRepository.save(book);
        return mapToResponse(updatedBook);
    }

    @Override
    public void deleteBook(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        bookRepository.delete(book);
    }

    @Override
    public Resource getBookPdfResource(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

        if (book.getGoogleDriveFileId() != null && !book.getGoogleDriveFileId().isBlank()) {
            try {
                InputStream pdfStream = googleDriveService.downloadFile(book.getGoogleDriveFileId());
                return new InputStreamResource(pdfStream);
            } catch (Exception e) {
                log.warn("[BookServiceImpl] Google Drive stream failed for book ID {}: {}, returning fallback PDF resource", id, e.getMessage());
            }
        }

        byte[] samplePdf = "%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 612 792]/Parent 2 0 R/Resources<<>>>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000009 00000 n\n0000000052 00000 n\n0000000101 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n178\n%%EOF".getBytes(StandardCharsets.UTF_8);
        return new ByteArrayResource(samplePdf);
    }

    @Override
    public String getBookFileName(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        return book.getFileName() != null ? book.getFileName() : "book.pdf";
    }

    private BookResponse mapToResponse(Book book) {
        String pdfUrl = "/api/v1/library/books/" + book.getId() + "/pdf";
        return BookResponse.builder()
                .id(book.getId())
                .title(book.getTitle())
                .author(book.getAuthor())
                .category(book.getCategory())
                .semester(book.getSemester())
                .description(book.getDescription())
                .fileName(book.getFileName())
                .mimeType(book.getMimeType())
                .fileSize(book.getFileSize())
                .googleDriveFileId(book.getGoogleDriveFileId())
                .pdfUrl(pdfUrl)
                .published(book.isPublished())
                .uploadedBy(book.getUploadedBy())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
