package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.dto.request.BookRequest;
import com.homeopathy.college.dto.response.BookResponse;
import com.homeopathy.college.security.UserPrincipal;
import com.homeopathy.college.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/library/books")
@RequiredArgsConstructor
@Tag(name = "E-Library Management Gateway", description = "Endpoints for Public E-Library Catalog & PDF Reader")
public class BookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get all published books (Public Endpoint)")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAllBooks() {
        log.info("[E-LIBRARY] Public request for book catalog");
        List<BookResponse> books = bookService.getAllPublishedBooks();
        return ResponseEntity.ok(ApiResponse.success(books, "Published books fetched successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book details by ID (Public Endpoint)")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable String id) {
        BookResponse book = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponse.success(book, "Book details retrieved successfully"));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Stream book PDF file from Google Drive (Public Endpoint)")
    public ResponseEntity<Resource> streamBookPdf(@PathVariable String id) {
        log.info("[E-LIBRARY] PDF retrieval started for book: {}", id);
        Resource pdfResource = bookService.getBookPdfResource(id);
        String fileName = bookService.getBookFileName(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .header(HttpHeaders.ACCEPT_RANGES, "bytes")
                .body(pdfResource);
    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_JSON_VALUE})
    @Operation(summary = "Upload new book PDF to Google Drive and save metadata")
    public ResponseEntity<ApiResponse<BookResponse>> uploadBook(
            @RequestParam(value = "title", required = false) String titleParam,
            @RequestParam(value = "author", required = false) String authorParam,
            @RequestParam(value = "category", required = false) String categoryParam,
            @RequestParam(value = "semester", required = false) String semesterParam,
            @RequestParam(value = "description", required = false) String descriptionParam,
            @RequestPart(value = "file", required = false) MultipartFile file,
            @AuthenticationPrincipal UserPrincipal currentUser) {

        String title = titleParam;
        String author = authorParam;
        String category = categoryParam;
        String semester = semesterParam;
        String description = descriptionParam;

        if (title == null || title.isBlank() || author == null || author.isBlank()) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Title and Author are required"));
        }

        BookRequest request = new BookRequest();
        request.setTitle(title);
        request.setAuthor(author);
        request.setCategory(category);
        request.setSemester(semester);
        request.setDescription(description);
        request.setPublished(true);

        String username = currentUser != null ? currentUser.getUsername() : "Faculty Member";

        BookResponse response = bookService.uploadBook(request, file, username);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response, "Book uploaded successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'LIBRARIAN')")
    @Operation(summary = "Update book metadata")
    public ResponseEntity<ApiResponse<BookResponse>> updateBook(
            @PathVariable String id,
            @Valid @RequestBody BookRequest request) {
        BookResponse response = bookService.updateBook(id, request);
        return ResponseEntity.ok(ApiResponse.success(response, "Book updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN', 'LIBRARIAN')")
    @Operation(summary = "Delete book")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable String id) {
        bookService.deleteBook(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Book deleted successfully"));
    }
}
