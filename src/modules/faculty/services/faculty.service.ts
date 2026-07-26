import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';
import { FacultyProfile, FacultyStatistics, FacultyNotification, FacultySubject } from '../types';

export const facultyService = {
  getProfile: async (): Promise<ApiResponse<FacultyProfile>> => {
    const response = await apiClient.get<ApiResponse<FacultyProfile>>('/faculty/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<FacultyProfile>): Promise<ApiResponse<FacultyProfile>> => {
    const response = await apiClient.put<ApiResponse<FacultyProfile>>('/faculty/profile', data);
    return response.data;
  },

  getStatistics: async (): Promise<ApiResponse<FacultyStatistics>> => {
    const response = await apiClient.get<ApiResponse<FacultyStatistics>>('/faculty/statistics');
    return response.data;
  },

  getNotifications: async (): Promise<ApiResponse<FacultyNotification[]>> => {
    const response = await apiClient.get<ApiResponse<FacultyNotification[]>>('/faculty/notifications');
    return response.data;
  },

  getAssignedSubjects: async (): Promise<ApiResponse<FacultySubject[]>> => {
    const response = await apiClient.get<ApiResponse<FacultySubject[]>>('/faculty/subjects');
    return response.data;
  },
};
