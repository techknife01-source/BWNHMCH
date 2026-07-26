import { apiClient } from '../../../../services/api/apiClient';
import { ApiResponse } from '../../../../types/index';
import {
  FacultyDashboardSummary,
  FacultyStatistics,
  FacultyClass,
  FacultySchedule,
  FacultyActivity,
  FacultyNotice,
  FacultyResearchSummary,
  FacultyAttendanceSummary,
  FacultyAssignmentSummary,
  FacultyLibrarySummary,
  HospitalNotification,
  PerformanceStatistics,
} from '../types/dashboard.types';
import {
  facultyDashboardSummarySchema,
  facultyStatisticsSchema,
  facultyClassSchema,
  facultyScheduleSchema,
  facultyActivitySchema,
  facultyNoticeSchema,
  facultyResearchSummarySchema,
  facultyAttendanceSummarySchema,
  facultyAssignmentSummarySchema,
  facultyLibrarySummarySchema,
  hospitalNotificationSchema,
  performanceStatisticsSchema,
} from '../schemas/dashboard.schema';
import { logDashboardError } from '../utils/dashboard.utils';

// Default Fallback Data Generator
export const DEFAULT_FACULTY_STATISTICS: FacultyStatistics = {
  activeClassesCount: 12,
  assignedSubjectsCount: 4,
  overallAttendancePercentage: 87.4,
  attendanceTargetPercentage: 85.0,
  attendanceTrendPercentage: 3.1,
  pendingAssignmentsCount: 18,
  evaluatedAssignmentsCount: 173,
  publishedResearchCount: 8,
  underReviewResearchCount: 2,
  uploadedMaterialsCount: 24,
  hospitalMonthlyDutyHours: 36,
  opdRoomNumber: 'General Medicine OPD Room 4',
  pendingReviewsCount: 5,
};

export const DEFAULT_TODAYS_CLASSES: FacultyClass[] = [
  {
    id: '1',
    subject: 'Organon of Medicine & Philosophy',
    batch: '1st BHMS (Batch A & B)',
    room: 'Lecture Hall 2 (Ground Floor)',
    time: '10:00 AM - 11:00 AM',
    status: 'Ongoing',
    studentsCount: 60,
    topic: 'Vital Force Concept & §9 - §16 Organon Analysis',
  },
  {
    id: '2',
    subject: 'Homoeopathic Materia Medica',
    batch: '2nd BHMS',
    room: 'Lecture Hall 4 (1st Floor)',
    time: '11:30 AM - 12:30 PM',
    status: 'Upcoming',
    studentsCount: 50,
    topic: 'Polycrest Remedies - Nux Vomica Clinical Indications',
  },
  {
    id: '3',
    subject: 'Homoeopathic Pharmacy Practical',
    batch: '1st BHMS (Batch B)',
    room: 'Pharmacy Lab 1',
    time: '02:00 PM - 04:00 PM',
    status: 'Scheduled',
    studentsCount: 30,
    topic: 'Preparation of Centesimal Scale Potencies',
  },
];

export const DEFAULT_UPCOMING_SCHEDULE: FacultySchedule[] = [
  {
    id: 's1',
    time: '09:30 AM - 10:00 AM',
    title: 'Faculty Morning Attendance & Biometric Sign-in',
    location: 'Central Academic Block',
    type: 'Administrative',
    status: 'completed',
  },
  {
    id: 's2',
    time: '10:00 AM - 11:00 AM',
    title: '1st BHMS Organon Lecture (§9 - §16)',
    location: 'Lecture Hall 2',
    type: 'Class Lecture',
    status: 'in-progress',
  },
  {
    id: 's3',
    time: '11:30 AM - 02:30 PM',
    title: 'General Medicine OPD Duty Shift',
    location: 'Hospital OPD Room 4',
    type: 'Clinical Duty',
    status: 'upcoming',
  },
  {
    id: 's4',
    time: '02:30 PM - 03:30 PM',
    title: 'Materia Medica Assignment Review',
    location: 'Faculty Department Office',
    type: 'Academic Review',
    status: 'upcoming',
  },
  {
    id: 's5',
    time: '03:30 PM - 04:30 PM',
    title: 'Departmental Faculty & Curriculum Meeting',
    location: 'Conference Room B',
    type: 'Meeting',
    status: 'upcoming',
  },
];

