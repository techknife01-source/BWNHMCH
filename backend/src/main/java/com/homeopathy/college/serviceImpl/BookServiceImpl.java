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
        log.info("[E-LIBRARY] Upload started");
        log.info("[E-LIBRARY] Uploading new PDF book: '{}'", request.getTitle());

        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("PDF file attachment is required for book upload.");
        }

        long originalSizeBytes = file.getSize();
        log.info("[E-LIBRARY] Original file size: {} bytes ({})", originalSizeBytes, String.format("%.1f MB", originalSizeBytes / (1024.0 * 1024.0)));

        String driveFileId = null;
        try {
            driveFileId = googleDriveService.uploadFile(
                    file.getInputStream(),
                    file.getOriginalFilename() != null ? file.getOriginalFilename() : (request.getTitle() + ".pdf"),
                    file.getContentType() != null ? file.getContentType() : "application/pdf",
                    originalSizeBytes
            );
            log.info("[E-LIBRARY] Google Drive upload completed");
            log.info("[E-LIBRARY] Google Drive file ID: {}", driveFileId);
        } catch (Exception e) {
            log.error("[E-LIBRARY] Failed to upload PDF file to Google Drive: {}", e.getMessage());
            throw new RuntimeException("Google Drive PDF upload failed: " + e.getMessage(), e);
        }

        if (driveFileId == null || driveFileId.isBlank()) {
            throw new IllegalStateException("Google Drive upload failed to return a valid file ID.");
        }

        Book book = Book.builder()
                .title(request.getTitle())
                .author(request.getAuthor())
                .category(request.getCategory())
                .semester(request.getSemester())
                .description(request.getDescription())
                .fileName(file.getOriginalFilename() != null ? file.getOriginalFilename() : (request.getTitle() + ".pdf"))
                .mimeType(file.getContentType() != null ? file.getContentType() : "application/pdf")
                .fileSize(originalSizeBytes)
                .googleDriveFileId(driveFileId)
                .storageProvider("GOOGLE_DRIVE")
                .published(request.getPublished() != null ? request.getPublished() : true)
                .uploadedBy(uploaderUsername)
                .build();

        Book savedBook = bookRepository.save(book);
        log.info("[E-LIBRARY] Database record created");
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

        String driveFileId = book.getGoogleDriveFileId();
        if (driveFileId == null || driveFileId.isBlank()) {
            log.error("[E-LIBRARY] Book ID '{}' has no associated googleDriveFileId in MongoDB", id);
            throw new ResourceNotFoundException("PDF resource file ID is missing for book: " + book.getTitle());
        }

        try {
            log.info("[E-LIBRARY] Requesting Google Drive binary stream for book ID '{}', Drive File ID '{}'", id, driveFileId);
            InputStream pdfStream = googleDriveService.downloadFile(driveFileId);
            if (pdfStream == null) {
                log.error("[E-LIBRARY] Google Drive returned null stream for file ID '{}'", driveFileId);
                throw new ResourceNotFoundException("Google Drive returned empty stream for file ID: " + driveFileId);
            }
            log.info("[E-LIBRARY] PDF retrieval completed for book '{}'", book.getTitle());
            return new InputStreamResource(pdfStream);
        } catch (ResourceNotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("[E-LIBRARY] Google Drive stream retrieval error for book ID '{}': {}", id, e.getMessage());
            throw new RuntimeException("Failed to retrieve document stream from Google Drive: " + e.getMessage(), e);
        }
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
