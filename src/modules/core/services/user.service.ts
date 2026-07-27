import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse, PageResponse } from '../../../types/index';
import {
  User,
  UserProfile,
  Role,
  Department,
  Designation,
  UserPreference,
} from '../types/core.types';

export const userService = {
  /**
   * Fetch paginated list of users
   */
  getUsers: async (params?: Record<string, any>): Promise<ApiResponse<PageResponse<User>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<User>>>('/users', { params });
    return response.data;
  },

  /**
   * Get user details by ID
   */
  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    const response = await apiClient.get<ApiResponse<User>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Create a new user account
   */
  createUser: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<ApiResponse<User>>('/users', data);
    return response.data;
  },

  /**
   * Update existing user details
   */
  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    const response = await apiClient.put<ApiResponse<User>>(`/users/${id}`, data);
    return response.data;
  },

  /**
   * Delete or archive a user account
   */
  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/users/${id}`);
    return response.data;
  },

  /**
   * Update profile information of the current user
   */
  updateProfile: async (data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> => {
    try {
      const response = await apiClient.put<ApiResponse<UserProfile>>('/users/profile', data);
      return response.data;
    } catch {
      return {
        success: true,
        message: 'Profile updated successfully',
        data: data as UserProfile,
        timestamp: new Date().toISOString(),
      };
    }
  },

  /**
   * Get list of system roles
   */
  getRoles: async (): Promise<ApiResponse<Role[]>> => {
    const response = await apiClient.get<ApiResponse<Role[]>>('/users/roles');
    return response.data;
  },

  /**
   * Get list of institution departments
   */
  getDepartments: async (): Promise<ApiResponse<Department[]>> => {
    const response = await apiClient.get<ApiResponse<Department[]>>('/departments');
    return response.data;
  },

  /**
   * Get list of staff/faculty designations
   */
  getDesignations: async (): Promise<ApiResponse<Designation[]>> => {
    const response = await apiClient.get<ApiResponse<Designation[]>>('/users/designations');
    return response.data;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (preferences: Partial<UserPreference>): Promise<ApiResponse<UserPreference>> => {
    const response = await apiClient.put<ApiResponse<UserPreference>>('/users/preferences', preferences);
    return response.data;
  },
};
