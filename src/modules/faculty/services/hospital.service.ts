import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';

export const hospitalService = {
  getOpdSchedule: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>('/faculty/hospital/opd-schedule');
    return response.data;
  },

  getPatientDutyRoster: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/faculty/hospital/roster');
    return response.data;
  },

  getInternAssignments: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/faculty/hospital/interns');
    return response.data;
  },
};
