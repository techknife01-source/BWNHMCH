import { apiClient } from './apiClient';
import { ApiResponse, EventItem, PageResponse } from '../../types/index';

export const eventApi = {
  getEvents: async (params?: Record<string, any>) => {
    const response = await apiClient.get<ApiResponse<PageResponse<EventItem>>>('/events', { params });
    return response.data;
  },
  getUpcomingEvents: async () => {
    const response = await apiClient.get<ApiResponse<EventItem[]>>('/events/upcoming');
    return response.data;
  },
};
