import { apiClient } from './apiClient';
import { ApiResponse } from '../../types/index';
import { ENV_CONFIG } from '../../config/env.config';

export const staffApi = {
  getStaffList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<any>>('/staff', { params });
    return response.data;
  },
  getStaffById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/staff/${id}`);
    return response.data;
  },
  createStaff: async (data: Record<string, any>) => {
    const response = await apiClient.post<ApiResponse<any>>('/staff', data);
    return response.data;
  },
  updateStaff: async (id: string, data: Record<string, any>) => {
    const response = await apiClient.put<ApiResponse<any>>(`/staff/${id}`, data);
    return response.data;
  },
  deleteStaff: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/staff/${id}`);
    return response.data;
  },
  uploadStaffPhoto: async (staffId: string, photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('file', photoFile);
    const response = await apiClient.post<ApiResponse<any>>(`/staff/${staffId}/photo`, formData);
    return response.data;
  },
  deleteStaffPhoto: async (staffId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/staff/${staffId}/photo`);
    return response.data;
  },
  getStaffPhotoUrl: (staffId: string, driveFileId?: string) => {
    const baseUrl = ENV_CONFIG.API_BASE_URL.startsWith('http')
      ? ENV_CONFIG.API_BASE_URL
      : `${window.location.origin}${ENV_CONFIG.API_BASE_URL}`;
    return `${baseUrl}/staff/${staffId}/photo?v=${driveFileId || 'default'}`;
  },
};