export const DEFAULT_RECENT_ACTIVITIES: FacultyActivity[] = [
  {
    id: 'a1',
    type: 'attendance',
    title: 'Submitted Attendance Register',
    details: 'Marked 1st BHMS Organon Lecture attendance (58 Present, 2 Absent)',
    timestamp: 'Today, 11:05 AM',
  },
  {
    id: 'a2',
    type: 'assignment',
    title: 'Evaluated 12 Logbook Submissions',
    details: 'Completed grading for 2nd BHMS Chronic Case Analysis assignments',
    timestamp: 'Yesterday, 04:30 PM',
  },
  {
    id: 'a3',
    type: 'upload',
    title: 'Uploaded E-Learning Lecture Notes',
    details: 'Added "Polychrest Remedy Notes - Sepia.pdf" to 3rd BHMS drive',
    timestamp: '22 July, 02:15 PM',
  },
  {
    id: 'a4',
    type: 'research',
    title: 'Updated Research Manuscript Draft',
    details: 'Uploaded revised manuscript for IJRH Journal review',
    timestamp: '21 July, 11:20 AM',
  },
];

export const DEFAULT_DEPARTMENT_NOTICES: FacultyNotice[] = [
  {
    id: 'n1',
    title: 'Submission of WBUHS Internal Assessment Marks - Term I',
    category: 'Academic',
    date: '23 July 2026',
    pinned: true,
    sender: 'Office of Academic Affairs',
    desc: 'All faculty members are directed to submit internal assessment theory and practical marks on the portal prior to 30th July 2026.',
  },
  {
    id: 'n2',
    title: 'Revised OPD Roster for August 2026',
    category: 'Hospital',
    date: '22 July 2026',
    pinned: true,
    sender: 'Hospital Superintendent',
    desc: 'Updated duty allocations for clinical departments including Sunday emergency call duties are available for download.',
  },
  {
    id: 'n3',
    title: 'Departmental Curriculum Review - Organon & Philosophy',
    category: 'Department',
    date: '20 July 2026',
    pinned: false,
    sender: 'HOD Department of Organon',
    desc: 'Monthly departmental review of lecture progress and logbook verification scheduled for Friday.',
  },
  {
    id: 'n4',
    title: 'Call for AYUSH Extra-Mural Research Grant Proposals',
    category: 'Research',
    date: '18 July 2026',
    pinned: false,
    sender: 'Research & Ethics Committee',
    desc: 'Faculty interested in submitting CCRH and AYUSH grant proposals for AY 2026-27 may forward drafts to the committee.',
  },
];

export const DEFAULT_HOSPITAL_NOTIFICATION: HospitalNotification = {
  id: 'hn1',
  opdShift: 'General Medicine OPD Room 4',
  shiftTime: '11:30 AM - 02:30 PM',
  ipdDuty: 'Female Ward B (12 Beds)',
  internsCount: 6,
  approvalPendingCount: 3,
  statusNotice: 'Intern Case Record Approval Pending',
};

export const DEFAULT_RESEARCH_SUMMARY: FacultyResearchSummary = {
  publishedCount: 8,
  underReviewCount: 2,
  totalGrantsAmount: '₹4.5 Lakhs',
  recentPublications: [
    {
      id: 'r1',
      title: 'Clinical Efficacy of Homoeopathic Remedies in Allergic Rhinitis',
      journal: 'Indian Journal of Research in Homoeopathy (IJRH)',
      year: '2026',
      status: 'Published',
    },
    {
      id: 'r2',
      title: 'Standardisation of Homoeopathic Potentisation Techniques',
      journal: 'Journal of AYUSH Medical Sciences',
      year: '2025',
      status: 'Published',
    },
  ],
};

