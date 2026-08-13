package com.homeopathy.college.service;

import com.homeopathy.college.dto.request.BookRequest;
import com.homeopathy.college.dto.response.BookResponse;
import com.homeopathy.college.entity.Book;
import com.homeopathy.college.exception.BadRequestException;
import com.homeopathy.college.exception.FileUploadException;
import com.homeopathy.college.exception.ResourceNotFoundException;
import com.homeopathy.college.repository.BookRepository;
import com.homeopathy.college.serviceImpl.BookServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.io.Resource;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class BookServiceTest {

    @Mock
    private BookRepository bookRepository;

    @Mock
    private GoogleDriveService googleDriveService;

    @InjectMocks
    private BookServiceImpl bookService;

    private BookRequest validRequest;
    private MockMultipartFile validPdfFile;

    @BeforeEach
    void setUp() {
        validRequest = new BookRequest();
        validRequest.setTitle("Organon of Medicine");
        validRequest.setAuthor("Samuel Hahnemann");
        validRequest.setCategory("Organon");
        validRequest.setSemester("1st BHMS");
        validRequest.setDepartment("Homoeopathic Philosophy");
        validRequest.setSubject("Organon of Medicine");
        validRequest.setPublisher("B. Jain Publishers");
        validRequest.setDescription("Fundamental principles of homeopathy.");
        validRequest.setAllowDownload(true);
        validRequest.setPublished(true);

        validPdfFile = new MockMultipartFile(
                "file",
                "organon_of_medicine.pdf",
                "application/pdf",
                "%PDF-1.4 sample content".getBytes()
        );
    }

    @Test
    @DisplayName("1 & 11. Multipart upload with valid PDF & Successful MongoDB persistence")
    void uploadBook_ValidPdf_Success() {
        when(googleDriveService.isConfigured()).thenReturn(true);
        when(googleDriveService.uploadFile(any(InputStream.class), anyString(), anyString(), anyLong()))
                .thenReturn("drive_file_12345");

        Book savedBook = Book.builder()
                .id("book_mongoid_001")
                .title(validRequest.getTitle())
                .author(validRequest.getAuthor())
                .category(validRequest.getCategory())
                .semester(validRequest.getSemester())
                .department(validRequest.getDepartment())
                .subject(validRequest.getSubject())
                .publisher(validRequest.getPublisher())
                .description(validRequest.getDescription())
                .fileName("organon_of_medicine.pdf")
                .mimeType("application/pdf")
                .fileSize(validPdfFile.getSize())
                .googleDriveFileId("drive_file_12345")
                .storageProvider("GOOGLE_DRIVE")
                .allowDownload(true)
                .published(true)
                .uploadedBy("Librarian Admin")
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        when(bookRepository.save(any(Book.class))).thenReturn(savedBook);

        BookResponse response = bookService.uploadBook(validRequest, validPdfFile, "Librarian Admin");

        assertNotNull(response);
        assertEquals("book_mongoid_001", response.getId());
        assertEquals("Organon of Medicine", response.getTitle());
        assertEquals("drive_file_12345", response.getGoogleDriveFileId());
        assertEquals("/api/v1/library/books/book_mongoid_001/pdf", response.getPdfUrl());

        verify(googleDriveService, times(1)).uploadFile(any(InputStream.class), eq("organon_of_medicine.pdf"), eq("application/pdf"), eq(validPdfFile.getSize()));
        verify(bookRepository, times(1)).save(any(Book.class));
    }

    @Test
    @DisplayName("2. Missing file attachment should throw BadRequestException")
    void uploadBook_MissingFile_ThrowsBadRequest() {
        assertThrows(BadRequestException.class, () -> bookService.uploadBook(validRequest, null, "Admin"));
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("3. Empty file attachment should throw BadRequestException")
    void uploadBook_EmptyFile_ThrowsBadRequest() {
        MockMultipartFile emptyFile = new MockMultipartFile("file", "empty.pdf", "application/pdf", new byte[0]);
        assertThrows(BadRequestException.class, () -> bookService.uploadBook(validRequest, emptyFile, "Admin"));
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("4. Invalid MIME type should throw BadRequestException")
    void uploadBook_InvalidMimeType_ThrowsBadRequest() {
        MockMultipartFile exeFile = new MockMultipartFile("file", "malicious.exe", "application/x-msdownload", "binary data".getBytes());
        assertThrows(BadRequestException.class, () -> bookService.uploadBook(validRequest, exeFile, "Admin"));
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("5. Oversized file exceeding 50MB limit should throw BadRequestException")
    void uploadBook_OversizedFile_ThrowsBadRequest() {
        MultipartFile oversizedFile = mock(MultipartFile.class);
        when(oversizedFile.isEmpty()).thenReturn(false);
        when(oversizedFile.getSize()).thenReturn(51L * 1024 * 1024);

        assertThrows(BadRequestException.class, () -> bookService.uploadBook(validRequest, oversizedFile, "Admin"));
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("6. Missing title should throw BadRequestException")
    void uploadBook_MissingTitle_ThrowsBadRequest() {
        validRequest.setTitle("");
        assertThrows(BadRequestException.class, () -> bookService.uploadBook(validRequest, validPdfFile, "Admin"));
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("7. Missing author should throw BadRequestException")
    void uploadBook_MissingAuthor_ThrowsBadRequest() {
        validRequest.setAuthor("   ");
        assertThrows(BadRequestException.class, () -> bookService.uploadBook(validRequest, validPdfFile, "Admin"));
        verifyNoInteractions(googleDriveService);
    }

    @Test
    @DisplayName("8. Google Drive service unconfigured should throw FileUploadException")
    void uploadBook_GoogleDriveUnconfigured_ThrowsFileUploadException() {
        when(googleDriveService.isConfigured()).thenReturn(false);

        assertThrows(FileUploadException.class, () -> bookService.uploadBook(validRequest, validPdfFile, "Admin"));
        verify(bookRepository, never()).save(any());
    }

    @Test
    @DisplayName("9. Google Drive upload failure should throw FileUploadException")
    void uploadBook_GoogleDriveFailure_ThrowsFileUploadException() {
        when(googleDriveService.isConfigured()).thenReturn(true);
        when(googleDriveService.uploadFile(any(InputStream.class), anyString(), anyString(), anyLong()))
                .thenThrow(new RuntimeException("Drive API Connection Timed Out"));

        assertThrows(FileUploadException.class, () -> bookService.uploadBook(validRequest, validPdfFile, "Admin"));
        verify(bookRepository, never()).save(any());
    }

    @Test
    @DisplayName("10. MongoDB save failure triggers Google Drive file cleanup")
    void uploadBook_MongoDbSaveFailure_TriggersCleanup() {
        when(googleDriveService.isConfigured()).thenReturn(true);
        when(googleDriveService.uploadFile(any(InputStream.class), anyString(), anyString(), anyLong()))
                .thenReturn("drive_file_999");
        when(bookRepository.save(any(Book.class))).thenThrow(new RuntimeException("MongoDB Duplicate Key Error"));

        assertThrows(RuntimeException.class, () -> bookService.uploadBook(validRequest, validPdfFile, "Admin"));
        verify(googleDriveService, times(1)).deleteFile("drive_file_999");
    }

    @Test
    @DisplayName("12. PDF streaming retrieves InputStream Resource correctly")
    void getBookPdfResource_Success() {
        Book existingBook = Book.builder()
                .id("book_123")
                .title("Materia Medica")
                .googleDriveFileId("drive_file_777")
                .build();

        when(bookRepository.findById("book_123")).thenReturn(Optional.of(existingBook));
        when(googleDriveService.downloadFile("drive_file_777"))
                .thenReturn(new ByteArrayInputStream("%PDF-1.4 Stream".getBytes()));

        Resource resource = bookService.getBookPdfResource("book_123");
        assertNotNull(resource);
        verify(googleDriveService, times(1)).downloadFile("drive_file_777");
    }

    @Test
    @DisplayName("12b. PDF streaming throws ResourceNotFoundException if book or Drive ID missing")
    void getBookPdfResource_MissingDriveId_ThrowsResourceNotFoundException() {
        Book existingBook = Book.builder()
                .id("book_456")
                .title("No Drive File")
                .googleDriveFileId(null)
                .build();

        when(bookRepository.findById("book_456")).thenReturn(Optional.of(existingBook));

        assertThrows(ResourceNotFoundException.class, () -> bookService.getBookPdfResource("book_456"));
    }
}
