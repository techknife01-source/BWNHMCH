import { apiClient } from './apiClient';
import { ApiResponse, Department } from '../../types/index';

export const departmentApi = {
  getDepartments: async () => {
    const response = await apiClient.get<ApiResponse<Department[]>>('/departments');
    return response.data;
  },
  getDepartmentById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Department>>(`/departments/${id}`);
    return response.data;
  },
};
