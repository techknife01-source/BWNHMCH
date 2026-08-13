package com.homeopathy.college.serviceImpl;

import com.homeopathy.college.dto.request.BookRequest;
import com.homeopathy.college.dto.response.BookResponse;
import com.homeopathy.college.entity.Book;
import com.homeopathy.college.exception.BadRequestException;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.repository.BookRepository;
import com.homeopathy.college.service.BookService;
import com.homeopathy.college.service.GoogleDriveService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
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
        log.info("[E-LIBRARY] Upload request received for title='{}', author='{}'", 
                request != null ? request.getTitle() : "null", 
                request != null ? request.getAuthor() : "null");

        // 1. Validate request
        if (request == null || request.getTitle() == null || request.getTitle().isBlank() ||
                request.getAuthor() == null || request.getAuthor().isBlank()) {
            throw new BadRequestException("Title and Author are mandatory fields for book upload.");
        }

        // 2. Validate MultipartFile
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("A non-empty file attachment is required for book upload.");
        }

        // 3. Enforce maximum size (50 MB)
        long fileSize = file.getSize();
        long maxSizeBytes = 50L * 1024 * 1024;
        if (fileSize > maxSizeBytes) {
            throw new BadRequestException("File size (" + String.format("%.1f MB", fileSize / (1024.0 * 1024.0)) +
                    ") exceeds the maximum allowed limit of 50 MB.");
        }

        // 4. Validate file content type / extension
        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.isBlank()) {
            originalFilename = request.getTitle() + ".pdf";
        }
        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/pdf";
        }

        String lowerFilename = originalFilename.toLowerCase();
        boolean isValidType = lowerFilename.endsWith(".pdf") ||
                lowerFilename.endsWith(".doc") ||
                lowerFilename.endsWith(".docx") ||
                lowerFilename.endsWith(".ppt") ||
                lowerFilename.endsWith(".pptx") ||
                contentType.equalsIgnoreCase("application/pdf") ||
                contentType.contains("wordprocessingml") ||
                contentType.contains("presentationml") ||
                contentType.contains("msword");

        if (!isValidType) {
            throw new BadRequestException("Unsupported file type: '" + contentType + "'. Allowed types are PDF, DOCX, and PPTX.");
        }

        // 5. Generate safe storage filename
        String safeFileName = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");

        // 6. Verify Google Drive configuration & upload
        if (!googleDriveService.isConfigured()) {
            log.error("[E-LIBRARY] Google Drive Service is not configured.");
            throw new FileUploadException("Google Drive service is not configured on the server.");
        }

        String driveFileId;
        try {
            log.info("[E-LIBRARY] Uploading file '{}' ({} bytes) to Google Drive...", safeFileName, fileSize);
            driveFileId = googleDriveService.uploadFile(file.getInputStream(), safeFileName, contentType, fileSize);
            log.info("[E-LIBRARY] Google Drive upload completed with file ID: {}", driveFileId);
        } catch (FileUploadException e) {
            throw e;
        } catch (Exception e) {
            log.error("[E-LIBRARY] Google Drive upload failed for '{}': {}", safeFileName, e.getMessage());
            throw new FileUploadException("Failed to upload PDF file to Google Drive: " + e.getMessage(), e);
        }

        if (driveFileId == null || driveFileId.isBlank()) {
            throw new FileUploadException("Google Drive returned invalid or blank file ID.");
        }

        // 8. Save MongoDB metadata
        Book book = Book.builder()
                .title(request.getTitle().trim())
                .author(request.getAuthor().trim())
                .category(request.getCategory() != null ? request.getCategory().trim() : "General")
                .semester(request.getSemester() != null ? request.getSemester().trim() : "N/A")
                .department(request.getDepartment() != null ? request.getDepartment().trim() : null)
                .subject(request.getSubject() != null ? request.getSubject().trim() : null)
                .publisher(request.getPublisher() != null ? request.getPublisher().trim() : null)
                .description(request.getDescription() != null ? request.getDescription().trim() : null)
                .fileName(safeFileName)
                .mimeType(contentType)
                .fileSize(fileSize)
                .googleDriveFileId(driveFileId)
                .storageProvider("GOOGLE_DRIVE")
                .allowDownload(request.getAllowDownload() != null ? request.getAllowDownload() : true)
                .published(request.getPublished() != null ? request.getPublished() : true)
                .uploadedBy(uploaderUsername)
                .build();

        Book savedBook;
        try {
            savedBook = bookRepository.save(book);
            log.info("[E-LIBRARY] Database record created successfully with MongoDB ID: {}", savedBook.getId());
        } catch (Exception dbErr) {
            log.error("[E-LIBRARY] MongoDB save failed for book '{}': {}. Attempting cleanup of Drive file ID '{}'...", request.getTitle(), dbErr.getMessage(), driveFileId);
            try {
                googleDriveService.deleteFile(driveFileId);
            } catch (Exception cleanupErr) {
                log.error("[E-LIBRARY] Failed to cleanup Drive file ID '{}' after DB error: {}", driveFileId, cleanupErr.getMessage());
            }
            throw new RuntimeException("Failed to save book record in database: " + dbErr.getMessage(), dbErr);
        }

        return mapToResponse(savedBook);
    }

    @Override
    public BookResponse updateBook(String id, BookRequest request) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

        if (request.getTitle() != null && !request.getTitle().isBlank()) book.setTitle(request.getTitle().trim());
        if (request.getAuthor() != null && !request.getAuthor().isBlank()) book.setAuthor(request.getAuthor().trim());
        if (request.getCategory() != null) book.setCategory(request.getCategory().trim());
        if (request.getSemester() != null) book.setSemester(request.getSemester().trim());
        if (request.getDepartment() != null) book.setDepartment(request.getDepartment().trim());
        if (request.getSubject() != null) book.setSubject(request.getSubject().trim());
        if (request.getPublisher() != null) book.setPublisher(request.getPublisher().trim());
        if (request.getDescription() != null) book.setDescription(request.getDescription().trim());
        if (request.getAllowDownload() != null) book.setAllowDownload(request.getAllowDownload());
        if (request.getPublished() != null) book.setPublished(request.getPublished());

        Book updatedBook = bookRepository.save(book);
        return mapToResponse(updatedBook);
    }

    @Override
    public void deleteBook(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));
        if (book.getGoogleDriveFileId() != null && !book.getGoogleDriveFileId().isBlank()) {
            try {
                googleDriveService.deleteFile(book.getGoogleDriveFileId());
            } catch (Exception e) {
                log.warn("[E-LIBRARY] Could not delete Google Drive file ID '{}' on book deletion: {}", book.getGoogleDriveFileId(), e.getMessage());
            }
        }
        bookRepository.delete(book);
    }

    @Override
    public Resource getBookPdfResource(String id) {
        Book book = bookRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Book", "id", id));

        String driveFileId = book.getGoogleDriveFileId();
        if (driveFileId == null || driveFileId.isBlank()) {
            log.error("[E-LIBRARY] Book ID '{}' has no associated googleDriveFileId in MongoDB", id);
            throw new ResourceNotFoundException("Book PDF File", "googleDriveFileId", id);
        }

        try {
            log.info("[E-LIBRARY] Requesting Google Drive binary stream for book ID '{}', Drive File ID '{}'", id, driveFileId);
            InputStream pdfStream = googleDriveService.downloadFile(driveFileId);
            if (pdfStream == null) {
                log.error("[E-LIBRARY] Google Drive returned null stream for file ID '{}'", driveFileId);
                throw new ResourceNotFoundException("Book PDF Stream", "driveFileId", driveFileId);
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
                .department(book.getDepartment())
                .subject(book.getSubject())
                .publisher(book.getPublisher())
                .description(book.getDescription())
                .fileName(book.getFileName())
                .mimeType(book.getMimeType())
                .fileSize(book.getFileSize())
                .googleDriveFileId(book.getGoogleDriveFileId())
                .pdfUrl(pdfUrl)
                .allowDownload(book.isAllowDownload())
                .published(book.isPublished())
                .uploadedBy(book.getUploadedBy())
                .createdAt(book.getCreatedAt())
                .updatedAt(book.getUpdatedAt())
                .build();
    }
}
