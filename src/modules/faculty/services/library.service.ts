import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';

export const libraryService = {
  getRequestedBooks: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/faculty/library/requisitions');
    return response.data;
  },

  requestBookRequisition: async (bookDetails: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/faculty/library/requisitions', bookDetails);
    return response.data;
  },

  getIssuedBooks: async (): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/faculty/library/issued-books');
    return response.data;
  },
};
