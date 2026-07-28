// User & Auth Types
export type UserRole = 
  | 'ROLE_STUDENT'
  | 'ROLE_FACULTY'
  | 'ROLE_PRINCIPAL'
  | 'ROLE_ADMIN'
  | 'ROLE_HOSPITAL'
  | 'ROLE_LIBRARIAN'
  | 'ROLE_RECEPTIONIST'
  | 'ROLE_ACCOUNTANT'
  | 'ROLE_SUPER_ADMIN';

export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  avatarUrl?: string;
  phoneNumber?: string;
  department?: string;
  designation?: string;
  registrationNo?: string;
  roles: UserRole[];
  enabled: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  userId: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  department?: string;
  roles: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  pageNo: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

// Notice & Announcements
export interface Notice {
  id: string;
  title: string;
  category: 'ACADEMIC' | 'EXAM' | 'ADMINISTRATIVE' | 'HOSPITAL' | 'GENERAL';
  content: string;
  attachmentUrl?: string;
  publishedDate: string;
  isImportant: boolean;
  author: string;
}

// Events
export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventDate: string;
  location: string;
  organizer: string;
  imageUrl?: string;
  category: string;
}

// Department
export interface Department {
  id: string;
  code: string;
  name: string;
  headOfDepartment: string;
  description: string;
  facultyCount: number;
  studentCapacity: number;
  iconName?: string;
}

// Hospital Doctor & OPD
export interface Doctor {
  id: string;
  name: string;
  qualification: string;
  department: string;
  designation: string;
  opdSchedule: string;
  availableDays: string[];
  imageUrl?: string;
}

// Gallery Item
export interface GalleryItem {
  id: string;
  title: string;
  category: 'CAMPUS' | 'CLINICAL' | 'EVENTS' | 'HERB_GARDEN' | 'SEMINARS';
  imageUrl: string;
  date: string;
}

