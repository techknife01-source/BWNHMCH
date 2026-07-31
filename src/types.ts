/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole =
  | 'super_admin'
  | 'principal'
  | 'vice_principal'
  | 'office_admin'
  | 'faculty'
  | 'hod'
  | 'hospital_superintendent'
  | 'librarian'
  | 'accountant'
  | 'reception'
  | 'admission_cell'
  | 'student'
  | 'patient'
  | 'guest'
  | 'opd_staff';

export interface UserSession {
  role: UserRole;
  name: string;
  email: string;
  avatar: string;
  department?: string;
  regNo?: string;
}

export type ActiveTab =
  // Public Pages
  | 'home'
  | 'about'
  | 'vision'
  | 'principal_msg'
  | 'history'
  | 'campus'
  | 'departments'
  | 'faculty'
  | 'teaching_hospital'
  | 'research'
  | 'admissions'
  | 'courses'
  | 'academic_calendar'
  | 'gallery'
  | 'events'
  | 'news'
  | 'notice_board'
  | 'downloads'
  | 'contact'
  | 'faq'
  | 'feedback'
  | 'career'
  | 'tender'
  | 'alumni'
  | 'anti_ragging'
  | 'grievance'
  | 'iqac'
  | 'naac'
  | 'nch'
  | 'rti'
  | 'privacy'
  | 'terms'
  // Authentication
  | 'login'
  | 'forgot_password'
  | 'reset_password'
  | 'otp_verification'
  // Portal Dashboards
  | 'dashboard';

// Inside dashboards, we track sub-views
export type DashboardSubView =
  // General Dashboard View
  | 'overview'
  // Student Module Sub-Views
  | 'student_list'
  | 'student_profile'
  | 'student_admission'
  | 'student_attendance'
  | 'student_results'
  | 'student_fees'
  | 'student_scholarship'
  | 'student_certificates'
  | 'student_library'
  | 'student_clinical_posting'
  | 'student_assignments'
  | 'student_timetable'
  | 'student_progress'
  | 'student_documents'
  | 'student_booking'
  // Faculty Module Sub-Views
  | 'faculty_list'
  | 'faculty_profile'
  | 'faculty_attendance'
  | 'faculty_schedule'
  | 'faculty_dept_allocation'
  | 'faculty_research'
  | 'faculty_publication'
  | 'faculty_performance'
  | 'faculty_leave'
  // Academic Module Sub-Views
  | 'academic_timetable'
  | 'academic_subjects'
  | 'academic_courses'
  | 'academic_exams'
  | 'academic_calendar_mgmt'
  | 'academic_study_materials'
  // Hospital Module Sub-Views
  | 'hospital_patient_reg'
  | 'hospital_opd'
  | 'hospital_ipd'
  | 'hospital_doctors'
  | 'hospital_appointments'
  | 'hospital_clinical_posting'
  | 'hospital_medical_records'
  | 'hospital_laboratory'
  | 'hospital_pharmacy'
  | 'hospital_reports'
  // Administration Module Sub-Views
  | 'admin_employee'
  | 'admin_hr'
  | 'admin_payroll'
  | 'admin_inventory'
  | 'admin_assets'
  | 'admin_automation'
  | 'admin_purchase'
  | 'admin_committees'
  | 'admin_documents'
  | 'principal_desk_cms'
  | 'cms_website_editor'
  // Analytics Module Sub-Views
  | 'analytics_admission'
  | 'analytics_attendance'
  | 'analytics_faculty'
  | 'analytics_hospital'
  | 'analytics_research'
  | 'analytics_finance'
  | 'analytics_student'
  | 'analytics_department'
  // Gallery Management
  | 'gallery_mgmt'
  // Notice Management
  | 'notice_mgmt';

export interface PrincipalProfile {
  name: string;
  title: string;
  qualification: string;
  experience: string;
  image: string;
  messageText: string;
  tenure: string;
  email: string;
  phone: string;
}

export interface LibraryBook {
  id: string;
  title: string;
  author: string;
  category: 'Materia Medica' | 'Organon' | 'Repertory' | 'Pharmacy' | 'Medicine' | 'Research Journal' | 'Question Paper';
  publisher: string;
  year: number;
  fileType: 'PDF' | 'EPUB';
  allowDownload: boolean; // false for students, true for faculty/admin
  coverUrl: string;
  sampleContent: string[];
  pageCount: number;
}

export interface IPDBed {
  id: string;
  bedNumber: string;
  wardName: 'Dhanvantari Acute Ward' | 'Hahnemann Male IPD' | 'Kent Female IPD' | 'Boenninghausen Pediatric Ward';
  isOccupied: boolean;
  patientName?: string;
  caseNo?: string;
  doctorInCharge?: string;
  admissionDate?: string;
  nursingNote?: string;
  vitals?: string;
}

export interface PharmacyItem {
  id: string;
  name: string;
  potency: string;
  form: 'Globules' | 'Dilution' | 'Mother Tincture' | 'Ointment' | 'Trituration';
  batchNo: string;
  expiryDate: string;
  stockQuantity: number;
  reorderLevel: number;
  pricePerUnit: number;
}

export interface LabTestRecord {
  id: string;
  testName: string;
  patientName: string;
  caseNo: string;
  requestedDate: string;
  status: 'Ordered' | 'Sample Collected' | 'Under Testing' | 'Report Ready';
  resultSummary?: string;
  referenceRange?: string;
}

export interface CMSData {
  collegeName: string;
  address: string;
  phone: string;
  email: string;
  aboutText: string;
  historyText: string;
  missionText: string;
  visionText: string;
  seoTitle: string;
  seoDescription: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hod: string;
  facultyCount: number;
  description: string;
  labs: string[];
}

export interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  experience: string;
  email: string;
  publications: number;
}

export interface StudentRecord {
  id: string;
  name: string;
  rollNo: string;
  enrollmentNo: string;
  year: 'BHMS I' | 'BHMS II' | 'BHMS III' | 'BHMS IV' | 'Intern';
  attendance: number; // percentage
  gpa: number;
  feesPaid: number;
  feesTotal: number;
  scholarship: string;
  clinicalPosting: string;
  email: string;
  phone: string;
}

export interface PatientRecord {
  id: string;
  caseNo: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  dateRegistered: string;
  type: 'OPD' | 'IPD';
  department: string;
  complaint: string;
  homoeopathicRemedy?: string;
  potency?: string;
  status: 'Recovered' | 'Under Treatment' | 'Referred' | 'Discharged';
  doctor: string;
}

export interface Notice {
  id: string;
  title: string;
  category: 'Academic' | 'Hospital' | 'Admission' | 'General' | 'Examination';
  date: string;
  content: string;
  isPinned: boolean;
  attachmentName?: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  category: 'Campus' | 'Seminars' | 'Clinical Training' | 'Sports' | 'Social Service';
  date: string;
}

export interface ServiceBooking {
  id: string;
  serviceType: string;
  studentId: string;
  studentName: string;
  bookingDate: string;
  prefDate: string;
  prefTime: string;
  documentsUploaded: string[];
  status: 'Pending' | 'Approved' | 'In Progress' | 'Completed' | 'Rejected';
  history: {
    status: string;
    note: string;
    date: string;
  }[];
}

export interface FeedbackSubmission {
  id: string;
  name: string;
  email: string;
  role: 'Student' | 'Faculty' | 'Alumni' | 'Patient' | 'Visitor';
  subject: string;
  message: string;
  rating: number;
  date: string;
}

export interface Course {
  id: string;
  name: string;
  duration: string;
  intake: number;
  eligibility: string;
  syllabusOverview: string[];
}

export * from './types/index';

