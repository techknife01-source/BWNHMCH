import { z } from 'zod';

export const facultyStatisticsSchema = z.object({
  activeClassesCount: z.number().default(12),
  assignedSubjectsCount: z.number().default(4),
  overallAttendancePercentage: z.number().default(87.4),
  attendanceTargetPercentage: z.number().default(85.0),
  attendanceTrendPercentage: z.number().default(3.1),
  pendingAssignmentsCount: z.number().default(18),
  evaluatedAssignmentsCount: z.number().default(173),
  publishedResearchCount: z.number().default(8),
  underReviewResearchCount: z.number().default(2),
  uploadedMaterialsCount: z.number().default(24),
  hospitalMonthlyDutyHours: z.number().default(36),
  opdRoomNumber: z.string().default('General Medicine OPD Room 4'),
  pendingReviewsCount: z.number().default(5),
});

export const facultyClassSchema = z.object({
  id: z.string().or(z.number()).transform(val => String(val)),
  subject: z.string().default('Homoeopathic Subject'),
  batch: z.string().default('1st BHMS'),
  room: z.string().default('Lecture Hall'),
  time: z.string().default('10:00 AM - 11:00 AM'),
  status: z.enum(['Ongoing', 'Upcoming', 'Scheduled', 'Completed']).catch('Scheduled'),
  studentsCount: z.number().default(50),
  topic: z.string().default('Curriculum Topic'),
  departmentCode: z.string().optional(),
});

export const facultyScheduleSchema = z.object({
  id: z.string().or(z.number()).transform(val => String(val)),
  time: z.string(),
  title: z.string(),
  location: z.string(),
  type: z.enum(['Administrative', 'Class Lecture', 'Clinical Duty', 'Academic Review', 'Meeting']).catch('Class Lecture'),
  status: z.enum(['completed', 'in-progress', 'upcoming']).catch('upcoming'),
  date: z.string().optional(),
});

export const facultyActivitySchema = z.object({
  id: z.string().or(z.number()).transform(val => String(val)),
  type: z.enum(['attendance', 'assignment', 'upload', 'research', 'exam', 'general']).catch('general'),
  title: z.string(),
  details: z.string(),
  timestamp: z.string(),
  performer: z.string().optional(),
});

export const facultyNoticeSchema = z.object({
  id: z.string().or(z.number()).transform(val => String(val)),
  title: z.string(),
  category: z.enum(['All', 'Department', 'Academic', 'Hospital', 'Research', 'Administrative']).catch('Academic'),
  date: z.string(),
  pinned: z.boolean().default(false),
  sender: z.string(),
  desc: z.string(),
  attachmentUrl: z.string().optional(),
});

export const facultyResearchSummarySchema = z.object({
  publishedCount: z.number().default(8),
  underReviewCount: z.number().default(2),
  totalGrantsAmount: z.string().default('₹4.5 Lakhs'),
  recentPublications: z.array(
    z.object({
      id: z.string().or(z.number()).transform(val => String(val)),
      title: z.string(),
      journal: z.string(),
      year: z.string(),
      status: z.string(),
    })
  ).default([]),
});

export const facultyAttendanceSummarySchema = z.object({
  avgAttendanceRate: z.number().default(87.4),
  classesConducted: z.string().default('48 / 52'),
  completionRatePercentage: z.number().default(92),
  lowAttendanceStudentsCount: z.number().default(14),
  pendingRegistersCount: z.number().default(1),
  monthlyTargetPercentage: z.number().default(85),
  actionRequiredNotice: z.string().optional(),
});

export const facultyAssignmentSummarySchema = z.object({
  pendingEvaluationCount: z.number().default(18),
  evaluatedThisWeekCount: z.number().default(42),
  totalActiveAssignments: z.number().default(12),
  avgScorePercentage: z.number().default(74.5),
  urgentSubmission: z.object({
    title: z.string(),
    batch: z.string(),
    dueDate: z.string(),
  }).optional(),
});

export const facultyLibrarySummarySchema = z.object({
  requestedBooksCount: z.number().default(5),
  approvedRequisitionsCount: z.number().default(4),
  eNotesUploadedCount: z.number().default(24),
  recentUploads: z.array(
    z.object({
      id: z.string().or(z.number()).transform(val => String(val)),
      title: z.string(),
      category: z.string(),
      uploadedAt: z.string(),
    })
  ).default([]),
});

export const hospitalNotificationSchema = z.object({
  id: z.string().or(z.number()).transform(val => String(val)),
  opdShift: z.string().default('General Medicine OPD Room 4'),
  shiftTime: z.string().default('11:30 AM - 02:30 PM'),
  ipdDuty: z.string().default('Female Ward B (12 Beds)'),
  internsCount: z.number().default(6),
  approvalPendingCount: z.number().default(3),
  statusNotice: z.string().default('Intern Case Record Approval Pending'),
});

export const attendanceTrendItemSchema = z.object({
  period: z.string(),
  batch1stYear: z.number(),
  batch2ndYear: z.number(),
  batch3rdYear: z.number().optional(),
});

export const teachingHoursItemSchema = z.object({
  category: z.string(),
  hours: z.number(),
  color: z.string().optional(),
});

export const assignmentCompletionItemSchema = z.object({
  subject: z.string(),
  evaluated: z.number(),
  pending: z.number(),
});

export const studentPerformanceDistributionSchema = z.object({
  category: z.string(),
  count: z.number(),
});

export const performanceStatisticsSchema = z.object({
  attendanceTrend: z.object({
    weekly: z.array(attendanceTrendItemSchema).default([]),
    monthly: z.array(attendanceTrendItemSchema).default([]),
    term: z.array(attendanceTrendItemSchema).default([]),
  }),
  teachingHoursBreakdown: z.array(teachingHoursItemSchema).default([]),
  assignmentCompletion: z.array(assignmentCompletionItemSchema).default([]),
  studentPerformanceDistribution: z.array(studentPerformanceDistributionSchema).default([]),
  insightMessage: z.string().default('Attendance across 1st BHMS lectures is up by 4.2% this month.'),
  lastSyncedTimestamp: z.string().default('Today 09:30 AM'),
});

export const facultyDashboardSummarySchema = z.object({
  statistics: facultyStatisticsSchema,
  classes: z.array(facultyClassSchema).default([]),
  schedule: z.array(facultyScheduleSchema).default([]),
  activities: z.array(facultyActivitySchema).default([]),
  notices: z.array(facultyNoticeSchema).default([]),
  researchSummary: facultyResearchSummarySchema,
  attendanceSummary: facultyAttendanceSummarySchema,
  assignmentSummary: facultyAssignmentSummarySchema,
  librarySummary: facultyLibrarySummarySchema,
  hospitalNotification: hospitalNotificationSchema,
  performanceStatistics: performanceStatisticsSchema,
});
