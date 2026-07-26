import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';
import {
  LeaveApplication,
  CertificateRequest,
  CertificateType,
  StudentNotification,
  EnrolledSubject,
  AcademicCalendarEvent,
  StudentSettingsState,
} from '../types/studentErp.types';

// Initial Mock Datasets
let mockLeaves: LeaveApplication[] = [
  {
    id: 'lv-101',
    leaveType: 'MEDICAL',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    totalDays: 3,
    reason: 'Acute viral fever and bronchitis. Advised complete bed rest by Dr. S. K. Roy.',
    attachmentUrl: 'medical_prescription_doc.pdf',
    status: 'APPROVED',
    appliedOn: '2026-07-19',
    reviewedBy: 'Prof. (Dr.) S. N. Das (Principal)',
    reviewRemarks: 'Medical leave sanctioned with attendance compensation.',
  },
  {
    id: 'lv-102',
    leaveType: 'ACADEMIC',
    startDate: '2026-08-05',
    endDate: '2026-08-06',
    totalDays: 2,
    reason: 'Attending State Level AYUSH Youth Scientific Seminar in Kolkata as college representative.',
    status: 'PENDING',
    appliedOn: '2026-07-23',
  },
];

let mockCertificateRequests: CertificateRequest[] = [
  {
    id: 'crt-501',
    certificateType: 'BONAFIDE',
    title: 'Bonafide Student Certificate',
    purpose: 'Opening Student Savings Bank Account & Passport Verification',
    requestedDate: '2026-07-15',
    status: 'READY',
    referenceNumber: 'BHMCH/CERT/2026/8812',
    downloadUrl: '#',
    remarks: 'Approved by Registrar. Ready for digital download.',
  },
  {
    id: 'crt-502',
    certificateType: 'FEE_NOC',
    title: 'Fee No Dues Clearance NOC',
    purpose: 'WBUHS Scholarship Application Verification',
    requestedDate: '2026-07-02',
    status: 'ISSUED',
    referenceNumber: 'BHMCH/NOC/2026/4109',
    downloadUrl: '#',
    remarks: 'Clearance verified by Accounts Section.',
  },
];

let mockNotifications: StudentNotification[] = [
  {
    id: 'notif-1',
    title: 'WBUHS 3rd Prof Exam Form Submission Alert',
    message: 'Online examination enrollment portal for 3rd BHMS is open till August 10, 2026.',
    timestamp: '2 hours ago',
    category: 'EXAM',
    isRead: false,
  },
  {
    id: 'notif-2',
    title: 'Assignment Submitted & Graded',
    message: 'Your assignment on "Sycotic Miasm Case Analysis" was graded 46/50 by Prof. A. K. Mondal.',
    timestamp: 'Yesterday',
    category: 'ASSIGNMENT',
    isRead: false,
  },
  {
    id: 'notif-3',
    title: 'Tuition Fee Installment Payment Received',
    message: 'Receipt #RCP-2026-8801 for ₹25,000 has been verified and added to fee history.',
    timestamp: '3 days ago',
    category: 'FEE',
    isRead: true,
  },
  {
    id: 'notif-4',
    title: 'Medical Leave Sanctioned',
    message: 'Your medical leave application for 20-22 July 2026 has been sanctioned by Principal.',
    timestamp: '4 days ago',
    category: 'LEAVE',
    isRead: true,
  },
];

