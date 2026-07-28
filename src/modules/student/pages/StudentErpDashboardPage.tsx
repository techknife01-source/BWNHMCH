import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/common/Card';
import { Badge } from '../../../components/common/Badge';
import { Button } from '../../../components/common/Button';
import { Input } from '../../../components/common/Input';
import { Select } from '../../../components/common/Select';
import { StatCard } from '../../../components/common/StatCard';
import { Tabs } from '../../../components/common/Tabs';
import { Modal } from '../../../components/common/Modal';
import { LoadingSpinner } from '../../../components/common/LoadingSpinner';

// Icons
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Award,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  CreditCard,
  User,
  Bell,
  Settings,
  Download,
  Upload,
  Plus,
  Search,
  Filter,
  Check,
  Building2,
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  ChevronRight,
  BookMarked,
  Sparkles,
  RefreshCw,
  LogOut,
  Mail,
  Phone,
  MapPin,
  FileCheck,
} from 'lucide-react';

// API & Types
import { studentApi } from '../../../services/api/student.api';
import { attendanceApi } from '../../../services/api/attendance.api';
import { assignmentApi } from '../../../services/api/assignment.api';
import { examApi } from '../../../services/api/exam.api';
import { resultApi } from '../../../services/api/result.api';
import { feesApi } from '../../../services/api/fees.api';
import { downloadApi } from '../../../services/api/download.api';
import { noticeApi } from '../../../services/api/notice.api';
import { studentErpService } from '../services/studentErp.service';

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
  Notice,
} from '../../../types/index';

import {
  LeaveApplication,
  CertificateRequest,
  StudentNotification,
  EnrolledSubject,
  AcademicCalendarEvent,
  StudentSettingsState,
} from '../types/studentErp.types';

// Sub-components
import { StudentAttendanceChart } from '../components/StudentAttendanceChart';
import { StudentResultChart } from '../components/StudentResultChart';
import { SubmitAssignmentModal } from '../components/SubmitAssignmentModal';
import { ApplyLeaveModal } from '../components/ApplyLeaveModal';
import { PayFeeModal } from '../components/PayFeeModal';
import { RequestCertificateModal } from '../components/RequestCertificateModal';