// CMS Landing Content
export interface CMSContent {
  hero: {
    title: string;
    subtitle: string;
    badge: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  overview: {
    heading: string;
    text: string;
    estd: string;
    affiliations: string[];
  };
  principalMessage: {
    name: string;
    designation: string;
    message: string;
    imageUrl: string;
  };
  achievements: Array<{
    number: string;
    label: string;
    icon: string;
  }>;
  testimonials: Array<{
    id: string;
    name: string;
    role: string;
    quote: string;
    avatar: string;
  }>;
}

// Student Profile & Academic
export interface StudentProfile {
  id: string;
  rollNumber: string;
  registrationNumber: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  course: string;
  currentSemester: string;
  session: string;
  bloodGroup: string;
  dateOfBirth: string;
  gender: string;
  profilePicture?: string;
  guardianName: string;
  guardianRelation: string;
  guardianPhone: string;
  address: {
    street: string;
    city: string;
    state: string;
    pincode: string;
  };
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  documents: Array<{
    id: string;
    title: string;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
  cgpa: number;
  sgpa: number;
  overallAttendancePercentage: number;
}

// Attendance
export interface SubjectAttendance {
  subjectCode: string;
  subjectName: string;
  totalClasses: number;
  attendedClasses: number;
  percentage: number;
  facultyName: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  subjectName: string;
  subjectCode: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  timeSlot: string;
  facultyName: string;
  remarks?: string;
}

export interface AttendanceSummary {
  overallPercentage: number;
  totalClassesHeld: number;
  totalAttended: number;
  subjectWise: SubjectAttendance[];
  monthlyTrend: Array<{ month: string; percentage: number }>;
}

// Assignment
export interface Assignment {
  id: string;
  title: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  assignedDate: string;
  dueDate: string;
  totalMarks: number;
  obtainedMarks?: number;
  status: 'PENDING' | 'SUBMITTED' | 'GRADED' | 'OVERDUE';
  description: string;
  fileAttachmentUrl?: string;
  submissionUrl?: string;
  submittedAt?: string;
  feedback?: string;
}

// Exam & Result
export interface ExamSchedule {
  id: string;
  title: string;
  type: 'INTERNAL' | 'UNIVERSITY' | 'PRACTICAL' | 'VIVA';
  subjectName: string;
  subjectCode: string;
  examDate: string;
  timeSlot: string;
  roomNo: string;
  maxMarks: number;
}

export interface SemesterResult {
  id: string;
  semester: string;
  academicYear: string;
  sgpa: number;
  cgpa: number;
  resultStatus: 'PASSED' | 'FAILED' | 'PROMOTED';
  gradeSheetUrl: string;
  subjects: Array<{
    code: string;
    name: string;
    credits: number;
    internalMarks: number;
    universityMarks: number;
    totalMarks: number;
    grade: string;
    status: 'PASS' | 'FAIL';
  }>;
}

// Fees
export interface FeeDetail {
  id: string;
  feeType: string;
  semester: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'PAID' | 'PARTIAL' | 'PENDING' | 'OVERDUE';
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  paymentDate: string;
  amount: number;
  paymentMode: 'ONLINE' | 'UPI' | 'NET_BANKING' | 'CARD' | 'CASH' | 'DD';
  transactionId: string;
  feeType: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  receiptUrl: string;
}

// E-Library Book & Digital Resource
export type DigitalResourceType = 'BOOK' | 'JOURNAL' | 'MAGAZINE' | 'RESEARCH_PAPER' | 'DIGITAL_NOTE' | 'NOTES' | 'PRESENTATION' | 'DOCUMENT';
export type DigitalFileFormat = 'PDF' | 'PPT' | 'PPTX' | 'DOC' | 'DOCX' | 'TXT';

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  publisher: string;
  category: string;
  isbn?: string;
  accessionNo?: string;
  type?: DigitalResourceType;
  resourceType?: DigitalResourceType;
  fileFormat?: DigitalFileFormat;
  department?: string;
  semester?: string;
  subject?: string;
  year?: string | number;
  availableCopies?: number;
  isBookmarked?: boolean;
  coverImageUrl?: string;
  coverUrl?: string;
  streamUrl?: string;
  fileUrl?: string;
  readingProgress?: number;
  uploadedBy?: string;
  uploadedByUserId?: string;
  uploadedRole?: string;
  uploadedByRole?: string;
  uploadedAt?: string;
  viewsCount?: number;
  viewCount?: number;
  downloadsCount?: number;
  downloadCount?: number;
  allowDownload?: boolean;
  description?: string;
  fileSize?: string;
  fileName?: string;
  fileDataUrl?: string;
  pageCount?: number;
  sampleContent?: string[];
}

// Hospital Appointment
export interface HospitalAppointment {
  id: string;
  appointmentNo: string;
  doctorName: string;
  doctorDepartment: string;
  appointmentDate: string;
  timeSlot: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  symptoms?: string;
  prescriptionUrl?: string;
  labReportUrl?: string;
  followUpDate?: string;
}

// Download Item
export interface DownloadItem {
  id: string;
  title: string;
  category: 'Forms' | 'Certificates' | 'Hall Ticket' | 'ID Card' | 'Prospectus' | 'Academic Calendar';
  fileType: string;
  fileSize: string;
  updatedAt: string;
  downloadUrl: string;
}

// Timetable
export interface TimetableEntry {
  id: string;
  dayOfWeek: 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';
  timeSlot: string;
  subjectName: string;
  subjectCode: string;
  facultyName: string;
  roomNo: string;
  type: 'LECTURE' | 'PRACTICAL' | 'CLINICAL' | 'SEMINAR';
}

// Study Material
export interface StudyMaterial {
  id: string;
  title: string;
  subjectName: string;
  type: 'Notes' | 'Presentations' | 'Reference Materials' | 'Question Papers' | 'Previous Year Papers' | 'Syllabus';
  authorFaculty: string;
  uploadedDate: string;
  department: string;
  fileSize: string;
  fileUrl: string;
  isBookmarked?: boolean;
  readTimeMinutes?: number;
}

// Recent Activity
export interface ActivityLog {
  id: string;
  title: string;
  timestamp: string;
  type: 'ATTENDANCE' | 'ASSIGNMENT' | 'EXAM' | 'LIBRARY' | 'FEE' | 'HOSPITAL' | 'SYSTEM';
  description: string;
}

// Theme
export type ThemeMode = 'light' | 'dark' | 'system';
