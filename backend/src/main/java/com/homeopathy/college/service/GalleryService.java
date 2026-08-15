package com.homeopathy.college.service;

import com.homeopathy.college.entity.GalleryItem;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;

public interface GalleryService {
    List<GalleryItem> getAllItems();
    GalleryItem getItemById(String id);
    GalleryItem createItem(GalleryItem item);
    GalleryItem updateItem(String id, GalleryItem item);
    void deleteItem(String id);

    GalleryItem uploadGalleryImage(String galleryId, MultipartFile file);
    GalleryItem createGalleryItemWithImage(String title, String description, String category, MultipartFile file);
    GalleryImageStream getGalleryImageStream(String galleryId);

    class GalleryImageStream {
        private final InputStream inputStream;
        private final String mimeType;

        public GalleryImageStream(InputStream inputStream, String mimeType) {
            this.inputStream = inputStream;
            this.mimeType = mimeType;
        }

        public InputStream getInputStream() {
            return inputStream;
        }

        public String getMimeType() {
            return mimeType;
        }
    }
}
