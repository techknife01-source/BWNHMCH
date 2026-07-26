export type EmployeeType = 'TEACHING' | 'NON_TEACHING' | 'HOSPITAL_STAFF' | 'ADMINISTRATIVE';
export type EmployeeStatus = 'ACTIVE' | 'ON_LEAVE' | 'RESIGNED' | 'SUSPENDED' | 'PROBATION';
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Employee {
  id: string;
  empId: string;
  fullName: string;
  email: string;
  phone: string;
  gender: Gender;
  dob: string;
  joiningDate: string;
  departmentId: string;
  departmentName: string;
  designationId: string;
  designationName: string;
  employeeType: EmployeeType;
  status: EmployeeStatus;
  avatar?: string;
  qualification: string;
  experienceYears: number;
  bloodGroup: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  address: string;
  aadhaarNo: string;
  panNo: string;
  bankDetails: {
    bankName: string;
    accountNo: string;
    ifscCode: string;
    branch: string;
  };
  salaryBasic: number;
}

export interface DepartmentItem {
  id: string;
  code: string;
  name: string;
  category: 'ACADEMIC' | 'CLINICAL' | 'ADMINISTRATIVE' | 'SUPPORT';
  hodName: string;
  hodEmail: string;
  staffCount: number;
  budgetAllocated: number;
  description: string;
  roomLocation: string;
}

export interface DesignationItem {
  id: string;
  code: string;
  title: string;
  departmentCategory: 'ACADEMIC' | 'CLINICAL' | 'ADMINISTRATIVE' | 'ALL';
  payScaleGrade: string;
  minBasicPay: number;
  maxBasicPay: number;
  reportsTo: string;
  description: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'HALF_DAY' | 'ON_DUTY';

export interface StaffAttendance {
  id: string;
  empId: string;
  empName: string;
  departmentName: string;
  date: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: AttendanceStatus;
  workHours?: number;
  remarks?: string;
}

export type LeaveType = 'CASUAL' | 'DUTY' | 'MEDICAL' | 'EARNED' | 'MATERNITY' | 'PATERNITY';
export type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface LeaveApplication {
  id: string;
  empId: string;
  empName: string;
  departmentName: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  reviewedBy?: string;
  reviewRemarks?: string;
  documentUrl?: string;
}

export interface LeaveBalance {
  empId: string;
  casualLeaveTotal: number;
  casualLeaveUsed: number;
  dutyLeaveTotal: number;
  dutyLeaveUsed: number;
  medicalLeaveTotal: number;
  medicalLeaveUsed: number;
  earnedLeaveTotal: number;
  earnedLeaveUsed: number;
}

export interface HolidayItem {
  id: string;
  title: string;
  date: string;
  dayOfWeek: string;
  type: 'GAZETTED' | 'RESTRICTED' | 'ACADEMIC' | 'INSTITUTIONAL';
  description: string;
  isMandatory: boolean;
}

export interface JobRequisition {
  id: string;
  jobCode: string;
  title: string;
  departmentName: string;
  vacancies: number;
  minQualification: string;
  minExperienceYears: number;
  status: 'OPEN' | 'INTERVIEWING' | 'FILLED' | 'CLOSED';
  postedDate: string;
  closingDate: string;
  salaryRange: string;
  description: string;
}

export interface CandidateApplication {
  id: string;
  requisitionId: string;
  requisitionTitle: string;
  candidateName: string;
  email: string;
  phone: string;
  qualification: string;
  experienceYears: number;
  appliedDate: string;
  resumeUrl: string;
  status: 'APPLIED' | 'SHORTLISTED' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED';
  interviewDate?: string;
  interviewNotes?: string;
  offeredSalary?: number;
}

export interface JoiningProcess {
  id: string;
  candidateId: string;
  candidateName: string;
  empIdAssigned: string;
  designationName: string;
  departmentName: string;
  expectedJoiningDate: string;
  status: 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  checklist: {
    documentsVerified: boolean;
    biometricEnrolled: boolean;
    idCardIssued: boolean;
    emailAccountCreated: boolean;
    bankDetailsSubmitted: boolean;
    orientationCompleted: boolean;
  };
  notes?: string;
}

export interface EmployeeDocument {
  id: string;
  empId: string;
  empName: string;
  title: string;
  docType: 'AADHAAR' | 'PAN' | 'DEGREE_CERTIFICATE' | 'REGISTRATION_CERTIFICATE' | 'EXPERIENCE_LETTER' | 'OTHER';
  fileUrl: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  verifiedBy?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

export interface PayrollRecord {
  id: string;
  empId: string;
  empName: string;
  departmentName: string;
  designationName: string;
  monthYear: string; // e.g., '2026-07'
  basicPay: number;
  hra: number;
  da: number;
  specialAllowance: number;
  grossSalary: number;
  pfDeduction: number;
  esiDeduction: number;
  tdsDeduction: number;
  otherDeductions: number;
  totalDeductions: number;
  netSalary: number;
  status: 'DRAFT' | 'PROCESSED' | 'PAID';
  paymentDate?: string;
  transactionRef?: string;
}

export interface OrgNode {
  id: string;
  title: string;
  name: string;
  role: string;
  department: string;
  avatar?: string;
  children?: OrgNode[];
}

export interface MeetingItem {
  id: string;
  title: string;
  meetingType: 'ACADEMIC_COUNCIL' | 'GOVERNING_BODY' | 'HOSPITAL_ADVISORY' | 'DEPARTMENTAL' | 'COMMITTEE';
  date: string;
  timeSlot: string;
  location: string;
  organizer: string;
  attendeesCount: number;
  agenda: string;
  minutesOfMeeting?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  attachmentUrl?: string;
}

export interface CommitteeItem {
  id: string;
  name: string;
  code: string;
  chairperson?: string;
  convener?: string;
  convenorName?: string;
  memberCount?: number;
  membersCount?: number;
  membersList: string[];
  purpose: string;
  formedDate: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export interface CommitteeMeeting {
  id: string;
  title: string;
  committeeId: string;
  committeeName: string;
  meetingDate: string;
  startTime: string;
  endTime: string;
  venue: string;
  agenda: string;
  minutesOfMeeting?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
}

export interface InstitutionalCircular {
  id: string;
  circularNo: string;
  title: string;
  category?: 'ACADEMIC' | 'ADMINISTRATIVE' | 'HOSPITAL' | 'HOLIDAY';
  targetAudience: 'ALL' | 'FACULTY' | 'HOSPITAL_STAFF' | 'STUDENTS' | 'ALL_STAFF' | 'TEACHING_ONLY' | 'NON_TEACHING_ONLY' | 'HOSPITAL_STAFF_ONLY';
  issuedBy: string;
  publishDate?: string;
  publishedDate?: string;
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  content: string;
  attachmentUrl?: string;
}

export type CircularItem = InstitutionalCircular;

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'INFO' | 'ALERT' | 'ACTION' | 'SUCCESS' | 'SYSTEM' | 'POLICY' | 'EVENT' | 'BIRTHDAY';
  recipientType?: 'ALL' | 'TEACHING' | 'HOSPITAL_STAFF' | string;
  targetRole?: string;
  createdAt: string;
  isRead: boolean;
}

export type InternalNotification = AdminNotification;

export interface ActivityAuditLog {
  id: string;
  timestamp: string;
  userName?: string;
  userRole?: string;
  userEmail?: string;
  module?: string;
  action?: string;
  actionType?: string;
  resource?: string;
  status?: string;
  details: string;
  ipAddress: string;
  performedBy?: string;
}

export type SystemActivityLog = ActivityAuditLog;
export type SystemAuditLog = ActivityAuditLog;
