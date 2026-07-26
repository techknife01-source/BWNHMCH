import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse, PageResponse } from '../../../types/index';
import { SessionInfo, LoginHistory } from '../types/core.types';

export const sessionService = {
  /**
   * Fetch active sessions for current user
   */
  getActiveSessions: async (): Promise<ApiResponse<SessionInfo[]>> => {
    const response = await apiClient.get<ApiResponse<SessionInfo[]>>('/auth/sessions');
    return response.data;
  },

  /**
   * Terminate a specific session by ID
   */
  terminateSession: async (sessionId: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(`/auth/sessions/${sessionId}`);
    return response.data;
  },

  /**
   * Terminate all other sessions except current
   */
  terminateAllOtherSessions: async (): Promise<ApiResponse<void>> => {
    const response = await apiClient.post<ApiResponse<void>>('/auth/sessions/terminate-others');
    return response.data;
  },

  /**
   * Fetch login history log
   */
  getLoginHistory: async (params?: Record<string, any>): Promise<ApiResponse<PageResponse<LoginHistory>>> => {
    const response = await apiClient.get<ApiResponse<PageResponse<LoginHistory>>>('/auth/login-history', { params });
    return response.data;
  },

  /**
   * Validate session active status
   */
  validateSession: async (): Promise<ApiResponse<{ isValid: boolean; session?: SessionInfo }>> => {
    const response = await apiClient.get<ApiResponse<{ isValid: boolean; session?: SessionInfo }>>('/auth/sessions/validate');
    return response.data;
  },
};
