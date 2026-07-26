import { apiClient } from './apiClient';
import { ApiResponse, GalleryItem } from '../../types/index';

export const galleryApi = {
  getGalleryItems: async (category?: string) => {
    const response = await apiClient.get<ApiResponse<GalleryItem[]>>('/gallery', { params: { category } });
    return response.data;
  },
};
