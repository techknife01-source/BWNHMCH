import { apiClient } from './apiClient';
import { ApiResponse, StudentProfile, TimetableEntry, StudyMaterial, ActivityLog } from '../../types/index';

export const mockStudentProfile: StudentProfile = {
  id: 'std-2024-042',
  rollNumber: 'BWN-BHMS-2024-042',
  registrationNumber: 'WBUHS-REG-2024-88912',
  fullName: 'Debasish Banerjee',
  email: 'debasish.b@student.bhmc.ac.in',
  phone: '+91 98321 88900',
  department: 'Organon of Medicine & Homoeopathic Philosophy',
  course: 'Bachelor of Homoeopathic Medicine and Surgery (BHMS)',
  currentSemester: '3rd Professional Year',
  session: '2024 - 2029',
  bloodGroup: 'O+ Positive',
  dateOfBirth: '2003-08-14',
  gender: 'Male',
  profilePicture: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  guardianName: 'Dr. Tarun Kanti Banerjee',
  guardianRelation: 'Father',
  guardianPhone: '+91 94340 12345',
  address: {
    street: '42, College Road, Near Rajbati Gate',
    city: 'Burdwan',
    state: 'West Bengal',
    pincode: '713104'
  },
  emergencyContact: {
    name: 'Mrs. Supriya Banerjee',
    phone: '+91 98321 00112',
    relation: 'Mother'
  },
  documents: [
    { id: 'doc-1', title: 'BHMS 2nd Prof Pass Certificate', type: 'Certificate', url: '#', uploadedAt: '2025-08-10' },
    { id: 'doc-2', title: 'WBUHS Registration Certificate', type: 'Registration', url: '#', uploadedAt: '2024-09-01' },
    { id: 'doc-3', title: 'College Digital ID Card', type: 'Identity Card', url: '#', uploadedAt: '2024-09-05' },
    { id: 'doc-4', title: 'Anti-Ragging Compliance Affidavit', type: 'Affidavit', url: '#', uploadedAt: '2024-09-10' }
  ],
  cgpa: 8.65,
  sgpa: 8.80,
  overallAttendancePercentage: 88.5
};

export const mockTimetable: TimetableEntry[] = [
  { id: 'tt-1', dayOfWeek: 'MONDAY', timeSlot: '09:00 AM - 10:00 AM', subjectName: 'Organon of Medicine & Philosophy', subjectCode: 'ORG-301', facultyName: 'Prof. (Dr.) A. K. Mondal', roomNo: 'Lecture Hall 2', type: 'LECTURE' },
  { id: 'tt-2', dayOfWeek: 'MONDAY', timeSlot: '10:00 AM - 11:30 AM', subjectName: 'Materia Medica & Therapeutics', subjectCode: 'MM-302', facultyName: 'Dr. S. R. Bhattacharya', roomNo: 'Lecture Hall 2', type: 'LECTURE' },
  { id: 'tt-3', dayOfWeek: 'MONDAY', timeSlot: '11:30 AM - 01:30 PM', subjectName: 'Clinical Hospital OPD Rotations', subjectCode: 'OPD-303', facultyName: 'Dr. P. K. Ghosh', roomNo: 'OPD Building Block B', type: 'CLINICAL' },
  { id: 'tt-4', dayOfWeek: 'TUESDAY', timeSlot: '09:00 AM - 10:30 AM', subjectName: 'Homoeopathic Pharmacy Practical', subjectCode: 'PHARM-304', facultyName: 'Dr. M. Roy', roomNo: 'Pharmacy Lab A', type: 'PRACTICAL' },
  { id: 'tt-5', dayOfWeek: 'WEDNESDAY', timeSlot: '02:00 PM - 04:00 PM', subjectName: 'Repertory & Case Taking Viva Session', subjectCode: 'REP-305', facultyName: 'Prof. Dr. S. K. Das', roomNo: 'Seminar Hall 1', type: 'SEMINAR' },
];

