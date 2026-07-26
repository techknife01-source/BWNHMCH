import { apiClient } from './apiClient';
import { ApiResponse } from '../../types/index';

export interface CourseItem {
  id: string;
  code: string;
  title: string;
  degree: string;
  duration: string;
  seats: number;
  eligibility: string;
  fees: string;
  description: string;
  syllabusUrl?: string;
  affiliation: string;
}

export const courseApi = {
  getCourses: async () => {
    const response = await apiClient.get<ApiResponse<CourseItem[]>>('/courses');
    return response.data;
  },
  getCourseById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<CourseItem>>(`/courses/${id}`);
    return response.data;
  },
};
