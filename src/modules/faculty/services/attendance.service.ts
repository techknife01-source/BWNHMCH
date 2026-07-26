import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';

export const attendanceService = {
  getSubjectAttendance: async (subjectId: string, date?: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>(`/faculty/attendance/subject/${subjectId}`, { params: { date } });
    return response.data;
  },

  markAttendance: async (attendanceData: { subjectId: string; date: string; studentRecords: Array<{ studentId: string; status: 'PRESENT' | 'ABSENT' | 'LATE' }> }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post<ApiResponse<any>>('/faculty/attendance/mark', attendanceData);
    return response.data;
  },

  getAttendanceReport: async (subjectId: string, month: string): Promise<ApiResponse<any>> => {
    const response = await apiClient.get<ApiResponse<any>>(`/faculty/attendance/report`, { params: { subjectId, month } });
    return response.data;
  },
};
