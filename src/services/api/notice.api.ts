import { apiClient } from './apiClient';
import { ApiResponse, Notice, PageResponse } from '../../types/index';
import { NOTICES } from '../../data/mockData';

export const noticeApi = {
  getNotices: async (params?: Record<string, any>): Promise<ApiResponse<PageResponse<Notice>>> => {
    try {
      const response = await apiClient.get<ApiResponse<PageResponse<Notice>>>('/notices', { params });
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Notices fetched',
        data: {
          content: NOTICES,
          pageNo: 0,
          pageSize: NOTICES.length,
          totalElements: NOTICES.length,
          totalPages: 1,
          last: true,
        },
        timestamp: new Date().toISOString(),
      };
    }
  },
  getRecentNotices: async (): Promise<ApiResponse<Notice[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Notice[]>>('/notices/recent');
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Recent notices fetched',
        data: NOTICES.slice(0, 5),
        timestamp: new Date().toISOString(),
      };
    }
  },
  getNoticeById: async (id: string): Promise<ApiResponse<Notice>> => {
    try {
      const response = await apiClient.get<ApiResponse<Notice>>(`/notices/${id}`);
      return response.data;
    } catch {
      const found = NOTICES.find((n) => n.id === id) || NOTICES[0];
      return {
        success: true,
        message: 'Notice fetched',
        data: found,
        timestamp: new Date().toISOString(),
      };
    }
  },
};

