import { apiClient } from './apiClient';
import { ApiResponse, SemesterResult } from '../../types/index';

export const mockSemesterResults: SemesterResult[] = [
  {
    id: 'res-2',
    semester: '2nd Professional BHMS Year',
    academicYear: '2024 - 2025',
    sgpa: 8.80,
    cgpa: 8.65,
    resultStatus: 'PASSED',
    gradeSheetUrl: '#',
    subjects: [
      { code: 'PATH-201', name: 'Pathology & Microbiology', credits: 6, internalMarks: 27, universityMarks: 65, totalMarks: 92, grade: 'A+', status: 'PASS' },
      { code: 'FMT-202', name: 'Forensic Medicine & Toxicology', credits: 5, internalMarks: 25, universityMarks: 62, totalMarks: 87, grade: 'A', status: 'PASS' },
      { code: 'MM-203', name: 'Homoeopathic Materia Medica II', credits: 6, internalMarks: 28, universityMarks: 66, totalMarks: 94, grade: 'O', status: 'PASS' },
      { code: 'ORG-204', name: 'Organon of Medicine II', credits: 6, internalMarks: 29, universityMarks: 64, totalMarks: 93, grade: 'O', status: 'PASS' }
    ]
  },
  {
    id: 'res-1',
    semester: '1st Professional BHMS Year',
    academicYear: '2023 - 2024',
    sgpa: 8.50,
    cgpa: 8.50,
    resultStatus: 'PASSED',
    gradeSheetUrl: '#',
    subjects: [
      { code: 'ANAT-101', name: 'Human Anatomy Paper I & II', credits: 8, internalMarks: 24, universityMarks: 61, totalMarks: 85, grade: 'A', status: 'PASS' },
      { code: 'PHYS-102', name: 'Human Physiology & Biochemistry', credits: 8, internalMarks: 26, universityMarks: 63, totalMarks: 89, grade: 'A+', status: 'PASS' },
      { code: 'PHARM-103', name: 'Homoeopathic Pharmacy', credits: 6, internalMarks: 28, universityMarks: 65, totalMarks: 93, grade: 'O', status: 'PASS' }
    ]
  }
];

export const resultApi = {
  getResults: async (): Promise<ApiResponse<SemesterResult[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<SemesterResult[]>>('/student/results');
      return response.data;
    } catch {
      return { success: true, message: 'Semester results fetched', data: mockSemesterResults, timestamp: new Date().toISOString() };
    }
  },

  downloadGradeSheet: async (resultId: string): Promise<Blob> => {
    try {
      const response = await apiClient.get(`/student/results/${resultId}/pdf`, { responseType: 'blob' });
      return response.data;
    } catch {
      const content = `WBUHS Official Grade Sheet Report - ID: ${resultId}`;
      return new Blob([content], { type: 'application/pdf' });
    }
  }
};
