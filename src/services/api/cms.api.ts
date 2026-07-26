import { apiClient } from './apiClient';
import { ApiResponse, CMSContent } from '../../types/index';

export const cmsApi = {
  getLandingContent: async () => {
    const response = await apiClient.get<ApiResponse<CMSContent>>('/cms/landing');
    return response.data;
  },
  getAboutContent: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/cms/about');
    return response.data;
  },
  getNotices: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/cms/notices');
    return response.data;
  }
};
