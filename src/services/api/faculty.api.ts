import { apiClient } from './apiClient';
import { ApiResponse, PageResponse } from '../../types/index';
import { ENV_CONFIG } from '../../config/env.config';

export const facultyApi = {
  getFacultyList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<any>>('/faculty', { params });
    console.log('[FACULTY HTTP RESPONSE]', {
      time: performance.now(),
      url: '/faculty',
      count: Array.isArray(response?.data?.data)
        ? response.data.data.length
        : Array.isArray(response?.data)
        ? (response.data as any).length
        : null,
      names: Array.isArray(response?.data?.data) ? response.data.data.map((x: any) => x.name) : null,
      response: response.data,
    });
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
    const response = await apiClient.delete<ApiResponse<any>>(`/faculty/${id}`);
    return response.data;
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
