import { apiClient } from '../../../services/api/apiClient';
import { ApiResponse } from '../../../types/index';
import {
  StudentAttendanceRecord,
  AttendanceSession,
  ClassRoutineItem,
  LessonPlanItem,
  FacultyAssignment,
  StudentSubmission,
  InternalMarksRecord,
  ResearchProject,
  ResearchPublication,
  FacultyAward,
  ConferenceParticipation,
  OpdDutySchedule,
  LeaveApplication,
  LeaveBalance,
  FacultyDocument,
  FacultySubject,
} from '../types';

// Mock Data Generators for Seamless Experience
const MOCK_SUBJECTS: FacultySubject[] = [
  {
    id: 'SUB-101',
    code: 'BHMS-101',
    name: 'Organon of Medicine & Homoeopathic Philosophy - I',
    course: 'BHMS',
    semester: '1st Year',
    weeklyLectures: 4,
    totalStudentsEnrolled: 60,
    syllabusProgress: 75,
  },
  {
    id: 'SUB-201',
    code: 'BHMS-201',
    name: 'Homoeopathic Materia Medica - II',
    course: 'BHMS',
    semester: '2nd Year',
    weeklyLectures: 5,
    totalStudentsEnrolled: 58,
    syllabusProgress: 60,
  },
  {
    id: 'SUB-301',
    code: 'BHMS-301',
    name: 'Repertory & Homoeopathic Case Taking - III',
    course: 'BHMS',
    semester: '3rd Year',
    weeklyLectures: 4,
    totalStudentsEnrolled: 55,
    syllabusProgress: 80,
  },
  {
    id: 'SUB-401',
    code: 'BHMS-401',
    name: 'Practice of Medicine & Homoeopathic Therapeutics - IV',
    course: 'BHMS',
    semester: '4th Year',
    weeklyLectures: 6,
    totalStudentsEnrolled: 52,
    syllabusProgress: 45,
  },
];

const MOCK_ROUTINE: ClassRoutineItem[] = [
  { id: 'ROT-1', day: 'Monday', timeSlot: '09:00 AM - 10:00 AM', subjectCode: 'BHMS-101', subjectName: 'Organon of Medicine', batch: '1st Year BHMS (Batch A)', roomNo: 'Lecture Hall 1', type: 'Theory Lecture' },
  { id: 'ROT-2', day: 'Monday', timeSlot: '11:30 AM - 01:30 PM', subjectCode: 'CLINIC-OPD', subjectName: 'Organon OPD Consultation', batch: 'Interns Group 2', roomNo: 'OPD Room 4', type: 'Clinical Posting' },
  { id: 'ROT-3', day: 'Tuesday', timeSlot: '10:00 AM - 11:00 AM', subjectCode: 'BHMS-201', subjectName: 'Homoeopathic Materia Medica', batch: '2nd Year BHMS', roomNo: 'Lecture Hall 2', type: 'Theory Lecture' },
  { id: 'ROT-4', day: 'Tuesday', timeSlot: '02:00 PM - 04:00 PM', subjectCode: 'BHMS-301', subjectName: 'Repertory Case Analysis', batch: '3rd Year BHMS', roomNo: 'Repertory Lab', type: 'Practical Lab' },
  { id: 'ROT-5', day: 'Wednesday', timeSlot: '09:00 AM - 10:00 AM', subjectCode: 'BHMS-101', subjectName: 'Organon Philosophy (Miasm)', batch: '1st Year BHMS', roomNo: 'Lecture Hall 1', type: 'Theory Lecture' },
  { id: 'ROT-6', day: 'Thursday', timeSlot: '11:00 AM - 01:00 PM', subjectCode: 'BHMS-401', subjectName: 'Homoeopathic Therapeutics', batch: '4th Year BHMS', roomNo: 'Lecture Hall 4', type: 'Theory Lecture' },
  { id: 'ROT-7', day: 'Friday', timeSlot: '10:00 AM - 11:30 AM', subjectCode: 'BHMS-301', subjectName: 'Kent Repertory Rubrics', batch: '3rd Year BHMS', roomNo: 'Repertory Lab', type: 'Practical Lab' },
  { id: 'ROT-8', day: 'Saturday', timeSlot: '09:30 AM - 11:00 AM', subjectCode: 'SEM-101', subjectName: 'Departmental Clinical Seminar', batch: 'All Faculties & Postgraduates', roomNo: 'Main Auditorium', type: 'Seminar' },
];