export const StudentErpDashboardPage: React.FC = () => {
  // Navigation active tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // State
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [attendance, setAttendance] = useState<AttendanceSummary | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [timetable, setTimetable] = useState<TimetableEntry[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [exams, setExams] = useState<ExamSchedule[]>([]);
  const [results, setResults] = useState<SemesterResult[]>([]);
  const [feeDetails, setFeeDetails] = useState<FeeDetail[]>([]);
  const [feeTransactions, setFeeTransactions] = useState<FeeTransaction[]>([]);
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [certificates, setCertificates] = useState<CertificateRequest[]>([]);
  const [notifications, setNotifications] = useState<StudentNotification[]>([]);
  const [subjects, setSubjects] = useState<EnrolledSubject[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<AcademicCalendarEvent[]>([]);
  const [settings, setSettings] = useState<StudentSettingsState | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [assignmentStatusFilter, setAssignmentStatusFilter] = useState<string>('ALL');

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState<boolean>(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [isFeeModalOpen, setIsFeeModalOpen] = useState<boolean>(false);
  const [selectedFee, setSelectedFee] = useState<FeeDetail | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState<boolean>(false);

  // Load Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [
        profRes,
        attRes,
        attRecRes,
        ttRes,
        asgRes,
        smRes,
        exRes,
        resRes,
        feeRes,
        txRes,
        dlRes,
        notRes,
        lvRes,
        crtRes,
        notifRes,
        subRes,
        calRes,
        stgRes,
      ] = await Promise.all([
        studentApi.getProfile(),
        attendanceApi.getSummary(),
        attendanceApi.getDailyRecords(),
        studentApi.getTimetable(),
        assignmentApi.getAssignments(),
        studentApi.getStudyMaterials(),
        examApi.getUpcomingExams(),
        resultApi.getResults(),
        feesApi.getFeeDetails(),
        feesApi.getTransactions(),
        downloadApi.getDownloads(),
        noticeApi.getRecentNotices(),
        studentErpService.getLeaveApplications(),
        studentErpService.getCertificateRequests(),
        studentErpService.getNotifications(),
        studentErpService.getEnrolledSubjects(),
        studentErpService.getCalendarEvents(),
        studentErpService.getSettings(),
      ]);

      if (profRes.data) setProfile(profRes.data);
      if (attRes.data) setAttendance(attRes.data);
      if (attRecRes.data) setAttendanceRecords(attRecRes.data);
      if (ttRes.data) setTimetable(ttRes.data);
      if (asgRes.data) setAssignments(asgRes.data);
      if (smRes.data) setStudyMaterials(smRes.data);
      if (exRes.data) setExams(exRes.data);
      if (resRes.data) setResults(resRes.data);
      if (feeRes.data) setFeeDetails(feeRes.data);
      if (txRes.data) setFeeTransactions(txRes.data);
      if (dlRes.data) setDownloads(dlRes.data);
      if (notRes.data) setNotices(notRes.data);
      if (lvRes.data) setLeaves(lvRes.data);
      if (crtRes.data) setCertificates(crtRes.data);
      if (notifRes.data) setNotifications(notifRes.data);
      if (subRes.data) setSubjects(subRes.data);
      if (calRes.data) setCalendarEvents(calRes.data);
      if (stgRes.data) setSettings(stgRes.data);
    } catch (err) {
      console.error('Failed to load student ERP data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleOpenSubmitAssignment = (asg: Assignment) => {
    setSelectedAssignment(asg);
    setIsSubmitModalOpen(true);
  };

  const handleOpenPayFee = (fee: FeeDetail) => {
    setSelectedFee(fee);
    setIsFeeModalOpen(true);
  };

  const handleToggleBookmark = (id: string) => {
    setStudyMaterials((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isBookmarked: !item.isBookmarked } : item))
    );
  };

  const handleMarkNotificationRead = async (id: string) => {
    await studentErpService.markNotificationAsRead(id);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const handleDownloadFile = async (id: string, name: string) => {
    const blob = await downloadApi.downloadFile(id, name);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculations for Fee Summary
  const totalFeeAmount = feeDetails.reduce((sum, f) => sum + f.totalAmount, 0);
  const totalPaidAmount = feeDetails.reduce((sum, f) => sum + f.paidAmount, 0);
  const totalDueAmount = feeDetails.reduce((sum, f) => sum + f.dueAmount, 0);

  // Unread Notifications Count
  const unreadNotifCount = notifications.filter((n) => !n.isRead).length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Loading Student ERP Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Profile Bar */}
      <div className="bg-gradient-to-r from-[#002147] via-[#003366] to-[#00152e] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <GraduationCap className="w-80 h-80 text-white" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile?.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={profile?.fullName}
                className="w-16 h-16 rounded-full object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-black text-white">{profile?.fullName || 'Student'}</h1>
                <Badge variant="primary" className="bg-amber-400/20 text-amber-300 border border-amber-400/30 text-xs">
                  {profile?.currentSemester || 'BHMS Student'}
                </Badge>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Roll No: <span className="text-amber-300 font-mono font-bold">{profile?.rollNumber}</span> • Reg No:{' '}
                <span className="text-slate-200 font-mono">{profile?.registrationNumber}</span>
              </p>
              <p className="text-xs text-slate-400">{profile?.course} ({profile?.session})</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
              <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Attendance</p>
              <p className="text-lg font-black text-emerald-400">{attendance?.overallPercentage}%</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
              <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">CGPA</p>
              <p className="text-lg font-black text-amber-300">{profile?.cgpa}</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
              <p className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold">Fee Due</p>
              <p className="text-lg font-black text-red-300">₹{totalDueAmount.toLocaleString('en-IN')}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
              leftIcon={<Bell className="h-4 w-4" />}
              onClick={() => setActiveTab('notifications')}
            >
              Alerts
              {unreadNotifCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold bg-red-500 text-white rounded-full">
                  {unreadNotifCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 custom-scrollbar border-b border-slate-200 dark:border-slate-800">
        {[
          { id: 'dashboard', label: 'Dashboard', icon: GraduationCap },
          { id: 'profile', label: 'Profile', icon: User },
          { id: 'attendance', label: 'Attendance', icon: CheckCircle2 },
          { id: 'timetable', label: 'Timetable', icon: Calendar },
          { id: 'subjects', label: 'Subjects', icon: BookOpen },
          { id: 'assignments', label: 'Assignments', icon: FileText, badge: assignments.filter((a) => a.status === 'PENDING').length },
          { id: 'study-materials', label: 'Study Materials', icon: BookMarked },
          { id: 'notices', label: 'Notices', icon: Bell },
          { id: 'calendar', label: 'Academic Calendar', icon: Calendar },
          { id: 'exams-results', label: 'Exams & Results', icon: Award },
          { id: 'fees', label: 'Fee Portal', icon: CreditCard },
          { id: 'certificates', label: 'Certificates & Downloads', icon: Download },
          { id: 'leave', label: 'Leave Applications', icon: FileCheck },
          { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadNotifCount },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition whitespace-nowrap ${
                isActive
                  ? 'bg-[#002147] text-white dark:bg-[#00A651] dark:text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && tab.badge > 0 && (
                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-white text-slate-900' : 'bg-red-500 text-white'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 1. DASHBOARD VIEW */}
      {/* ========================================================= */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Top Quick Actions Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 dark:text-slate-200">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Quick Actions Desk:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsLeaveModalOpen(true)}
                leftIcon={<Plus className="h-3.5 w-3.5" />}
              >
                Apply Leave
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsCertModalOpen(true)}
                leftIcon={<FileText className="h-3.5 w-3.5" />}
              >
                Request Certificate
              </Button>

              {feeDetails.some((f) => f.dueAmount > 0) && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenPayFee(feeDetails.find((f) => f.dueAmount > 0)!)}
                  leftIcon={<CreditCard className="h-3.5 w-3.5" />}
                >
                  Pay Pending Fee
                </Button>
              )}
            </div>
          </div>

          {/* Metric Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Overall Attendance"
              value={`${attendance?.overallPercentage}%`}
              change={{ value: '+2.1% this month', isPositive: true }}
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            />

            <StatCard
              title="Cumulative CGPA"
              value={profile?.cgpa.toString() || '8.65'}
              change={{ value: 'Rank #4 in Batch', isPositive: true }}
              icon={<Award className="h-5 w-5 text-amber-500" />}
            />

            <StatCard
              title="Pending Assignments"
              value={assignments.filter((a) => a.status === 'PENDING').length.toString()}
              change={{ value: 'Next due in 3 days', isPositive: false }}
              icon={<FileText className="h-5 w-5 text-blue-600" />}
            />

            <StatCard
              title="Tuition Fee Due"
              value={`₹${totalDueAmount.toLocaleString('en-IN')}`}
              change={{ value: 'Due Aug 31', isPositive: false }}
              icon={<CreditCard className="h-5 w-5 text-red-500" />}
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Chart Widget */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    Subject-wise Attendance Breakdown
                  </h3>
                  <p className="text-xs text-slate-500">WBUHS Minimum Threshold: 75% for exam eligibility</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('attendance')}>
                  Details <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
              {attendance && <StudentAttendanceChart subjectWise={attendance.subjectWise} />}
            </Card>

            {/* Results Trend Chart Widget */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                    <Award className="h-4 w-4 text-amber-500" />
                    Semester Grade Performance Trend
                  </h3>
                  <p className="text-xs text-slate-500">WBUHS BHMS SGPA / CGPA Progression</p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('exams-results')}>
                  Grade Sheet <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
              <StudentResultChart results={results} />
            </Card>
          </div>

          {/* Two Columns: Upcoming Classes & Pending Assignments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Upcoming Timetable Classes */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  Today & Tomorrow Schedule
                </h3>
                <Badge variant="secondary" className="text-[10px]">
                  {timetable.length} Lectures
                </Badge>
              </div>

              <div className="space-y-2.5">
                {timetable.slice(0, 4).map((tt) => (
                  <div
                    key={tt.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{tt.subjectName}</span>
                        <Badge
                          variant={tt.type === 'CLINICAL' ? 'warning' : tt.type === 'PRACTICAL' ? 'info' : 'primary'}
                          className="text-[10px]"
                        >
                          {tt.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500">
                        {tt.facultyName} • <strong className="text-slate-700 dark:text-slate-300">{tt.roomNo}</strong>
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{tt.timeSlot}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{tt.dayOfWeek}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Pending Assignments */}
            <Card className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-600" />
                  Recent & Pending Assignments
                </h3>
                <Button variant="ghost" size="sm" onClick={() => setActiveTab('assignments')}>
                  View All <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>

              <div className="space-y-2.5">
                {assignments.slice(0, 3).map((asg) => (
                  <div
                    key={asg.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-mono font-bold text-slate-500">{asg.subjectCode}</span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">{asg.title}</h4>
                      </div>
                      <Badge
                        variant={
                          asg.status === 'SUBMITTED'
                            ? 'success'
                            : asg.status === 'GRADED'
                            ? 'primary'
                            : asg.status === 'OVERDUE'
                            ? 'danger'
                            : 'warning'
                        }
                        className="text-[10px]"
                      >
                        {asg.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-700">
                      <span>Due Date: <strong className="text-red-500">{asg.dueDate}</strong></span>
                      {asg.status === 'PENDING' ? (
                        <Button variant="outline" size="sm" onClick={() => handleOpenSubmitAssignment(asg)}>
                          Submit Solution
                        </Button>
                      ) : (
                        <span className="text-emerald-600 font-medium">
                          {asg.obtainedMarks ? `Marks: ${asg.obtainedMarks}/${asg.totalMarks}` : 'Submitted'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Recent Notices Row */}
          <Card className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-600" />
                Latest College & WBUHS Notices
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('notices')}>
                All Notices <ChevronRight className="h-3.5 w-3.5 ml-1" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {notices.slice(0, 3).map((nt) => (
                <div
                  key={nt.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={nt.isImportant ? 'danger' : 'secondary'} className="text-[10px]">
                      {nt.category}
                    </Badge>
                    <span className="text-[10px] text-slate-400">{nt.publishedDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2">{nt.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">{nt.content}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. PROFILE & ACADEMIC PROFILE VIEW */}
      {/* ========================================================= */}
      {activeTab === 'profile' && profile && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <Card className="p-6 space-y-6 text-center">
              <div className="relative inline-block">
                <img
                  src={profile.profilePicture || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                  alt={profile.fullName}
                  className="w-28 h-28 rounded-full object-cover border-4 border-[#002147] dark:border-[#00A651] shadow-lg mx-auto"
                />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900 dark:text-white">{profile.fullName}</h2>
                <p className="text-xs font-medium text-slate-500 mt-0.5">{profile.course}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-1">{profile.currentSemester}</p>
              </div>

              <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3 text-left text-xs">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Mail className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Phone className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{profile.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                  <span>{profile.address.street}, {profile.address.city}, {profile.address.state} - {profile.address.pincode}</span>
                </div>
              </div>
            </Card>

            {/* Academic & Guardian Details */}
            <Card className="p-6 lg:col-span-2 space-y-6">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-[#002147] dark:text-[#00A651]" />
                Academic & Registration Details
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">Roll Number</span>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">{profile.rollNumber}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">WBUHS Registration No</span>
                  <p className="font-bold text-slate-900 dark:text-white font-mono">{profile.registrationNumber}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">Academic Department</span>
                  <p className="font-bold text-slate-900 dark:text-white">{profile.department}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">Session</span>
                  <p className="font-bold text-slate-900 dark:text-white">{profile.session}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">Blood Group</span>
                  <p className="font-bold text-red-600 dark:text-red-400">{profile.bloodGroup}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">Date of Birth / Gender</span>
                  <p className="font-bold text-slate-900 dark:text-white">{profile.dateOfBirth} ({profile.gender})</p>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-slate-800 pt-2 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Guardian & Emergency Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">Guardian Name ({profile.guardianRelation})</span>
                  <p className="font-bold text-slate-900 dark:text-white">{profile.guardianName}</p>
                  <p className="text-slate-500">{profile.guardianPhone}</p>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl space-y-1">
                  <span className="text-slate-400">Emergency Contact ({profile.emergencyContact.relation})</span>
                  <p className="font-bold text-slate-900 dark:text-white">{profile.emergencyContact.name}</p>
                  <p className="text-slate-500">{profile.emergencyContact.phone}</p>
                </div>
              </div>

              {/* Student Uploaded Documents */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">Uploaded Academic Documents & Certificates</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {profile.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{doc.title}</p>
                          <p className="text-[10px] text-slate-400">{doc.type} • {doc.uploadedAt}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleDownloadFile(doc.id, `${doc.title}.pdf`)}>
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. ATTENDANCE MODULE */}
      {/* ========================================================= */}
      {activeTab === 'attendance' && attendance && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Overall Attendance Meter */}
            <Card className="p-6 space-y-4 text-center">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Overall Attendance Percentage</h3>
              <div className="relative inline-flex items-center justify-center">
                <div className="w-36 h-36 rounded-full border-8 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                      {attendance.overallPercentage}%
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">WBUHS Eligible</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2">
                <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-lg">
                  <span className="text-slate-400">Total Held</span>
                  <p className="font-bold text-slate-900 dark:text-white">{attendance.totalClassesHeld}</p>
                </div>
                <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg">
                  <span className="text-emerald-600 dark:text-emerald-400">Attended</span>
                  <p className="font-bold text-emerald-700 dark:text-emerald-300">{attendance.totalAttended}</p>
                </div>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300 rounded-lg text-xs">
                ⚠️ As per WBUHS & NCH norms, 75% theoretical and 80% clinical attendance is mandatory to appear for Annual University Examinations.
              </div>

              <Button
                variant="outline"
                className="w-full"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => handleDownloadFile('att-pdf', 'Attendance_Certificate.pdf')}
              >
                Download Attendance Report
              </Button>
            </Card>

            {/* Subject-Wise Breakdown */}
            <Card className="p-6 lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Subject-Wise Attendance Details
              </h3>

              <div className="space-y-3">
                {attendance.subjectWise.map((sub) => (
                  <div
                    key={sub.subjectCode}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{sub.subjectName}</span>
                        <span className="ml-2 font-mono text-slate-400">({sub.subjectCode})</span>
                      </div>
                      <span className={`font-bold ${sub.percentage >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {sub.percentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          sub.percentage >= 85 ? 'bg-emerald-500' : sub.percentage >= 75 ? 'bg-blue-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-slate-500">
                      <span>Faculty: {sub.facultyName}</span>
                      <span>Attended: {sub.attendedClasses} / {sub.totalClasses} Classes</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Daily Attendance Logs */}
          <Card className="p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Attendance Register Logs</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Subject Name</th>
                    <th className="py-2.5 px-3">Timing Slot</th>
                    <th className="py-2.5 px-3">Faculty</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {attendanceRecords.map((rec) => (
                    <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-medium text-slate-800 dark:text-slate-200">{rec.date}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">{rec.subjectName}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{rec.timeSlot}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{rec.facultyName}</td>
                      <td className="py-3 px-3">
                        <Badge variant={rec.status === 'PRESENT' ? 'success' : 'danger'} className="text-[10px]">
                          {rec.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-slate-400 italic">{rec.remarks || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. TIMETABLE VIEW */}
      {/* ========================================================= */}
      {activeTab === 'timetable' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Weekly Lecture & Hospital OPD Duty Schedule
                </h3>
                <p className="text-xs text-slate-500">BHMS 3rd Professional Year Academic Schedule (2026)</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => handleDownloadFile('timetable-pdf', 'BHMS_3rd_Prof_Timetable.pdf')}
              >
                Download Routine PDF
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'].map((day) => {
                const dayClasses = timetable.filter((t) => t.dayOfWeek === day);
                return (
                  <div
                    key={day}
                    className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-black text-xs text-[#002147] dark:text-[#00A651] tracking-wider">{day}</span>
                      <span className="text-[10px] text-slate-400">{dayClasses.length} Sessions</span>
                    </div>

                    {dayClasses.length > 0 ? (
                      <div className="space-y-2.5">
                        {dayClasses.map((item) => (
                          <div
                            key={item.id}
                            className="p-3 bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-slate-900 dark:text-white">{item.subjectName}</span>
                              <Badge
                                variant={
                                  item.type === 'CLINICAL'
                                    ? 'warning'
                                    : item.type === 'PRACTICAL'
                                    ? 'info'
                                    : 'primary'
                                }
                                className="text-[9px]"
                              >
                                {item.type}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-slate-500">
                              {item.facultyName} • <strong className="text-slate-700 dark:text-slate-300">{item.roomNo}</strong>
                            </p>
                            <p className="text-[11px] font-mono font-semibold text-blue-600 dark:text-blue-400">{item.timeSlot}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic py-4 text-center">Self-Study / Library Rotations</p>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. SUBJECTS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((sub) => (
              <Card key={sub.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">{sub.code}</span>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{sub.name}</h3>
                    <p className="text-xs text-slate-500">{sub.department}</p>
                  </div>
                  <Badge variant="primary" className="shrink-0">{sub.credits} Credits</Badge>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300">{sub.description}</p>

                <div className="space-y-1.5 pt-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Syllabus Covered</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{sub.syllabusProgressPercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div className="bg-[#002147] dark:bg-[#00A651] h-full rounded-full" style={{ width: `${sub.syllabusProgressPercentage}%` }} />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 font-medium">Faculty Professors:</span>
                    <p className="font-semibold text-slate-800 dark:text-slate-200">{sub.professors.join(', ')}</p>
                  </div>
                  <div>
                    <span className="text-slate-400 font-medium">Prescribed Textbooks:</span>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400 space-y-0.5 mt-0.5">
                      {sub.prescribedBooks.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 6. ASSIGNMENTS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'assignments' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Assignments & Case Studies</h3>
              <p className="text-xs text-slate-500">Submit homework solutions, organon case studies & lab manuals online</p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={assignmentStatusFilter}
                onChange={(e) => setAssignmentStatusFilter(e.target.value)}
                options={[
                  { label: 'All Statuses', value: 'ALL' },
                  { label: 'Pending Submission', value: 'PENDING' },
                  { label: 'Submitted', value: 'SUBMITTED' },
                  { label: 'Graded', value: 'GRADED' },
                  { label: 'Overdue', value: 'OVERDUE' },
                ]}
              />
            </div>
          </div>

          <div className="space-y-4">
            {assignments
              .filter((a) => assignmentStatusFilter === 'ALL' || a.status === assignmentStatusFilter)
              .map((asg) => (
                <Card key={asg.id} className="p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-500">{asg.subjectCode}</span>
                        <Badge
                          variant={
                            asg.status === 'SUBMITTED'
                              ? 'success'
                              : asg.status === 'GRADED'
                              ? 'primary'
                              : asg.status === 'OVERDUE'
                              ? 'danger'
                              : 'warning'
                          }
                        >
                          {asg.status}
                        </Badge>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1">{asg.title}</h4>
                      <p className="text-xs text-slate-500">
                        {asg.subjectName} • Assigned by <strong className="text-slate-700 dark:text-slate-300">{asg.facultyName}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">Max Marks: <strong className="text-slate-800 dark:text-slate-200">{asg.totalMarks}</strong></p>
                      <p className="text-xs text-red-500 font-semibold mt-0.5">Due: {asg.dueDate}</p>
                    </div>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg">
                    {asg.description}
                  </p>

                  {asg.feedback && (
                    <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 text-xs rounded-lg space-y-1 border border-blue-200 dark:border-blue-900">
                      <p className="font-bold flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Faculty Evaluation Feedback:
                      </p>
                      <p>{asg.feedback}</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400 pt-1">
                        Obtained Marks: {asg.obtainedMarks} / {asg.totalMarks}
                      </p>
                    </div>
                  )}

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                    {asg.status === 'PENDING' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenSubmitAssignment(asg)}
                        leftIcon={<Upload className="h-3.5 w-3.5" />}
                      >
                        Submit Assignment
                      </Button>
                    )}
                    {asg.status === 'SUBMITTED' && (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4" /> Submitted on {asg.submittedAt}
                      </span>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 7. STUDY MATERIALS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'study-materials' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="w-full sm:w-auto">
              <Input
                placeholder="Search notes, materia medica slides, past papers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                options={[
                  { label: 'All Subjects', value: 'ALL' },
                  { label: 'Organon of Medicine', value: 'Organon' },
                  { label: 'Repertory', value: 'Repertory' },
                  { label: 'Materia Medica', value: 'Materia Medica' },
                  { label: 'Pharmacy', value: 'Pharmacy' },
                ]}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {studyMaterials
              .filter(
                (sm) =>
                  (subjectFilter === 'ALL' || sm.department === subjectFilter) &&
                  (sm.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    sm.subjectName.toLowerCase().includes(searchTerm.toLowerCase()))
              )
              .map((sm) => (
                <Card key={sm.id} className="p-5 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary">{sm.type}</Badge>
                    <button
                      onClick={() => handleToggleBookmark(sm.id)}
                      className={`text-xs font-medium flex items-center gap-1 px-2 py-1 rounded-md transition ${
                        sm.isBookmarked
                          ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300'
                          : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <BookMarked className="h-3.5 w-3.5" />
                      {sm.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">{sm.title}</h4>
                  <p className="text-xs text-slate-500">
                    Subject: <strong>{sm.subjectName}</strong> • Faculty: {sm.authorFaculty}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                    <span>Uploaded: {sm.uploadedDate} ({sm.fileSize})</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile(sm.id, `${sm.title}.pdf`)}
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      Download PDF
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. NOTICES VIEW */}
      {/* ========================================================= */}
      {activeTab === 'notices' && (
        <div className="space-y-6">
          <div className="space-y-4">
            {notices.map((nt) => (
              <Card key={nt.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={nt.isImportant ? 'danger' : 'primary'}>{nt.category}</Badge>
                    <span className="text-xs text-slate-400 font-mono">{nt.publishedDate}</span>
                  </div>
                  <span className="text-xs text-slate-500">Issued by: <strong>{nt.author}</strong></span>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">{nt.title}</h3>
                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{nt.content}</p>

                {nt.attachmentUrl && (
                  <div className="pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile(nt.id, 'Notice_Attachment.pdf')}
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      Download Notice Circular PDF
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. ACADEMIC CALENDAR VIEW */}
      {/* ========================================================= */}
      {activeTab === 'calendar' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-600" />
              Academic Calendar & Campus Events (2026)
            </h3>

            <div className="space-y-3">
              {calendarEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          evt.category === 'EXAM'
                            ? 'danger'
                            : evt.category === 'HOLIDAY'
                            ? 'warning'
                            : 'success'
                        }
                      >
                        {evt.category}
                      </Badge>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{evt.title}</h4>
                    </div>
                    <p className="text-xs text-slate-500">{evt.description}</p>
                    {evt.location && <p className="text-[11px] text-slate-400">📍 Location: {evt.location}</p>}
                  </div>

                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-mono font-bold text-slate-800 dark:text-slate-200">
                      {evt.date} {evt.endDate ? `to ${evt.endDate}` : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. EXAMS & RESULTS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'exams-results' && (
        <div className="space-y-6">
          {/* Upcoming Exams Section */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Upcoming University & Internal Examination Schedule
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={ex.type === 'UNIVERSITY' ? 'danger' : 'primary'}>{ex.type}</Badge>
                    <span className="text-xs font-mono font-bold text-red-500">{ex.examDate}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ex.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    Subject: <strong>{ex.subjectName}</strong>
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-700">
                    <span>Timing: {ex.timeSlot}</span>
                    <span>Venue: {ex.roomNo}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Published Semester Marksheets */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-amber-500" />
              WBUHS Official Marksheets & Internal Assessments
            </h3>

            {results.map((res) => (
              <Card key={res.id} className="p-6 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{res.semester}</h4>
                      <Badge variant="success">{res.resultStatus}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">Academic Session: {res.academicYear}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">SGPA / CGPA</p>
                      <p className="text-sm font-black text-amber-600 dark:text-amber-400">{res.sgpa} / {res.cgpa}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile(res.id, `GradeSheet_${res.semester}.pdf`)}
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      Download Marksheet PDF
                    </Button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                        <th className="py-2.5 px-3">Subject Code & Title</th>
                        <th className="py-2.5 px-3">Credits</th>
                        <th className="py-2.5 px-3">Internal Assessment</th>
                        <th className="py-2.5 px-3">University Marks</th>
                        <th className="py-2.5 px-3">Total Score</th>
                        <th className="py-2.5 px-3">Grade</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {res.subjects.map((sub) => (
                        <tr key={sub.code} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                            {sub.name} <span className="text-slate-400 font-mono text-[10px]">({sub.code})</span>
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{sub.credits}</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{sub.internalMarks}</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{sub.universityMarks}</td>
                          <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{sub.totalMarks}</td>
                          <td className="py-3 px-3 font-mono font-bold text-blue-600 dark:text-blue-400">{sub.grade}</td>
                          <td className="py-3 px-3">
                            <Badge variant={sub.status === 'PASS' ? 'success' : 'danger'} className="text-[10px]">
                              {sub.status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 11. FEE PORTAL VIEW */}
      {/* ========================================================= */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Fee Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              title="Total Academic Fees"
              value={`₹${totalFeeAmount.toLocaleString('en-IN')}`}
              icon={<CreditCard className="h-5 w-5 text-slate-600" />}
            />
            <StatCard
              title="Total Fee Paid"
              value={`₹${totalPaidAmount.toLocaleString('en-IN')}`}
              icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            />
            <StatCard
              title="Outstanding Balance Due"
              value={`₹${totalDueAmount.toLocaleString('en-IN')}`}
              icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
            />
          </div>

          {/* Pending Fee Installments */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Current Outstanding Fee Installments</h3>

            <div className="space-y-3">
              {feeDetails.map((fee) => (
                <div
                  key={fee.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{fee.feeType}</h4>
                      <Badge
                        variant={
                          fee.status === 'PAID'
                            ? 'success'
                            : fee.status === 'PARTIAL'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {fee.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">
                      Total: ₹{fee.totalAmount.toLocaleString('en-IN')} • Paid: ₹{fee.paidAmount.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-red-500 font-medium">Due Date: {fee.dueDate}</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      ₹{fee.dueAmount.toLocaleString('en-IN')}
                    </span>
                    {fee.dueAmount > 0 && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleOpenPayFee(fee)}
                        leftIcon={<CreditCard className="h-3.5 w-3.5" />}
                      >
                        Pay Online
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Transaction History Table */}
          <Card className="p-6 space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Payment Receipt Transaction History</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400">
                    <th className="py-2.5 px-3">Receipt No</th>
                    <th className="py-2.5 px-3">Fee Type</th>
                    <th className="py-2.5 px-3">Payment Date</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Mode</th>
                    <th className="py-2.5 px-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {feeTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 dark:text-white">{tx.receiptNo}</td>
                      <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">{tx.feeType}</td>
                      <td className="py-3 px-3 text-slate-600 dark:text-slate-400">{tx.paymentDate}</td>
                      <td className="py-3 px-3 font-bold text-emerald-600 dark:text-emerald-400">₹{tx.amount.toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3"><Badge variant="secondary">{tx.paymentMode}</Badge></td>
                      <td className="py-3 px-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadFile(tx.id, `${tx.receiptNo}_Receipt.pdf`)}
                          leftIcon={<Download className="h-3.5 w-3.5" />}
                        >
                          Receipt PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* 12. CERTIFICATES & DOWNLOADS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'certificates' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Official Certificates & Downloads Portal</h3>
              <p className="text-xs text-slate-500">Request bonafide certificates, hall tickets & official college documents</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCertModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Request New Certificate
            </Button>
          </div>

          {/* Certificate Requests Tracking */}
          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Certificate Application Tracker</h4>

            <div className="space-y-3">
              {certificates.map((crt) => (
                <div
                  key={crt.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{crt.title}</h4>
                      <Badge
                        variant={
                          crt.status === 'READY' || crt.status === 'ISSUED'
                            ? 'success'
                            : crt.status === 'REJECTED'
                            ? 'danger'
                            : 'warning'
                        }
                      >
                        {crt.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500">Purpose: {crt.purpose}</p>
                    <p className="text-[10px] text-slate-400">Requested: {crt.requestedDate} • Ref: {crt.referenceNumber || 'Pending'}</p>
                  </div>

                  {crt.status === 'READY' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile(crt.id, `${crt.certificateType}_Certificate.pdf`)}
                      leftIcon={<Download className="h-3.5 w-3.5" />}
                    >
                      Download Signed Certificate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Official Downloads Table */}
          <Card className="p-6 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Prospectus, Hall Tickets & General Downloads</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {downloads.map((dl) => (
                <div
                  key={dl.id}
                  className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-blue-600 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{dl.title}</h4>
                      <p className="text-[10px] text-slate-400">{dl.category} • {dl.fileSize} • Updated {dl.updatedAt}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownloadFile(dl.id, `${dl.title}.pdf`)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* 13. LEAVE APPLICATION VIEW */}
      {/* ========================================================= */}
      {activeTab === 'leave' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Student Medical & Duty Leave Applications</h3>
              <p className="text-xs text-slate-500">Apply for sanctioned leave to Principal & track approval status</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsLeaveModalOpen(true)}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Apply New Leave
            </Button>
          </div>

          <div className="space-y-4">
            {leaves.map((lv) => (
              <Card key={lv.id} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant={lv.leaveType === 'MEDICAL' ? 'danger' : 'primary'}>{lv.leaveType} LEAVE</Badge>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {lv.startDate} to {lv.endDate} ({lv.totalDays} Days)
                    </span>
                  </div>
                  <Badge
                    variant={
                      lv.status === 'APPROVED' ? 'success' : lv.status === 'REJECTED' ? 'danger' : 'warning'
                    }
                  >
                    {lv.status}
                  </Badge>
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg">
                  <strong>Reason:</strong> {lv.reason}
                </p>

                {lv.reviewRemarks && (
                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs space-y-0.5 border border-emerald-200 dark:border-emerald-900">
                    <p className="font-bold">Sanction Remark by {lv.reviewedBy}:</p>
                    <p>{lv.reviewRemarks}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 14. NOTIFICATIONS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Bell className="h-5 w-5 text-amber-500" />
                Student Notification Center
              </h3>
              <Button variant="ghost" size="sm" onClick={() => studentErpService.markAllNotificationsAsRead()}>
                Mark All Read
              </Button>
            </div>

            <div className="space-y-3">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkNotificationRead(n.id)}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-start gap-3 ${
                    !n.isRead
                      ? 'bg-blue-50/70 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm shrink-0">
                    <Bell className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{n.title}</h4>
                      <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* 15. SETTINGS VIEW */}
      {/* ========================================================= */}
      {activeTab === 'settings' && settings && (
        <div className="space-y-6">
          <Card className="p-6 space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-600" />
              Student Portal Notification & Security Preferences
            </h3>

            <div className="space-y-4 text-xs">
              {[
                { key: 'emailNotifications', label: 'Email Notifications for Exam Schedules & Fee Receipts' },
                { key: 'smsAlerts', label: 'SMS Emergency Alerts for Leave Sanction & Hospital Duty' },
                { key: 'assignmentReminders', label: 'Assignment Due Date Reminders (24 Hrs Before)' },
                { key: 'feeDueAlerts', label: 'Tuition Fee Installment Due Reminders' },
                { key: 'attendanceAlerts', label: 'Low Attendance Warning Alerts (<80%)' },
              ].map((item) => (
                <label key={item.key} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl cursor-pointer">
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.label}</span>
                  <input
                    type="checkbox"
                    checked={(settings as any)[item.key]}
                    onChange={(e) => {
                      const updated = { ...settings, [item.key]: e.target.checked };
                      setSettings(updated);
                      studentErpService.updateSettings(updated);
                    }}
                    className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODALS */}
      {/* ========================================================= */}
      <SubmitAssignmentModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        assignment={selectedAssignment}
        onSuccess={loadData}
      />

      <ApplyLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={loadData}
      />

      <PayFeeModal
        isOpen={isFeeModalOpen}
        onClose={() => setIsFeeModalOpen(false)}
        fee={selectedFee}
        onSuccess={loadData}
      />

      <RequestCertificateModal
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
