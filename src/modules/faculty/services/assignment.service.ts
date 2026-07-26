import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';

export const assignmentService = {
  getAssignments: async (subjectId?: string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get<ApiResponse<any[]>>('/faculty/assignments', { params: { subjectId } });
    return response.data;
  },

  createAssignment: async (assignmentData: any): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/faculty/assignments', assignmentData);
    return response.data;
  },

  gradeSubmission: async (submissionId: string, gradeData: { marks: number; feedback?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>(`/faculty/assignments/grade/${submissionId}`, gradeData);
    return response.data;
  },
};