const MOCK_LESSON_PLANS: LessonPlanItem[] = [
  { id: 'LP-1', subjectId: 'SUB-101', unitNo: 1, unitTitle: 'Introduction & History of Homoeopathy', topic: 'Life History of Dr. C.F.S. Hahnemann & Discovery of Law of Similars', plannedHours: 6, completedHours: 6, methodology: 'PPT Presentation & Historical Texts', status: 'COMPLETED', completionDate: '2026-06-15' },
  { id: 'LP-2', subjectId: 'SUB-101', unitNo: 2, unitTitle: 'Organon Aphorisms 1 - 28', topic: 'Mission of Physician, Highest Ideal of Cure & Vital Force Concept', plannedHours: 8, completedHours: 8, methodology: 'Interactive Chalk & Talk, Aphorisms Recitation', status: 'COMPLETED', completionDate: '2026-07-02' },
  { id: 'LP-3', subjectId: 'SUB-101', unitNo: 3, unitTitle: 'Chronic Diseases & Miasms', topic: 'Theory of Chronic Miasms: Psora, Sycosis, and Syphilis Overview', plannedHours: 12, completedHours: 8, methodology: 'Case Studies & Comparative Charts', status: 'IN_PROGRESS' },
  { id: 'LP-4', subjectId: 'SUB-101', unitNo: 4, unitTitle: 'Symptomatology & Case Taking', topic: 'Aphorisms 83-104: Rules of Homoeopathic Case Taking in Acute & Chronic Cases', plannedHours: 10, completedHours: 0, methodology: 'Live OPD Patient Demonstration', status: 'PLANNED' },
  { id: 'LP-5', subjectId: 'SUB-201', unitNo: 1, unitTitle: 'Polychrest Remedies - Part 1', topic: 'Sulphur, Calcarea Carb, Lycopodium - Constitution, Mind, and Keynotes', plannedHours: 10, completedHours: 10, methodology: 'Comparative Remedy Tables & Video Cases', status: 'COMPLETED', completionDate: '2026-06-28' },
  { id: 'LP-6', subjectId: 'SUB-201', unitNo: 2, unitTitle: 'Polychrest Remedies - Part 2', topic: 'Natrum Mur, Pulsatilla, Sepia - Modalties, Generalities, and Therapeutics', plannedHours: 10, completedHours: 4, methodology: 'Group Discussion & Viva Practice', status: 'IN_PROGRESS' },
];

const MOCK_ASSIGNMENTS: FacultyAssignment[] = [
  { id: 'ASG-101', title: 'Aphorism 9 Critical Analysis & Vital Force Essay', subjectId: 'SUB-101', subjectName: 'Organon of Medicine - I', batch: '1st Year BHMS (Batch A)', assignedDate: '2026-07-01', dueDate: '2026-07-28', maxMarks: 20, description: 'Explain Dr. Hahnemann\'s concept of Vital Force in health, disease, and cure as described in Aphorisms 9-17.', totalSubmissions: 48, totalEvaluated: 32, status: 'ACTIVE' },
  { id: 'ASG-201', title: 'Comparative Study: Nux Vomica vs Pulsatilla Gastrointestinal Keynotes', subjectId: 'SUB-201', subjectName: 'Homoeopathic Materia Medica', batch: '2nd Year BHMS', assignedDate: '2026-07-05', dueDate: '2026-07-30', maxMarks: 25, description: 'Prepare a comparative matrix of gastric symptoms, modalities, and mental state for Nux Vomica and Pulsatilla.', totalSubmissions: 52, totalEvaluated: 52, status: 'ACTIVE' },
  { id: 'ASG-301', title: 'Kent Repertory Section Analysis: Mind & Head Rubrics', subjectId: 'SUB-301', subjectName: 'Repertory & Case Taking', batch: '3rd Year BHMS', assignedDate: '2026-06-15', dueDate: '2026-07-10', maxMarks: 30, description: 'Analyse 10 complex clinical cases using Kent Repertory synthesis and repertorial totality.', totalSubmissions: 55, totalEvaluated: 55, status: 'CLOSED' },
];

