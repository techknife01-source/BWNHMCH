import { apiClient } from './apiClient';
import { ApiResponse, Notice, PageResponse } from '../../types/index';

export const noticeApi = {
  getNotices: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PageResponse<Notice>>>('/notices', { params });
    return response.data;
  },
  getRecentNotices: async () => {
    const response = await apiClient.get<ApiResponse<Notice[]>>('/notices/recent');
    return response.data;
  },
  getNoticeById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Notice>>(`/notices/${id}`);
    return response.data;
  },
};
