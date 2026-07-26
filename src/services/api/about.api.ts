import { apiClient } from './apiClient';
import { ApiResponse } from '../../types/index';

export interface AboutCollegeData {
  history: string;
  mission: string;
  vision: string;
  objectives: string[];
  infrastructure: string[];
  recognition: string[];
  affiliation: string;
  campusArea: string;
  establishedYear: number;
}

export const aboutApi = {
  getAboutDetails: async () => {
    const response = await apiClient.get<ApiResponse<AboutCollegeData>>('/cms/about');
    return response.data;
  },
  updateAboutDetails: async (data: Partial<AboutCollegeData>) => {
    const response = await apiClient.put<ApiResponse<AboutCollegeData>>('/cms/about', data);
    return response.data;
  },
};
