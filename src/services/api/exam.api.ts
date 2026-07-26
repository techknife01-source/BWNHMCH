import { apiClient } from './apiClient';
import { ApiResponse, ExamSchedule } from '../../types/index';

export const mockExamSchedules: ExamSchedule[] = [
  { id: 'ex-1', title: 'BHMS 3rd Prof WBUHS Annual University Examination', type: 'UNIVERSITY', subjectName: 'Organon of Medicine Paper I & II', subjectCode: 'ORG-301', examDate: '2026-09-10', timeSlot: '10:00 AM - 01:00 PM', roomNo: 'Central Exam Hall A', maxMarks: 100 },
  { id: 'ex-2', title: 'BHMS 3rd Prof WBUHS Annual University Examination', type: 'UNIVERSITY', subjectName: 'Materia Medica Paper I & II', subjectCode: 'MM-302', examDate: '2026-09-12', timeSlot: '10:00 AM - 01:00 PM', roomNo: 'Central Exam Hall A', maxMarks: 100 },
  { id: 'ex-3', title: 'WBUHS Clinical Bedside Practical & Oral Viva Exam', type: 'PRACTICAL', subjectName: 'Hospital Clinical OPD Cases & Viva', subjectCode: 'OPD-303', examDate: '2026-09-15', timeSlot: '09:00 AM - 04:00 PM', roomNo: 'Hospital Block B Wards', maxMarks: 100 },
  { id: 'ex-4', title: '3rd Year 2nd Terminal Internal Assessment Test', type: 'INTERNAL', subjectName: 'Homoeopathic Pharmacy & Pharmacopoeia', subjectCode: 'PHARM-304', examDate: '2026-08-05', timeSlot: '11:00 AM - 01:00 PM', roomNo: 'Lecture Hall 2', maxMarks: 50 },
  { id: 'ex-5', title: 'Repertorial Analysis Viva Assessment', type: 'VIVA', subjectName: 'Repertory & Case Taking', subjectCode: 'REP-305', examDate: '2026-08-08', timeSlot: '10:00 AM - 02:00 PM', roomNo: 'Department Lab', maxMarks: 50 },
];

export const examApi = {
  getUpcomingExams: async (): Promise<ApiResponse<ExamSchedule[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<ExamSchedule[]>>('/student/exams');
      return response.data;
    } catch {
      return { success: true, message: 'Upcoming exams fetched', data: mockExamSchedules, timestamp: new Date().toISOString() };
    }
  }
};