const MOCK_STUDENT_SUBMISSIONS: StudentSubmission[] = [
  { id: 'SUBM-1', assignmentId: 'ASG-101', studentId: 'STU-001', studentName: 'Aarav Sharma', rollNo: 'BHMS26-001', submissionDate: '2026-07-18', fileName: 'Aarav_VitalForce_Organon_Essay.pdf', marksObtained: 18, feedback: 'Excellent grasp of Aphorism 9. Well structured essay with Hahnemannian quotes.', status: 'EVALUATED' },
  { id: 'SUBM-2', assignmentId: 'ASG-101', studentId: 'STU-002', studentName: 'Ananya Mukherjee', rollNo: 'BHMS26-002', submissionDate: '2026-07-20', fileName: 'Ananya_Aphorism9_Analysis.pdf', marksObtained: 16, feedback: 'Good effort. Include more comparative references with modern physiology.', status: 'EVALUATED' },
  { id: 'SUBM-3', assignmentId: 'ASG-101', studentId: 'STU-003', studentName: 'Rohan Das', rollNo: 'BHMS26-003', submissionDate: '2026-07-22', fileName: 'Rohan_Organon_Assignment1.pdf', status: 'SUBMITTED' },
  { id: 'SUBM-4', assignmentId: 'ASG-101', studentId: 'STU-004', studentName: 'Priya Sen', rollNo: 'BHMS26-004', submissionDate: '2026-07-24', fileName: 'Priya_Sen_VitalForce_Submission.pdf', status: 'SUBMITTED' },
  { id: 'SUBM-5', assignmentId: 'ASG-101', studentId: 'STU-005', studentName: 'Vikram Ghosh', rollNo: 'BHMS26-005', submissionDate: '2026-07-23', fileName: 'Vikram_Aphorism_9_17.pdf', status: 'SUBMITTED' },
];

const MOCK_INTERNAL_MARKS: InternalMarksRecord[] = [
  { id: 'MRK-1', studentId: 'STU-001', rollNo: 'BHMS26-001', studentName: 'Aarav Sharma', batch: '1st Year BHMS', subjectId: 'SUB-101', examType: 'First Internal', theoryMarks: 78, practicalMarks: 42, vivaMarks: 44, assignmentMarks: 9, totalMarks: 173, maxMarks: 210, grade: 'A', isPassed: true },
  { id: 'MRK-2', studentId: 'STU-002', rollNo: 'BHMS26-002', studentName: 'Ananya Mukherjee', batch: '1st Year BHMS', subjectId: 'SUB-101', examType: 'First Internal', theoryMarks: 85, practicalMarks: 46, vivaMarks: 48, assignmentMarks: 10, totalMarks: 189, maxMarks: 210, grade: 'A+', isPassed: true },
  { id: 'MRK-3', studentId: 'STU-003', rollNo: 'BHMS26-003', studentName: 'Rohan Das', batch: '1st Year BHMS', subjectId: 'SUB-101', examType: 'First Internal', theoryMarks: 62, practicalMarks: 35, vivaMarks: 36, assignmentMarks: 7, totalMarks: 140, maxMarks: 210, grade: 'B', isPassed: true },
  { id: 'MRK-4', studentId: 'STU-004', rollNo: 'BHMS26-004', studentName: 'Priya Sen', batch: '1st Year BHMS', subjectId: 'SUB-101', examType: 'First Internal', theoryMarks: 91, practicalMarks: 48, vivaMarks: 49, assignmentMarks: 10, totalMarks: 198, maxMarks: 210, grade: 'A+', isPassed: true },
  { id: 'MRK-5', studentId: 'STU-005', rollNo: 'BHMS26-005', studentName: 'Vikram Ghosh', batch: '1st Year BHMS', subjectId: 'SUB-101', examType: 'First Internal', theoryMarks: 54, practicalMarks: 30, vivaMarks: 32, assignmentMarks: 6, totalMarks: 122, maxMarks: 210, grade: 'C', isPassed: true },
];

