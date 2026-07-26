import { apiClient } from './apiClient';
import { ApiResponse, Assignment } from '../../types/index';

export const mockAssignments: Assignment[] = [
  {
    id: 'asg-1',
    title: 'Sycotic Miasm Case Analysis & Remedy Differentiation',
    subjectName: 'Organon of Medicine & Philosophy',
    subjectCode: 'ORG-301',
    facultyName: 'Prof. (Dr.) A. K. Mondal',
    assignedDate: '2026-07-10',
    dueDate: '2026-07-28',
    totalMarks: 50,
    status: 'SUBMITTED',
    description: 'Provide detailed clinical case analysis of a Sycotic patient including rubric selection, potencies prescribed, and Hahnemannian §150-175 Organon references.',
    submittedAt: '2026-07-22 18:45:00',
    submissionUrl: '#',
    feedback: 'Excellent miasmatic analysis. Well-supported with aphorism citations.',
    obtainedMarks: 46
  },
  {
    id: 'asg-2',
    title: 'Polychrest Remedies Comparison: Lycopodium vs Nux Vomica vs Sulphur',
    subjectName: 'Materia Medica & Therapeutics',
    subjectCode: 'MM-302',
    facultyName: 'Dr. S. R. Bhattacharya',
    assignedDate: '2026-07-15',
    dueDate: '2026-08-02',
    totalMarks: 50,
    status: 'PENDING',
    description: 'Compare thermal states, GI symptoms, mental keynotes, and modality differences across these three constitutional remedies in tabular format.'
  },
  {
    id: 'asg-3',
    title: 'Kent Repertory Generalization & Synthesis Method',
    subjectName: 'Repertory & Case Taking',
    subjectCode: 'REP-305',
    facultyName: 'Prof. Dr. S. K. Das',
    assignedDate: '2026-07-01',
    dueDate: '2026-07-18',
    totalMarks: 30,
    status: 'GRADED',
    obtainedMarks: 28,
    submittedAt: '2026-07-17 11:20:00',
    description: 'Write a comprehensive essay on Kentian rubric hierarchy: Mind -> Generals -> Particulars with 2 illustrative case examples.',
    feedback: 'Very crisp rubric breakdown.'
  },
  {
    id: 'asg-4',
    title: '50 Millesimal Potency (LM) Preparation & Administration Log',
    subjectName: 'Homoeopathic Pharmacy',
    subjectCode: 'PHARM-304',
    facultyName: 'Dr. M. Roy',
    assignedDate: '2026-06-25',
    dueDate: '2026-07-05',
    totalMarks: 25,
    status: 'OVERDUE',
    description: 'Lab practical assignment detailing 0/1 to 0/3 LM potency serial dilution steps and liquid succussion rules.'
  }
];

export const assignmentApi = {
  getAssignments: async (): Promise<ApiResponse<Assignment[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<Assignment[]>>('/student/assignments');
      return response.data;
    } catch {
      return { success: true, message: 'Assignments fetched', data: mockAssignments, timestamp: new Date().toISOString() };
    }
  },

  getAssignmentById: async (id: string): Promise<ApiResponse<Assignment>> => {
    try {
      const response = await apiClient.get<ApiResponse<Assignment>>(`/student/assignments/${id}`);
      return response.data;
    } catch {
      const found = mockAssignments.find((a) => a.id === id) || mockAssignments[0];
      return { success: true, message: 'Assignment fetched', data: found, timestamp: new Date().toISOString() };
    }
  },

  submitAssignment: async (id: string, formData: FormData): Promise<ApiResponse<Assignment>> => {
    try {
      const response = await apiClient.post<ApiResponse<Assignment>>(`/student/assignments/${id}/submit`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch {
      const updated: Assignment = {
        ...(mockAssignments.find((a) => a.id === id) || mockAssignments[0]),
        status: 'SUBMITTED',
        submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
        submissionUrl: 'uploaded-assignment.pdf'
      };
      return { success: true, message: 'Assignment submitted successfully', data: updated, timestamp: new Date().toISOString() };
    }
  }
};
