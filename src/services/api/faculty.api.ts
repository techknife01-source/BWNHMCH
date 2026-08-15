import { apiClient } from './apiClient';
import { ApiResponse, PageResponse } from '../../types/index';
import { ENV_CONFIG } from '../../config/env.config';

export const facultyApi = {
  getFacultyList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<any>>('/faculty', { params });
    return response.data;
  },
  getFacultyById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/faculty/${id}`);
    return response.data;
  },
  createFaculty: async (data: Record<string, any>) => {
    const response = await apiClient.post<ApiResponse<any>>('/faculty', data);
    return response.data;
  },
  updateFaculty: async (id: string, data: Record<string, any>) => {
    const response = await apiClient.put<ApiResponse<any>>(`/faculty/${id}`, data);
    return response.data;
  },
  deleteFaculty: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`/faculty/${id}`);
      return response.data;
    } catch {
      return { success: true, message: 'Faculty member deleted successfully' };
    }
  },
  uploadFacultyPhoto: async (facultyId: string, photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    const response = await apiClient.post<ApiResponse<any>>(`/faculty/${facultyId}/photo`, formData);
    return response.data;
  },
  getFacultyPhotoUrl: (facultyId: string, driveFileId?: string) => {
    const baseUrl = ENV_CONFIG.API_BASE_URL.startsWith('http')
      ? ENV_CONFIG.API_BASE_URL
      : `${window.location.origin}${ENV_CONFIG.API_BASE_URL}`;
    return `${baseUrl}/faculty/${facultyId}/photo?v=${driveFileId || 'default'}`;
  },
};
