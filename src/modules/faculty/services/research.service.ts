import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';

export const researchService = {
  getPublications: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/faculty/research/publications');
    return response.data;
  },

  submitPaper: async (paperData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/faculty/research/publications', paperData);
    return response.data;
  },

  getGrantsAndProjects: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/faculty/research/projects');
    return response.data;
  },
};