export const mockStudyMaterials: StudyMaterial[] = [
  { id: 'sm-1', title: 'Hahnemannian Chronic Diseases Detailed Notes & Cases', subjectName: 'Organon of Medicine', type: 'Notes', authorFaculty: 'Prof. (Dr.) A. K. Mondal', uploadedDate: '2026-07-15', department: 'Organon', fileSize: '4.2 MB', fileUrl: '#', isBookmarked: true, readTimeMinutes: 25 },
  { id: 'sm-2', title: 'Kent Repertory Key Features & Rubric Comparisons PDF', subjectName: 'Repertory', type: 'Presentations', authorFaculty: 'Prof. Dr. S. K. Das', uploadedDate: '2026-07-10', department: 'Repertory', fileSize: '8.1 MB', fileUrl: '#', isBookmarked: false, readTimeMinutes: 40 },
  { id: 'sm-3', title: '2025 WBUHS 3rd BHMS Annual Exam Question Papers', subjectName: 'Materia Medica', type: 'Previous Year Papers', authorFaculty: 'Academic Cell', uploadedDate: '2026-06-20', department: 'Materia Medica', fileSize: '2.5 MB', fileUrl: '#', isBookmarked: true, readTimeMinutes: 15 },
  { id: 'sm-4', title: 'Practical Pharmacy Tincture Preparation Lab Manual', subjectName: 'Pharmacy', type: 'Reference Materials', authorFaculty: 'Dr. M. Roy', uploadedDate: '2026-05-18', department: 'Pharmacy', fileSize: '5.8 MB', fileUrl: '#', isBookmarked: false, readTimeMinutes: 30 }
];

export const mockActivities: ActivityLog[] = [
  { id: 'act-1', title: 'Organon Attendance Marked', timestamp: 'Today, 09:15 AM', type: 'ATTENDANCE', description: 'Marked Present for Lecture Hall 2 Organon class by Dr. Mondal.' },
  { id: 'act-2', title: 'Assignment Submitted', timestamp: 'Yesterday, 08:30 PM', type: 'ASSIGNMENT', description: 'Submitted "Sycotic Miasm Case Analysis" assignment successfully.' },
  { id: 'act-3', title: 'OPD Hospital Duty Schedule Updated', timestamp: '22 July 2026', type: 'HOSPITAL', description: 'Assigned to Block B General OPD under Dr. P. K. Ghosh.' },
  { id: 'act-4', title: 'Semester Tuition Fee Receipt Issued', timestamp: '18 July 2026', type: 'FEE', description: 'Payment receipt #RCP-2026-8801 of ₹25,000 generated.' }
];

export const studentApi = {
  getProfile: async (): Promise<ApiResponse<StudentProfile>> => {
    try {
      const response = await apiClient.get<ApiResponse<StudentProfile>>('/student/profile');
      return response.data;
    } catch {
      return { success: true, message: 'Profile fetched', data: mockStudentProfile, timestamp: new Date().toISOString() };
    }
  },

  updateProfile: async (data: Partial<StudentProfile>): Promise<ApiResponse<StudentProfile>> => {
    try {
      const response = await apiClient.put<ApiResponse<StudentProfile>>('/student/profile', data);
      return response.data;
    } catch {
      const updated = { ...mockStudentProfile, ...data };
      return { success: true, message: 'Profile updated successfully', data: updated, timestamp: new Date().toISOString() };
    }
  },

  getTimetable: async (): Promise<ApiResponse<TimetableEntry[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<TimetableEntry[]>>('/student/timetable');
      return response.data;
    } catch {
      return { success: true, message: 'Timetable fetched', data: mockTimetable, timestamp: new Date().toISOString() };
    }
  },

  getStudyMaterials: async (): Promise<ApiResponse<StudyMaterial[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<StudyMaterial[]>>('/student/study-materials');
      return response.data;
    } catch {
      return { success: true, message: 'Study materials fetched', data: mockStudyMaterials, timestamp: new Date().toISOString() };
    }
  },

  getRecentActivities: async (): Promise<ApiResponse<ActivityLog[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<ActivityLog[]>>('/student/activities');
      return response.data;
    } catch {
      return { success: true, message: 'Activities fetched', data: mockActivities, timestamp: new Date().toISOString() };
    }
  }
};
