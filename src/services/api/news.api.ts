import { apiClient } from './apiClient';
import { ApiResponse, PageResponse } from '../../types/index';

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  category: string;
  author: string;
  publishedAt: string;
  imageUrl?: string;
  featured?: boolean;
}

export const newsApi = {
  getNews: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PageResponse<NewsItem>>>('/news', { params });
    return response.data;
  },
  getNewsBySlug: async (slug: string) => {
    const response = await apiClient.get<ApiResponse<NewsItem>>(`/news/${slug}`);
    return response.data;
  },
};
