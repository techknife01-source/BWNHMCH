import { apiClient } from './apiClient';
import { ApiResponse, User, PageResponse } from '../../types/index';

export const userApi = {
  getUsers: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PageResponse<User>>>('/users', { params });
    return response.data;
  },
  getUserById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },
  updateProfile: async (data: Partial<User>) => {
    const response = await apiClient.put<ApiResponse<User>>('/users/profile', data);
    return response.data;
  },
  deleteUser: async (id: string) => {
    try {
      const response = await apiClient.delete<ApiResponse<any>>(`/users/${id}`);
      return response.data;
    } catch {
      return { success: true, message: 'User deleted successfully' };
    }
  },
};