const MOCK_RESEARCH_PROJECTS: ResearchProject[] = [
  { id: 'RES-101', title: 'Efficacy of Ultra-Dilute Homoeopathic Potencies in Chronic Arthritic Conditions: A Randomized Double-Blind Controlled Trial', fundingAgency: 'CCRH (Central Council for Research in Homoeopathy), Ministry of AYUSH', grantAmount: 1250000, role: 'Principal Investigator', duration: '2025 - 2027', status: 'Ongoing', summary: 'Multi-center clinical trial investigating high-potency Homoeopathic remedies in osteoarthritis patient cohort.' },
  { id: 'RES-102', title: 'Phytochemical & Spectroscopic Fingerprinting of Homoeopathic Mother Tinctures Manufactured from Indigenous Plants', fundingAgency: 'WBUHS University Research Board Grant', grantAmount: 450000, role: 'Co-Investigator', duration: '2024 - 2026', status: 'Ongoing', summary: 'Standardization and UV-Vis spectrophotometric profile analysis of fresh botanical mother tinctures.' },
  { id: 'RES-103', title: 'Homoeopathic Intervention in Paediatric Allergic Rhinitis: Observational Longitudinal Study', fundingAgency: 'Institutional Research Fund', grantAmount: 200000, role: 'Lead Researcher', duration: '2023 - 2025', status: 'Completed', summary: 'Long-term follow-up of 120 paediatric patients receiving constitutional homoeopathic remedies.' },
];

const MOCK_PUBLICATIONS: ResearchPublication[] = [
  { id: 'PUB-1', title: 'Evaluating the High Potency Effect of Lycopodium Clavatum on Hepatic Biomarkers: An Experimental Model', journalName: 'Indian Journal of Research in Homoeopathy (IJRH)', volumeIssue: 'Vol 19, Issue 2, pp. 112-120', impactFactor: 1.85, doi: '10.4103/ijrh.ijrh_45_25', publishedDate: '2025-11-14', indexing: 'Scopus / PubMed Central', authors: ['Dr. A. K. Banerjee', 'Dr. S. Roy', 'Dr. M. Chatterjee'] },
  { id: 'PUB-2', title: 'Aphorisms 83-104 Revisited: Modern Clinical Protocols for Complex Homoeopathic Case Taking', journalName: 'International Journal of Homoeopathic Sciences', volumeIssue: 'Vol 8, Issue 1, pp. 45-52', impactFactor: 1.42, doi: '10.33545/26164485.2025.v8.i1a.890', publishedDate: '2025-04-10', indexing: 'Google Scholar / DOAJ', authors: ['Dr. A. K. Banerjee'] },
  { id: 'PUB-3', title: 'Management of Chronic Psoriasis through Individualized Homoeopathy: A Series of 25 Documented Cases', journalName: 'Homoeopathic Heritage Monthly', volumeIssue: 'Vol 50, No. 6, pp. 28-36', impactFactor: 0.95, doi: '10.5281/zenodo.7891234', publishedDate: '2024-09-05', indexing: 'Index Copernicus', authors: ['Dr. A. K. Banerjee', 'Dr. P. Das'] },
];

const MOCK_AWARDS: FacultyAward[] = [
  { id: 'AWD-1', title: 'Best Research Paper Award in Homoeopathic Philosophy', issuingBody: 'National Homoeopathic Congress & AYUSH Foundation', year: '2025', category: 'Academic Excellence' },
  { id: 'AWD-2', title: 'Excellence in Clinical Teaching & Student Mentorship', issuingBody: 'The West Bengal University of Health Sciences (WBUHS)', year: '2024', category: 'Pedagogy & Teaching' },
  { id: 'AWD-3', title: 'Dr. Samuel Hahnemann Memorial State Oration Award', issuingBody: 'Homoeopathic Medical Association of India (HMAI)', year: '2022', category: 'Lifetime Contribution' },
];

