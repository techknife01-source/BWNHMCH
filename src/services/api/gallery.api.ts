import { apiClient } from './apiClient';
import { ApiResponse, GalleryItem } from '../../types/index';

export const galleryApi = {
  getGalleryItems: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<GalleryItem[]>>('/gallery', { params });
    return response.data;
  },

  uploadImage: async (file: File): Promise<ApiResponse<{ url: string; fileName: string; fileSize: number }>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('image', file);
    const response = await apiClient.post<ApiResponse<{ url: string; fileName: string; fileSize: number }>>(
      '/gallery/upload',
      formData
    );
    return response.data;
  },

  uploadGalleryImageWithMeta: async (
    file: File,
    meta?: {
      title?: string;
      description?: string;
      category?: string;
      status?: string;
      displayOrder?: number;
      isFeatured?: boolean;
      uploader?: string;
    }
  ): Promise<ApiResponse<GalleryItem>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('image', file);
    if (meta?.title) formData.append('title', meta.title);
    if (meta?.description) formData.append('description', meta.description);
    if (meta?.category) formData.append('category', meta.category);
    if (meta?.status) formData.append('status', meta.status);
    if (meta?.displayOrder !== undefined) formData.append('displayOrder', String(meta.displayOrder));
    if (meta?.isFeatured !== undefined) formData.append('isFeatured', String(meta.isFeatured));
    if (meta?.uploader) formData.append('uploader', meta.uploader);

    const response = await apiClient.post<ApiResponse<GalleryItem>>('/gallery/upload', formData);
    return response.data;
  },

  addGalleryItems: async (items: Partial<GalleryItem>[]): Promise<ApiResponse<GalleryItem[]>> => {
    const response = await apiClient.post<ApiResponse<GalleryItem[]>>('/gallery', { items });
    return response.data;
  },

  updateGalleryItem: async (id: string, updates: Partial<GalleryItem>): Promise<ApiResponse<GalleryItem>> => {
    const response = await apiClient.put<ApiResponse<GalleryItem>>(`/gallery/${id}`, updates);
    return response.data;
  },

  deleteGalleryImage: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/gallery/${id}/image`);
    return response.data;
  },

  deleteGalleryItem: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/gallery/${id}`);
    return response.data;
  },

  bulkDeleteGalleryItems: async (ids: string[]): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/gallery/bulk-delete', { ids });
    return response.data;
  },

  bulkUpdateCategory: async (ids: string[], category: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/gallery/bulk-category', { ids, category });
    return response.data;
  },

  bulkUpdateStatus: async (ids: string[], status: 'PUBLISHED' | 'HIDDEN'): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/gallery/bulk-status', { ids, status });
    return response.data;
  },
};
