package com.homeopathy.college.controller;

import com.homeopathy.college.common.ApiResponse;
import com.homeopathy.college.dto.response.BookResponse;
import com.homeopathy.college.service.BookService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/books")
@RequiredArgsConstructor
@Tag(name = "E-Library Books Alias Gateway", description = "Alias Endpoints for /books")
public class LegacyBookController {

    private final BookService bookService;

    @GetMapping
    @Operation(summary = "Get all published books (Alias Endpoint)")
    public ResponseEntity<ApiResponse<List<BookResponse>>> getAllBooks() {
        List<BookResponse> books = bookService.getAllPublishedBooks();
        return ResponseEntity.ok(ApiResponse.success(books, "Published books fetched successfully"));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get book details by ID (Alias Endpoint)")
    public ResponseEntity<ApiResponse<BookResponse>> getBookById(@PathVariable String id) {
        BookResponse book = bookService.getBookById(id);
        return ResponseEntity.ok(ApiResponse.success(book, "Book details retrieved successfully"));
    }

    @GetMapping("/{id}/pdf")
    @Operation(summary = "Stream book PDF file (Alias Endpoint)")
    public ResponseEntity<Resource> streamBookPdf(@PathVariable String id) {
        Resource pdfResource = bookService.getBookPdfResource(id);
        String fileName = bookService.getBookFileName(id);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + fileName + "\"")
                .body(pdfResource);
    }
}
