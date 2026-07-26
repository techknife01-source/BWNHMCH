import { apiClient } from './apiClient';
import { ApiResponse, PageResponse } from '../../types/index';

export const facultyApi = {
  getFacultyList: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PageResponse<any>>>('/faculty', { params });
    return response.data;
  },
  getFacultyById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/faculty/${id}`);
    return response.data;
  },
};