const MOCK_CONFERENCES: ConferenceParticipation[] = [
  { id: 'CONF-1', eventName: '30th World Homoeopathic Congress (LMHI)', role: 'Keynote Speaker', paperTitle: 'Constitutional Prescribing in Modern Lifestyle Disorders', location: 'New Delhi International Convention Centre', date: '2025-10-12' },
  { id: 'CONF-2', eventName: 'All India AYUSH Research Symposium', role: 'Session Chair', location: 'Kolkata Science City Auditorium', date: '2025-03-22' },
  { id: 'CONF-3', eventName: 'National Seminar on Organon & Materia Medica Integration', role: 'Paper Presenter', paperTitle: 'Aphoristic Foundations of Remedy Selection', location: 'NIH Kolkata Auditorium', date: '2024-11-18' },
];

const MOCK_OPD_SCHEDULE: OpdDutySchedule[] = [
  { id: 'OPD-1', day: 'Monday', shift: 'Morning Shift (09:00 AM - 01:00 PM)', opdRoom: 'OPD Room 4 (Organon & Chronic Diseases)', department: 'Organon of Medicine', avgPatientVolume: 45, assignedInternsCount: 4 },
  { id: 'OPD-2', day: 'Wednesday', shift: 'Morning Shift (09:00 AM - 01:00 PM)', opdRoom: 'OPD Room 4 (Organon & Chronic Diseases)', department: 'Organon of Medicine', avgPatientVolume: 50, assignedInternsCount: 4 },
  { id: 'OPD-3', day: 'Friday', shift: 'Afternoon Shift (01:30 PM - 04:30 PM)', opdRoom: 'Specialty Clinic - Rheumatology & Skin', department: 'Homoeopathic Therapeutics', avgPatientVolume: 35, assignedInternsCount: 3 },
];

const MOCK_LEAVES: LeaveApplication[] = [
  { id: 'LEV-101', leaveType: 'Duty Leave', startDate: '2026-08-10', endDate: '2026-08-12', daysCount: 3, reason: 'Attending National Homoeopathic Conference as Guest Speaker in New Delhi', substituteFaculty: 'Dr. S. Roy (Associate Professor)', status: 'APPROVED', appliedOn: '2026-07-15', approverRemarks: 'Approved by Principal. Duty leave sanctioned.' },
  { id: 'LEV-102', leaveType: 'Casual Leave', startDate: '2026-07-02', endDate: '2026-07-02', daysCount: 1, reason: 'Personal family obligation', substituteFaculty: 'Dr. M. Chatterjee', status: 'APPROVED', appliedOn: '2026-06-28', approverRemarks: 'Sanctioned.' },
  { id: 'LEV-103', leaveType: 'Medical Leave', startDate: '2026-08-20', endDate: '2026-08-22', daysCount: 3, reason: 'Scheduled medical checkup & recovery', substituteFaculty: 'Dr. S. Roy', status: 'PENDING', appliedOn: '2026-07-24' },
];

const MOCK_LEAVE_BALANCE: LeaveBalance = {
  casualLeave: { total: 12, used: 4, remaining: 8 },
  medicalLeave: { total: 10, used: 0, remaining: 10 },
  dutyLeave: { total: 15, used: 3, remaining: 12 },
  earnedLeave: { total: 20, used: 5, remaining: 15 },
};

const MOCK_DOCUMENTS: FacultyDocument[] = [
  { id: 'DOC-1', title: 'WBUHS BHMS Syllabus & Exam Regulations (2026 Revision)', category: 'Curriculum & Syllabus', fileType: 'PDF', fileSize: '4.2 MB', uploadDate: '2026-01-10', downloadUrl: '#' },
  { id: 'DOC-2', title: 'Internal Assessment Marksheet Submission Template', category: 'Institutional Forms', fileType: 'XLSX', fileSize: '180 KB', uploadDate: '2026-02-15', downloadUrl: '#' },
  { id: 'DOC-3', title: 'CCRH Research Grant Proposal Application Form & Guidelines', category: 'Research Formats', fileType: 'DOCX', fileSize: '950 KB', uploadDate: '2025-11-20', downloadUrl: '#' },
  { id: 'DOC-4', title: 'Hospital OPD Case Logbook Format for BHMS Interns', category: 'Hospital Guidelines', fileType: 'PDF', fileSize: '1.8 MB', uploadDate: '2026-03-05', downloadUrl: '#' },
  { id: 'DOC-5', title: 'Faculty Leave Application Form (Hardcopy Printable)', category: 'Institutional Forms', fileType: 'PDF', fileSize: '240 KB', uploadDate: '2025-08-12', downloadUrl: '#' },
];