let mockEnrolledSubjects: EnrolledSubject[] = [
  {
    id: 'sub-301',
    code: 'ORG-301',
    name: 'Organon of Medicine & Philosophy',
    department: 'Organon of Medicine',
    credits: 8,
    professors: ['Prof. (Dr.) A. K. Mondal', 'Dr. S. K. Biswas'],
    totalLectures: 60,
    attendedLectures: 55,
    attendancePercentage: 91.6,
    syllabusProgressPercentage: 78,
    description: 'Principles of Hahnemannian Philosophy, Aphorisms §1-291, Miasmatic Diseases, and Case Taking Methods.',
    prescribedBooks: ['Organon of Medicine - 6th Edition (Dr. S. Hahnemann)', 'Lectures on Homoeopathic Philosophy (Dr. J. T. Kent)'],
  },
  {
    id: 'sub-302',
    code: 'MM-302',
    name: 'Materia Medica & Therapeutics',
    department: 'Materia Medica',
    credits: 8,
    professors: ['Dr. S. R. Bhattacharya', 'Dr. P. Roy'],
    totalLectures: 65,
    attendedLectures: 58,
    attendancePercentage: 89.2,
    syllabusProgressPercentage: 82,
    description: 'Study of Polychrest and Mineral remedies, comparative drug pictures, thermal states and mental keynotes.',
    prescribedBooks: ['Lectures on Homoeopathic Materia Medica (Dr. J. T. Kent)', 'Keynotes with Nosodes (Dr. H. C. Allen)'],
  },
  {
    id: 'sub-304',
    code: 'PHARM-304',
    name: 'Homoeopathic Pharmacy & Pharmacopoeia',
    department: 'Pharmacy',
    credits: 6,
    professors: ['Dr. M. Roy'],
    totalLectures: 45,
    attendedLectures: 41,
    attendancePercentage: 91.1,
    syllabusProgressPercentage: 85,
    description: 'Preparation of mother tinctures, trituration, LM potencies, and Homoeopathic Pharmacopoeia of India (HPI) standards.',
    prescribedBooks: ['Textbook of Homoeopathic Pharmacy (Dr. D. D. Banerjee)'],
  },
  {
    id: 'sub-305',
    code: 'REP-305',
    name: 'Repertory & Case Taking',
    department: 'Repertory',
    credits: 6,
    professors: ['Prof. Dr. S. K. Das'],
    totalLectures: 40,
    attendedLectures: 33,
    attendancePercentage: 82.5,
    syllabusProgressPercentage: 70,
    description: 'Kentian Repertory structure, rubric classification, Boenninghausen Therapeutic Pocket Book, and computer repertorization.',
    prescribedBooks: ['Repertory of the Homoeopathic Materia Medica (Dr. J. T. Kent)', 'How to Study Repertory (Dr. J. V. Allen)'],
  },
  {
    id: 'sub-303',
    code: 'OPD-303',
    name: 'Clinical Hospital OPD & IPD Rotations',
    department: 'Hospital Clinical Cell',
    credits: 6,
    professors: ['Dr. P. K. Ghosh', 'Dr. A. Sen'],
    totalLectures: 30,
    attendedLectures: 25,
    attendancePercentage: 83.3,
    syllabusProgressPercentage: 90,
    description: 'Bedside clinical examination, chronic disease case history taking, repertorial analysis and prescription logs.',
    prescribedBooks: ['Clinical Case Records Manual (BHMCH)'],
  },
];

let mockCalendarEvents: AcademicCalendarEvent[] = [
  {
    id: 'cal-1',
    title: 'Hahnemann Birthday Commemoration & National Symposium',
    date: '2026-08-10',
    category: 'EVENT',
    description: 'Annual commemoration seminar on Dr. Samuel Hahnemann with clinical case study competitions.',
    isMandatory: true,
    location: 'College Main Auditorium',
  },
  {
    id: 'cal-2',
    title: '3rd Year BHMS 2nd Terminal Internal Assessment Exam',
    date: '2026-08-05',
    endDate: '2026-08-08',
    category: 'EXAM',
    description: 'Written and practical internal assessment examinations for all 3rd Prof subjects.',
    isMandatory: true,
    location: 'Exam Hall A & Departmental Labs',
  },
  {
    id: 'cal-3',
    title: 'Independence Day Celebrations & Campus Flag Hoisting',
    date: '2026-08-15',
    category: 'HOLIDAY',
    description: 'Flag hoisting ceremony followed by cultural program by students.',
    isMandatory: false,
    location: 'College Campus Grounds',
  },
  {
    id: 'cal-4',
    title: 'WBUHS 3rd Prof Annual University Written Examinations',
    date: '2026-09-10',
    endDate: '2026-09-20',
    category: 'EXAM',
    description: 'WBUHS University Annual Examination for BHMS 3rd Professional.',
    isMandatory: true,
    location: 'Central Examination Center',
  },
];

let mockSettings: StudentSettingsState = {
  emailNotifications: true,
  smsAlerts: true,
  assignmentReminders: true,
  feeDueAlerts: true,
  attendanceAlerts: true,
  twoFactorAuth: false,
};

