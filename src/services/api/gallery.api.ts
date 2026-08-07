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
    const response = await apiClient.post<ApiResponse<{ url: string; fileName: string; fileSize: number }>>(
      '/gallery/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
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
