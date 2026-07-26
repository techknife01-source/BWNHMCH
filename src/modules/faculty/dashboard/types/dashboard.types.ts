export interface FacultyStatistics {
  activeClassesCount: number;
  assignedSubjectsCount: number;
  overallAttendancePercentage: number;
  attendanceTargetPercentage: number;
  attendanceTrendPercentage: number;
  pendingAssignmentsCount: number;
  evaluatedAssignmentsCount: number;
  publishedResearchCount: number;
  underReviewResearchCount: number;
  uploadedMaterialsCount: number;
  hospitalMonthlyDutyHours: number;
  opdRoomNumber: string;
  pendingReviewsCount: number;
}

export interface FacultyClass {
  id: string;
  subject: string;
  batch: string;
  room: string;
  time: string;
  status: 'Ongoing' | 'Upcoming' | 'Scheduled' | 'Completed';
  studentsCount: number;
  topic: string;
  departmentCode?: string;
}

export interface FacultySchedule {
  id: string;
  time: string;
  title: string;
  location: string;
  type: 'Administrative' | 'Class Lecture' | 'Clinical Duty' | 'Academic Review' | 'Meeting';
  status: 'completed' | 'in-progress' | 'upcoming';
  date?: string;
}

export interface FacultyActivity {
  id: string;
  type: 'attendance' | 'assignment' | 'upload' | 'research' | 'exam' | 'general';
  title: string;
  details: string;
  timestamp: string;
  performer?: string;
}

export interface FacultyNotice {
  id: string;
  title: string;
  category: 'All' | 'Department' | 'Academic' | 'Hospital' | 'Research' | 'Administrative';
  date: string;
  pinned: boolean;
  sender: string;
  desc: string;
  attachmentUrl?: string;
}

export interface FacultyResearchSummary {
  publishedCount: number;
  underReviewCount: number;
  totalGrantsAmount: string;
  recentPublications: Array<{
    id: string;
    title: string;
    journal: string;
    year: string;
    status: string;
  }>;
}

export interface FacultyAttendanceSummary {
  avgAttendanceRate: number;
  classesConducted: string;
  completionRatePercentage: number;
  lowAttendanceStudentsCount: number;
  pendingRegistersCount: number;
  monthlyTargetPercentage: number;
  actionRequiredNotice?: string;
}

export interface FacultyAssignmentSummary {
  pendingEvaluationCount: number;
  evaluatedThisWeekCount: number;
  totalActiveAssignments: number;
  avgScorePercentage: number;
  urgentSubmission?: {
    title: string;
    batch: string;
    dueDate: string;
  };
}

export interface FacultyLibrarySummary {
  requestedBooksCount: number;
  approvedRequisitionsCount: number;
  eNotesUploadedCount: number;
  recentUploads: Array<{
    id: string;
    title: string;
    category: string;
    uploadedAt: string;
  }>;
}

export interface HospitalNotification {
  id: string;
  opdShift: string;
  shiftTime: string;
  ipdDuty: string;
  internsCount: number;
  approvalPendingCount: number;
  statusNotice: string;
}

export interface AttendanceTrendItem {
  period: string;
  batch1stYear: number;
  batch2ndYear: number;
  batch3rdYear?: number;
}

export interface TeachingHoursItem {
  category: string;
  hours: number;
  color?: string;
}

export interface AssignmentCompletionItem {
  subject: string;
  evaluated: number;
  pending: number;
}

export interface StudentPerformanceDistribution {
  category: string;
  count: number;
}

export interface PerformanceStatistics {
  attendanceTrend: {
    weekly: AttendanceTrendItem[];
    monthly: AttendanceTrendItem[];
    term: AttendanceTrendItem[];
  };
  teachingHoursBreakdown: TeachingHoursItem[];
  assignmentCompletion: AssignmentCompletionItem[];
  studentPerformanceDistribution: StudentPerformanceDistribution[];
  insightMessage: string;
  lastSyncedTimestamp: string;
}

export interface QuickAction {
  id: string;
  label: string;
  desc: string;
  iconName: string;
  color: string;
  route?: string;
  category?: string;
}

export interface FacultyDashboardSummary {
  statistics: FacultyStatistics;
  classes: FacultyClass[];
  schedule: FacultySchedule[];
  activities: FacultyActivity[];
  notices: FacultyNotice[];
  researchSummary: FacultyResearchSummary;
  attendanceSummary: FacultyAttendanceSummary;
  assignmentSummary: FacultyAssignmentSummary;
  librarySummary: FacultyLibrarySummary;
  hospitalNotification: HospitalNotification;
  performanceStatistics: PerformanceStatistics;
}