export const studentErpService = {
  // LEAVE APPLICATIONS
  getLeaveApplications: async (): Promise<ApiResponse<LeaveApplication[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<LeaveApplication[]>>('/student/leaves');
      return response.data;
    } catch {
      return { success: true, message: 'Leave applications fetched', data: mockLeaves, timestamp: new Date().toISOString() };
    }
  },

  applyLeave: async (data: Omit<LeaveApplication, 'id' | 'status' | 'appliedOn'>): Promise<ApiResponse<LeaveApplication>> => {
    try {
      const response = await apiClient.post<ApiResponse<LeaveApplication>>('/student/leaves', data);
      return response.data;
    } catch {
      const newLeave: LeaveApplication = {
        ...data,
        id: `lv-${Date.now()}`,
        status: 'PENDING',
        appliedOn: new Date().toISOString().split('T')[0],
      };
      mockLeaves.unshift(newLeave);
      return { success: true, message: 'Leave application submitted successfully!', data: newLeave, timestamp: new Date().toISOString() };
    }
  },

  // CERTIFICATES
  getCertificateRequests: async (): Promise<ApiResponse<CertificateRequest[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<CertificateRequest[]>>('/student/certificates');
      return response.data;
    } catch {
      return { success: true, message: 'Certificate requests fetched', data: mockCertificateRequests, timestamp: new Date().toISOString() };
    }
  },

  requestCertificate: async (type: CertificateType, title: string, purpose: string): Promise<ApiResponse<CertificateRequest>> => {
    try {
      const response = await apiClient.post<ApiResponse<CertificateRequest>>('/student/certificates', { type, title, purpose });
      return response.data;
    } catch {
      const newReq: CertificateRequest = {
        id: `crt-${Date.now()}`,
        certificateType: type,
        title,
        purpose,
        requestedDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        remarks: 'Application under verification by Administrative Section.',
      };
      mockCertificateRequests.unshift(newReq);
      return { success: true, message: 'Certificate request submitted successfully!', data: newReq, timestamp: new Date().toISOString() };
    }
  },

  // NOTIFICATIONS
  getNotifications: async (): Promise<ApiResponse<StudentNotification[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<StudentNotification[]>>('/student/notifications');
      return response.data;
    } catch {
      return { success: true, message: 'Notifications fetched', data: mockNotifications, timestamp: new Date().toISOString() };
    }
  },

  markNotificationAsRead: async (id: string): Promise<ApiResponse<void>> => {
    mockNotifications = mockNotifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    return { success: true, message: 'Notification marked as read', data: undefined, timestamp: new Date().toISOString() };
  },

  markAllNotificationsAsRead: async (): Promise<ApiResponse<void>> => {
    mockNotifications = mockNotifications.map((n) => ({ ...n, isRead: true }));
    return { success: true, message: 'All notifications marked as read', data: undefined, timestamp: new Date().toISOString() };
  },

  // SUBJECTS
  getEnrolledSubjects: async (): Promise<ApiResponse<EnrolledSubject[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<EnrolledSubject[]>>('/student/subjects');
      return response.data;
    } catch {
      return { success: true, message: 'Subjects fetched', data: mockEnrolledSubjects, timestamp: new Date().toISOString() };
    }
  },

  // ACADEMIC CALENDAR
  getCalendarEvents: async (): Promise<ApiResponse<AcademicCalendarEvent[]>> => {
    try {
      const response = await apiClient.get<ApiResponse<AcademicCalendarEvent[]>>('/student/calendar');
      return response.data;
    } catch {
      return { success: true, message: 'Calendar events fetched', data: mockCalendarEvents, timestamp: new Date().toISOString() };
    }
  },

  // SETTINGS
  getSettings: async (): Promise<ApiResponse<StudentSettingsState>> => {
    try {
      const response = await apiClient.get<ApiResponse<StudentSettingsState>>('/student/settings');
      return response.data;
    } catch {
      return { success: true, message: 'Settings fetched', data: mockSettings, timestamp: new Date().toISOString() };
    }
  },

  updateSettings: async (settings: Partial<StudentSettingsState>): Promise<ApiResponse<StudentSettingsState>> => {
    try {
      const response = await apiClient.put<ApiResponse<StudentSettingsState>>('/student/settings', settings);
      return response.data;
    } catch {
      mockSettings = { ...mockSettings, ...settings };
      return { success: true, message: 'Settings saved successfully!', data: mockSettings, timestamp: new Date().toISOString() };
    }
  },
};
