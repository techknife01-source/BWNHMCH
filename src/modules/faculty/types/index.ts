export interface FacultyDepartment {
  id: string;
  code: string;
  name: string;
  hodName?: string;
  totalFaculty?: number;
  description?: string;
}

export interface FacultySubject {
  id: string;
  code: string;
  name: string;
  course: string;
  semester: string;
  weeklyLectures: number;
  totalStudentsEnrolled: number;
  syllabusProgress?: number;
}

export interface FacultyStatistics {
  totalClassesTaken: number;
  totalStudentsMentored: number;
  activeAssignments: number;
  researchPapersPublished: number;
  hospitalOpdPatientsHandled: number;
  averageAttendancePercentage: number;
}

export interface FacultyNotification {
  id: string;
  title: string;
  message: string;
  type: 'ACADEMIC' | 'EXAM' | 'MEETING' | 'HOSPITAL' | 'SYSTEM';
  timestamp: string;
  isRead: boolean;
}

export interface FacultyProfile {
  id: string;
  employeeId: string;
  fullName: string;
  designation: string;
  department: FacultyDepartment;
  qualification: string;
  specialization: string;
  joiningDate: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  bio?: string;
  assignedSubjects: FacultySubject[];
  researchWorkCount: number;
  hospitalScheduleSlot?: string;
  opdRoomNo?: string;
}

export interface Faculty {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  designation: string;
  departmentName: string;
  profile?: FacultyProfile;
  statistics?: FacultyStatistics;
}

export interface StudentAttendanceRecord {
  studentId: string;
  rollNo: string;
  studentName: string;
  batch: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';
  remarks?: string;
}

export interface AttendanceSession {
  id: string;
  subjectId: string;
  subjectName: string;
  batch: string;
  date: string;
  slot: string;
  topicCovered: string;
  records: StudentAttendanceRecord[];
  totalPresent: number;
  totalAbsent: number;
  percentage: number;
}

export interface ClassRoutineItem {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';
  timeSlot: string;
  subjectCode: string;
  subjectName: string;
  batch: string;
  roomNo: string;
  type: 'Theory Lecture' | 'Practical Lab' | 'Clinical Posting' | 'Seminar';
}

export interface LessonPlanItem {
  id: string;
  subjectId: string;
  unitNo: number;
  unitTitle: string;
  topic: string;
  plannedHours: number;
  completedHours: number;
  methodology: string;
  status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED';
  completionDate?: string;
}

export interface FacultyAssignment {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  batch: string;
  assignedDate: string;
  dueDate: string;
  maxMarks: number;
  description: string;
  totalSubmissions: number;
  totalEvaluated: number;
  status: 'ACTIVE' | 'CLOSED' | 'DRAFT';
}

export interface StudentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  rollNo: string;
  submissionDate: string;
  fileUrl?: string;
  fileName?: string;
  marksObtained?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'EVALUATED' | 'REVISION_REQUIRED';
}

export interface InternalMarksRecord {
  id: string;
  studentId: string;
  rollNo: string;
  studentName: string;
  batch: string;
  subjectId: string;
  examType: 'First Internal' | 'Second Internal' | 'Mid-Term Viva' | 'Practical Assessment' | 'Pre-National Mock';
  theoryMarks: number;
  practicalMarks: number;
  vivaMarks: number;
  assignmentMarks: number;
  totalMarks: number;
  maxMarks: number;
  grade: string;
  isPassed: boolean;
}

export interface ResearchProject {
  id: string;
  title: string;
  fundingAgency: string;
  grantAmount: number;
  role: 'Principal Investigator' | 'Co-Investigator' | 'Lead Researcher';
  duration: string;
  status: 'Ongoing' | 'Completed' | 'Under Review';
  summary: string;
}

export interface ResearchPublication {
  id: string;
  title: string;
  journalName: string;
  volumeIssue: string;
  impactFactor: number;
  doi: string;
  publishedDate: string;
  indexing: string;
  authors: string[];
}

export interface FacultyAward {
  id: string;
  title: string;
  issuingBody: string;
  year: string;
  category: string;
}

export interface ConferenceParticipation {
  id: string;
  eventName: string;
  role: 'Keynote Speaker' | 'Session Chair' | 'Paper Presenter' | 'Delegate';
  paperTitle?: string;
  location: string;
  date: string;
}

export interface OpdDutySchedule {
  id: string;
  day: string;
  shift: string;
  opdRoom: string;
  department: string;
  avgPatientVolume: number;
  assignedInternsCount: number;
}

export interface LeaveApplication {
  id: string;
  leaveType: 'Casual Leave' | 'Medical Leave' | 'Duty Leave' | 'Earned Leave' | 'Maternity/Paternity Leave';
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  substituteFaculty: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedOn: string;
  approverRemarks?: string;
}

export interface LeaveBalance {
  casualLeave: { total: number; used: number; remaining: number };
  medicalLeave: { total: number; used: number; remaining: number };
  dutyLeave: { total: number; used: number; remaining: number };
  earnedLeave: { total: number; used: number; remaining: number };
}

export interface FacultyDocument {
  id: string;
  title: string;
  category: 'Curriculum & Syllabus' | 'Institutional Forms' | 'Research Formats' | 'Hospital Guidelines';
  fileType: 'PDF' | 'DOCX' | 'XLSX';
  fileSize: string;
  uploadDate: string;
  downloadUrl: string;
}