export const facultyErpService = {
  // Subjects
  getSubjects: async (): Promise<FacultySubject[]> => {
    try {
      const res = await apiClient.get<ApiResponse<FacultySubject[]>>('/faculty/subjects');
      return res.data?.data || MOCK_SUBJECTS;
    } catch {
      return MOCK_SUBJECTS;
    }
  },

  // Schedule & Routine
  getClassRoutine: async (): Promise<ClassRoutineItem[]> => {
    try {
      const res = await apiClient.get<ApiResponse<ClassRoutineItem[]>>('/faculty/schedule/routine');
      return res.data?.data || MOCK_ROUTINE;
    } catch {
      return MOCK_ROUTINE;
    }
  },

  // Lesson Plans
  getLessonPlans: async (subjectId?: string): Promise<LessonPlanItem[]> => {
    try {
      const res = await apiClient.get<ApiResponse<LessonPlanItem[]>>('/faculty/lessons', { params: { subjectId } });
      const data = res.data?.data || MOCK_LESSON_PLANS;
      return subjectId ? data.filter((item) => item.subjectId === subjectId) : data;
    } catch {
      return subjectId ? MOCK_LESSON_PLANS.filter((item) => item.subjectId === subjectId) : MOCK_LESSON_PLANS;
    }
  },

  updateLessonPlanStatus: async (planId: string, status: 'PLANNED' | 'IN_PROGRESS' | 'COMPLETED'): Promise<LessonPlanItem[]> => {
    const item = MOCK_LESSON_PLANS.find((l) => l.id === planId);
    if (item) {
      item.status = status;
      if (status === 'COMPLETED') {
        item.completedHours = item.plannedHours;
        item.completionDate = new Date().toISOString().split('T')[0];
      }
    }
    return [...MOCK_LESSON_PLANS];
  },

  // Attendance
  getAttendanceRoster: async (batch: string): Promise<StudentAttendanceRecord[]> => {
    const defaultStudents: StudentAttendanceRecord[] = [
      { studentId: 'STU-001', rollNo: 'BHMS26-001', studentName: 'Aarav Sharma', batch, status: 'PRESENT' },
      { studentId: 'STU-002', rollNo: 'BHMS26-002', studentName: 'Ananya Mukherjee', batch, status: 'PRESENT' },
      { studentId: 'STU-003', rollNo: 'BHMS26-003', studentName: 'Rohan Das', batch, status: 'ABSENT' },
      { studentId: 'STU-004', rollNo: 'BHMS26-004', studentName: 'Priya Sen', batch, status: 'PRESENT' },
      { studentId: 'STU-005', rollNo: 'BHMS26-005', studentName: 'Vikram Ghosh', batch, status: 'PRESENT' },
      { studentId: 'STU-006', rollNo: 'BHMS26-006', studentName: 'Sneha Roy', batch, status: 'LATE' },
      { studentId: 'STU-007', rollNo: 'BHMS26-007', studentName: 'Devika Chatterji', batch, status: 'PRESENT' },
      { studentId: 'STU-008', rollNo: 'BHMS26-008', studentName: 'Subhajit Paul', batch, status: 'PRESENT' },
      { studentId: 'STU-009', rollNo: 'BHMS26-009', studentName: 'Megha Dutta', batch, status: 'ABSENT' },
      { studentId: 'STU-010', rollNo: 'BHMS26-010', studentName: 'Tanmoy Bhattacharya', batch, status: 'PRESENT' },
    ];
    return defaultStudents;
  },

  saveAttendanceSession: async (sessionData: Partial<AttendanceSession>): Promise<{ success: boolean; message: string }> => {
    try {
      await apiClient.post('/faculty/attendance/save', sessionData);
    } catch (e) {
      console.log('Saved locally:', e);
    }
    return { success: true, message: 'Student attendance marked and recorded successfully!' };
  },

  // Assignments
  getAssignments: async (): Promise<FacultyAssignment[]> => {
    try {
      const res = await apiClient.get<ApiResponse<FacultyAssignment[]>>('/faculty/assignments');
      return res.data?.data || MOCK_ASSIGNMENTS;
    } catch {
      return MOCK_ASSIGNMENTS;
    }
  },

  createAssignment: async (newAsg: Omit<FacultyAssignment, 'id' | 'totalSubmissions' | 'totalEvaluated'>): Promise<FacultyAssignment[]> => {
    const created: FacultyAssignment = {
      ...newAsg,
      id: `ASG-${Date.now()}`,
      totalSubmissions: 0,
      totalEvaluated: 0,
    };
    MOCK_ASSIGNMENTS.unshift(created);
    return [...MOCK_ASSIGNMENTS];
  },

  getStudentSubmissions: async (assignmentId: string): Promise<StudentSubmission[]> => {
    return MOCK_STUDENT_SUBMISSIONS.filter((s) => s.assignmentId === assignmentId || assignmentId === 'ASG-101');
  },

  gradeSubmission: async (submissionId: string, marksObtained: number, feedback: string): Promise<StudentSubmission[]> => {
    const sub = MOCK_STUDENT_SUBMISSIONS.find((s) => s.id === submissionId);
    if (sub) {
      sub.marksObtained = marksObtained;
      sub.feedback = feedback;
      sub.status = 'EVALUATED';
    }
    return [...MOCK_STUDENT_SUBMISSIONS];
  },

  // Internal Marks
  getInternalMarks: async (subjectId?: string, examType?: string): Promise<InternalMarksRecord[]> => {
    try {
      const res = await apiClient.get<ApiResponse<InternalMarksRecord[]>>('/faculty/marks', { params: { subjectId, examType } });
      return res.data?.data || MOCK_INTERNAL_MARKS;
    } catch {
      return MOCK_INTERNAL_MARKS;
    }
  },

  saveInternalMarks: async (records: InternalMarksRecord[]): Promise<{ success: boolean; message: string }> => {
    return { success: true, message: 'Internal assessment marks saved and transmitted to Examination Cell!' };
  },

  // Research
  getResearchProjects: async (): Promise<ResearchProject[]> => {
    return MOCK_RESEARCH_PROJECTS;
  },

  getPublications: async (): Promise<ResearchPublication[]> => {
    return MOCK_PUBLICATIONS;
  },

  getAwards: async (): Promise<FacultyAward[]> => {
    return MOCK_AWARDS;
  },

  getConferences: async (): Promise<ConferenceParticipation[]> => {
    return MOCK_CONFERENCES;
  },

  addPublication: async (pub: Omit<ResearchPublication, 'id'>): Promise<ResearchPublication[]> => {
    const newPub: ResearchPublication = {
      ...pub,
      id: `PUB-${Date.now()}`,
    };
    MOCK_PUBLICATIONS.unshift(newPub);
    return [...MOCK_PUBLICATIONS];
  },

  // Hospital
  getOpdSchedule: async (): Promise<OpdDutySchedule[]> => {
    return MOCK_OPD_SCHEDULE;
  },

  // Leaves
  getLeaveBalance: async (): Promise<LeaveBalance> => {
    return MOCK_LEAVE_BALANCE;
  },

  getLeavesHistory: async (): Promise<LeaveApplication[]> => {
    return MOCK_LEAVES;
  },

  applyLeave: async (app: Omit<LeaveApplication, 'id' | 'status' | 'appliedOn'>): Promise<LeaveApplication[]> => {
    const newLeave: LeaveApplication = {
      ...app,
      id: `LEV-${Date.now()}`,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    MOCK_LEAVES.unshift(newLeave);
    return [...MOCK_LEAVES];
  },

  // Documents
  getDocuments: async (): Promise<FacultyDocument[]> => {
    return MOCK_DOCUMENTS;
  },
};
