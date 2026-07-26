import { apiClient } from './apiClient';
import { ApiResponse } from '../../types/index';

export const dashboardApi = {
  getOverviewMetrics: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/metrics');
    return response.data;
  },
  getRecentActivity: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/dashboard/activities');
    return response.data;
  },
};