export const DEFAULT_ATTENDANCE_SUMMARY: FacultyAttendanceSummary = {
  avgAttendanceRate: 87.4,
  classesConducted: '48 / 52',
  completionRatePercentage: 92,
  lowAttendanceStudentsCount: 14,
  pendingRegistersCount: 1,
  monthlyTargetPercentage: 85,
  actionRequiredNotice: 'Action Required: 1st BHMS Anatomy practical attendance register from yesterday is pending submission.',
};

export const DEFAULT_ASSIGNMENT_SUMMARY: FacultyAssignmentSummary = {
  pendingEvaluationCount: 18,
  evaluatedThisWeekCount: 42,
  totalActiveAssignments: 12,
  avgScorePercentage: 74.5,
  urgentSubmission: {
    title: '2nd BHMS Chronic Case Taking Logbooks',
    batch: 'Batch B',
    dueDate: '28 July 2026',
  },
};

export const DEFAULT_LIBRARY_SUMMARY: FacultyLibrarySummary = {
  requestedBooksCount: 5,
  approvedRequisitionsCount: 4,
  eNotesUploadedCount: 24,
  recentUploads: [
    {
      id: 'l1',
      title: 'Organon Section §9 to §22 Lecture Notes.pdf',
      category: 'Lecture Notes',
      uploadedAt: '24 July 2026',
    },
    {
      id: 'l2',
      title: 'Polychrest Remedy Comparative Study PPT.pdf',
      category: 'Presentation',
      uploadedAt: '20 July 2026',
    },
  ],
};

export const DEFAULT_PERFORMANCE_STATISTICS: PerformanceStatistics = {
  attendanceTrend: {
    weekly: [
      { period: 'Mon', batch1stYear: 88, batch2ndYear: 82 },
      { period: 'Tue', batch1stYear: 92, batch2ndYear: 85 },
      { period: 'Wed', batch1stYear: 85, batch2ndYear: 80 },
      { period: 'Thu', batch1stYear: 90, batch2ndYear: 88 },
      { period: 'Fri', batch1stYear: 84, batch2ndYear: 86 },
      { period: 'Sat', batch1stYear: 89, batch2ndYear: 83 },
    ],
    monthly: [
      { period: 'Week 1', batch1stYear: 86, batch2ndYear: 81 },
      { period: 'Week 2', batch1stYear: 89, batch2ndYear: 84 },
      { period: 'Week 3', batch1stYear: 91, batch2ndYear: 86 },
      { period: 'Week 4', batch1stYear: 88, batch2ndYear: 85 },
    ],
    term: [
      { period: 'Jan', batch1stYear: 84, batch2ndYear: 79 },
      { period: 'Feb', batch1stYear: 87, batch2ndYear: 82 },
      { period: 'Mar', batch1stYear: 89, batch2ndYear: 84 },
      { period: 'Apr', batch1stYear: 90, batch2ndYear: 86 },
      { period: 'May', batch1stYear: 88, batch2ndYear: 85 },
      { period: 'Jun', batch1stYear: 92, batch2ndYear: 87 },
    ],
  },
  teachingHoursBreakdown: [
    { category: 'Lectures', hours: 16, color: '#002147' },
    { category: 'Clinical OPD', hours: 12, color: '#00A651' },
    { category: 'Practical Labs', hours: 10, color: '#3B82F6' },
    { category: 'Tutorials', hours: 6, color: '#8B5CF6' },
    { category: 'Research & Admin', hours: 8, color: '#F59E0B' },
  ],
  assignmentCompletion: [
    { subject: 'Organon Case Studies', evaluated: 42, pending: 8 },
    { subject: 'Materia Medica Logbooks', evaluated: 38, pending: 12 },
    { subject: 'Pharmacy Practicals', evaluated: 55, pending: 5 },
    { subject: 'Repertory Exercises', evaluated: 30, pending: 10 },
    { subject: 'Pathology Reports', evaluated: 48, pending: 6 },
  ],
  studentPerformanceDistribution: [
    { category: 'Distinction (>75%)', count: 28 },
    { category: 'First Class (60-74%)', count: 45 },
    { category: 'Second Class (50-59%)', count: 18 },
    { category: 'Needs Improvement (<50%)', count: 6 },
  ],
  insightMessage: 'Attendance across 1st BHMS lectures is up by 4.2% this month.',
  lastSyncedTimestamp: 'Today 09:30 AM',
};

