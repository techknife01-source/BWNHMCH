import { apiClient } from './apiClient';
import { ApiResponse } from '../../types/index';

export interface PrincipalDeskData {
  name: string;
  designation: string;
  photoUrl: string;
  qualifications: string[];
  experienceYears: number;
  message: string;
  vision: string;
  achievements: string[];
  awards: string[];
  contactEmail: string;
  phone: string;
}

export const principalApi = {
  getPrincipalDesk: async () => {
    const response = await apiClient.get<ApiResponse<PrincipalDeskData>>('/cms/principal-desk');
    return response.data;
  },
  updatePrincipalDesk: async (data: Partial<PrincipalDeskData>) => {
    const response = await apiClient.put<ApiResponse<PrincipalDeskData>>('/cms/principal-desk', data);
    return response.data;
  },
};
