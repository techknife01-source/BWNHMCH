import {
  StudentProfile,
  AttendanceSummary,
  AttendanceRecord,
  TimetableEntry,
  Assignment,
  StudyMaterial,
  ExamSchedule,
  SemesterResult,
  FeeDetail,
  FeeTransaction,
  DownloadItem,
  ActivityLog,
} from '../../../types/index';

export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type LeaveType = 'MEDICAL' | 'CASUAL' | 'DUTY_LEAVE' | 'ACADEMIC';

export interface LeaveApplication {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  attachmentUrl?: string;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewRemarks?: string;
}

export type CertificateType =
  | 'BONAFIDE'
  | 'TRANSFER'
  | 'CONDUCT'
  | 'FEE_NOC'
  | 'LIBRARY_NOC'
  | 'INTERNSHIP_COMPLETION'
  | 'ATTENDANCE_CERTIFICATE';

export type CertificateStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'ISSUED' | 'REJECTED';

export interface CertificateRequest {
  id: string;
  certificateType: CertificateType;
  title: string;
  purpose: string;
  requestedDate: string;
  status: CertificateStatus;
  downloadUrl?: string;
  referenceNumber?: string;
  remarks?: string;
}

export interface StudentNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  category: 'EXAM' | 'ASSIGNMENT' | 'FEE' | 'ATTENDANCE' | 'LEAVE' | 'ACADEMIC' | 'GENERAL';
  isRead: boolean;
  actionUrl?: string;
}

export interface EnrolledSubject {
  id: string;
  code: string;
  name: string;
  department: string;
  credits: number;
  professors: string[];
  totalLectures: number;
  attendedLectures: number;
  attendancePercentage: number;
  syllabusProgressPercentage: number;
  description: string;
  prescribedBooks: string[];
}

export interface AcademicCalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  category: 'HOLIDAY' | 'EXAM' | 'CLINICAL' | 'EVENT' | 'ACADEMIC';
  description: string;
  isMandatory: boolean;
  location?: string;
}

export interface StudentSettingsState {
  emailNotifications: boolean;
  smsAlerts: boolean;
  assignmentReminders: boolean;
  feeDueAlerts: boolean;
  attendanceAlerts: boolean;
  twoFactorAuth: boolean;
}