export const DEFAULT_FACULTY_DASHBOARD_SUMMARY: FacultyDashboardSummary = {
  statistics: DEFAULT_FACULTY_STATISTICS,
  classes: DEFAULT_TODAYS_CLASSES,
  schedule: DEFAULT_UPCOMING_SCHEDULE,
  activities: DEFAULT_RECENT_ACTIVITIES,
  notices: DEFAULT_DEPARTMENT_NOTICES,
  researchSummary: DEFAULT_RESEARCH_SUMMARY,
  attendanceSummary: DEFAULT_ATTENDANCE_SUMMARY,
  assignmentSummary: DEFAULT_ASSIGNMENT_SUMMARY,
  librarySummary: DEFAULT_LIBRARY_SUMMARY,
  hospitalNotification: DEFAULT_HOSPITAL_NOTIFICATION,
  performanceStatistics: DEFAULT_PERFORMANCE_STATISTICS,
};

export const facultyDashboardApi = {
  /**
   * Get full dashboard summary
   */
  getDashboardSummary: async (): Promise<FacultyDashboardSummary> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyDashboardSummary>>('/faculty/dashboard/summary');
      const data = response.data?.data;
      const parsed = facultyDashboardSummarySchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as FacultyDashboardSummary;
      }
      return DEFAULT_FACULTY_DASHBOARD_SUMMARY;
    } catch (error) {
      logDashboardError('getDashboardSummary', error);
      return DEFAULT_FACULTY_DASHBOARD_SUMMARY;
    }
  },

  /**
   * Get Statistics metrics
   */
  getDashboardStatistics: async (): Promise<FacultyStatistics> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyStatistics>>('/faculty/dashboard/statistics');
      const data = response.data?.data;
      const parsed = facultyStatisticsSchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as FacultyStatistics;
      }
      return DEFAULT_FACULTY_STATISTICS;
    } catch (error) {
      logDashboardError('getDashboardStatistics', error);
      return DEFAULT_FACULTY_STATISTICS;
    }
  },

  /**
   * Get Today's Classes
   */
  getTodaysClasses: async (): Promise<FacultyClass[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyClass[]>>('/faculty/dashboard/today-classes');
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const parsed = facultyClassSchema.safeParse(item);
          return parsed.success ? (parsed.data as FacultyClass) : item;
        });
      }
      return DEFAULT_TODAYS_CLASSES;
    } catch (error) {
      logDashboardError('getTodaysClasses', error);
      return DEFAULT_TODAYS_CLASSES;
    }
  },

  /**
   * Get Upcoming Schedule
   */
  getUpcomingSchedule: async (): Promise<FacultySchedule[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultySchedule[]>>('/faculty/dashboard/schedule');
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const parsed = facultyScheduleSchema.safeParse(item);
          return parsed.success ? (parsed.data as FacultySchedule) : item;
        });
      }
      return DEFAULT_UPCOMING_SCHEDULE;
    } catch (error) {
      logDashboardError('getUpcomingSchedule', error);
      return DEFAULT_UPCOMING_SCHEDULE;
    }
  },

  /**
   * Get Recent Activities
   */
  getRecentActivities: async (): Promise<FacultyActivity[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyActivity[]>>('/faculty/dashboard/activities');
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const parsed = facultyActivitySchema.safeParse(item);
          return parsed.success ? (parsed.data as FacultyActivity) : item;
        });
      }
      return DEFAULT_RECENT_ACTIVITIES;
    } catch (error) {
      logDashboardError('getRecentActivities', error);
      return DEFAULT_RECENT_ACTIVITIES;
    }
  },

  /**
   * Get Department Notices
   */
  getDepartmentNotices: async (): Promise<FacultyNotice[]> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyNotice[]>>('/faculty/dashboard/notices');
      const data = response.data?.data;
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item) => {
          const parsed = facultyNoticeSchema.safeParse(item);
          return parsed.success ? (parsed.data as FacultyNotice) : item;
        });
      }
      return DEFAULT_DEPARTMENT_NOTICES;
    } catch (error) {
      logDashboardError('getDepartmentNotices', error);
      return DEFAULT_DEPARTMENT_NOTICES;
    }
  },

  /**
   * Get Hospital Duty Notifications
   */
  getHospitalNotifications: async (): Promise<HospitalNotification> => {
    try {
      const response = await apiClient.get<ApiResponse<HospitalNotification>>('/faculty/dashboard/hospital-notifications');
      const data = response.data?.data;
      const parsed = hospitalNotificationSchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as HospitalNotification;
      }
      return DEFAULT_HOSPITAL_NOTIFICATION;
    } catch (error) {
      logDashboardError('getHospitalNotifications', error);
      return DEFAULT_HOSPITAL_NOTIFICATION;
    }
  },

  /**
   * Get Research Summary
   */
  getResearchSummary: async (): Promise<FacultyResearchSummary> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyResearchSummary>>('/faculty/dashboard/research');
      const data = response.data?.data;
      const parsed = facultyResearchSummarySchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as FacultyResearchSummary;
      }
      return DEFAULT_RESEARCH_SUMMARY;
    } catch (error) {
      logDashboardError('getResearchSummary', error);
      return DEFAULT_RESEARCH_SUMMARY;
    }
  },

  /**
   * Get Attendance Summary
   */
  getAttendanceSummary: async (): Promise<FacultyAttendanceSummary> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyAttendanceSummary>>('/faculty/dashboard/attendance');
      const data = response.data?.data;
      const parsed = facultyAttendanceSummarySchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as FacultyAttendanceSummary;
      }
      return DEFAULT_ATTENDANCE_SUMMARY;
    } catch (error) {
      logDashboardError('getAttendanceSummary', error);
      return DEFAULT_ATTENDANCE_SUMMARY;
    }
  },

  /**
   * Get Assignment Summary
   */
  getAssignmentSummary: async (): Promise<FacultyAssignmentSummary> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyAssignmentSummary>>('/faculty/dashboard/assignments');
      const data = response.data?.data;
      const parsed = facultyAssignmentSummarySchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as FacultyAssignmentSummary;
      }
      return DEFAULT_ASSIGNMENT_SUMMARY;
    } catch (error) {
      logDashboardError('getAssignmentSummary', error);
      return DEFAULT_ASSIGNMENT_SUMMARY;
    }
  },

  /**
   * Get Library Summary
   */
  getLibrarySummary: async (): Promise<FacultyLibrarySummary> => {
    try {
      const response = await apiClient.get<ApiResponse<FacultyLibrarySummary>>('/faculty/dashboard/library');
      const data = response.data?.data;
      const parsed = facultyLibrarySummarySchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as FacultyLibrarySummary;
      }
      return DEFAULT_LIBRARY_SUMMARY;
    } catch (error) {
      logDashboardError('getLibrarySummary', error);
      return DEFAULT_LIBRARY_SUMMARY;
    }
  },

  /**
   * Get Performance Statistics
   */
  getPerformanceStatistics: async (): Promise<PerformanceStatistics> => {
    try {
      const response = await apiClient.get<ApiResponse<PerformanceStatistics>>('/faculty/dashboard/performance');
      const data = response.data?.data;
      const parsed = performanceStatisticsSchema.safeParse(data);
      if (parsed.success) {
        return parsed.data as PerformanceStatistics;
      }
      return DEFAULT_PERFORMANCE_STATISTICS;
    } catch (error) {
      logDashboardError('getPerformanceStatistics', error);
      return DEFAULT_PERFORMANCE_STATISTICS;
    }
  },
};
