import { apiClient } from './apiClient';
import { ApiResponse } from '../../types/index';
import { ENV_CONFIG } from '../../config/env.config';

export const doctorsApi = {
  getDoctorList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<any>>('/doctors', { params });
    return response.data;
  },
  getDoctorById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/doctors/${id}`);
    return response.data;
  },
  createDoctor: async (data: Record<string, any>) => {
    const response = await apiClient.post<ApiResponse<any>>('/doctors', data);
    return response.data;
  },
  updateDoctor: async (id: string, data: Record<string, any>) => {
    const response = await apiClient.put<ApiResponse<any>>(`/doctors/${id}`, data);
    return response.data;
  },
  deleteDoctor: async (id: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/doctors/${id}`);
    return response.data;
  },
  uploadDoctorPhoto: async (doctorId: string, photoFile: File) => {
    const formData = new FormData();
    formData.append('photo', photoFile);
    formData.append('file', photoFile);
    const response = await apiClient.post<ApiResponse<any>>(`/doctors/${doctorId}/photo`, formData);
    return response.data;
  },
  deleteDoctorPhoto: async (doctorId: string) => {
    const response = await apiClient.delete<ApiResponse<any>>(`/doctors/${doctorId}/photo`);
    return response.data;
  },
  getDoctorPhotoUrl: (doctorId: string, driveFileId?: string) => {
    const baseUrl = ENV_CONFIG.API_BASE_URL.startsWith('http')
      ? ENV_CONFIG.API_BASE_URL
      : `${window.location.origin}${ENV_CONFIG.API_BASE_URL}`;
    return `${baseUrl}/doctors/${doctorId}/photo?v=${driveFileId || 'default'}`;
  },
};
