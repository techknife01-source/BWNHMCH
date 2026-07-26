import React, { useState, useEffect } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import {
  CheckSquare,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Download,
  AlertCircle,
  Sparkles,
  BarChart3,
  Calendar as CalendarIcon,
  BookOpen,
} from 'lucide-react';
import { facultyErpService } from '../services/facultyErp.service';
import { StudentAttendanceRecord, FacultySubject } from '../types';

export const AttendancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'ENTRY' | 'SUMMARY'>('ENTRY');
  const [subjects, setSubjects] = useState<FacultySubject[]>([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>('SUB-101');
  const [selectedBatch, setSelectedBatch] = useState<string>('1st Year BHMS (Batch A)');
  const [attendanceDate, setAttendanceDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [selectedSlot, setSelectedSlot] = useState<string>('09:00 AM - 10:00 AM');
  const [topicCovered, setTopicCovered] = useState<string>(
    'Organon Aphorisms 9-14: Vital Force in Health & Disease'
  );

  const [students, setStudents] = useState<StudentAttendanceRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  useEffect(() => {
    loadInitialData();
  }, [selectedBatch]);

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const subs = await facultyErpService.getSubjects();
      setSubjects(subs);
      const studentList = await facultyErpService.getAttendanceRoster(selectedBatch);
      setStudents(studentList);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (
    studentId: string,
    status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'
  ) => {
    setStudents((prev) =>
      prev.map((stu) => (stu.studentId === studentId ? { ...stu, status } : stu))
    );
  };

  const handleMarkAll = (status: 'PRESENT' | 'ABSENT') => {
    setStudents((prev) => prev.map((stu) => ({ ...stu, status })));
  };

  const handleSaveAttendance = async () => {
    setIsSaving(true);
    setSaveMessage(null);

    const presentCount = students.filter((s) => s.status === 'PRESENT' || s.status === 'LATE').length;
    const absentCount = students.filter((s) => s.status === 'ABSENT').length;
    const percentage = students.length ? Math.round((presentCount / students.length) * 100) : 0;

    const currentSubject = subjects.find((s) => s.id === selectedSubjectId);

    const res = await facultyErpService.saveAttendanceSession({
      subjectId: selectedSubjectId,
      subjectName: currentSubject?.name || 'Organon of Medicine',
      batch: selectedBatch,
      date: attendanceDate,
      slot: selectedSlot,
      topicCovered,
      records: students,
      totalPresent: presentCount,
      totalAbsent: absentCount,
      percentage,
    });

    setIsSaving(false);
    setSaveMessage(res.message);
    setTimeout(() => setSaveMessage(null), 4000);
  };

  const filteredStudents = students.filter(
    (s) =>
      s.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const presentCount = students.filter((s) => s.status === 'PRESENT').length;
  const lateCount = students.filter((s) => s.status === 'LATE').length;
  const absentCount = students.filter((s) => s.status === 'ABSENT').length;
  const attendanceRate = students.length
    ? Math.round(((presentCount + lateCount) / students.length) * 100)
    : 0;

  return (
    <FacultyLayout pageTitle="Attendance Register">
      <div className="space-y-6">
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              Student Attendance Register
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Subject-wise daily attendance marking, biometric sync status, and percentage analytics.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('ENTRY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'ENTRY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              Attendance Entry
            </button>
            <button
              onClick={() => setActiveTab('SUMMARY')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SUMMARY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Attendance Reports
            </button>
          </div>
        </div>

        {saveMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{saveMessage}</span>
          </div>
        )}

        {activeTab === 'ENTRY' && (
          <>
            {/* Control Panel: Filters & Class Meta */}
            <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-sm space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Subject Selector */}
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Subject
                  </label>
                  <select
                    value={selectedSubjectId}
                    onChange={(e) => setSelectedSubjectId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.code} - {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Batch Selector */}
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    BHMS Batch
                  </label>
                  <select
                    value={selectedBatch}
                    onChange={(e) => setSelectedBatch(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="1st Year BHMS (Batch A)">1st Year BHMS (Batch A)</option>
                    <option value="2nd Year BHMS">2nd Year BHMS</option>
                    <option value="3rd Year BHMS">3rd Year BHMS</option>
                    <option value="4th Year BHMS">4th Year BHMS</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={attendanceDate}
                    onChange={(e) => setAttendanceDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Lecture Slot */}
                <div>
                  <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                    Time Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="09:00 AM - 10:00 AM">09:00 AM - 10:00 AM</option>
                    <option value="10:00 AM - 11:00 AM">10:00 AM - 11:00 AM</option>
                    <option value="11:30 AM - 12:30 PM">11:30 AM - 12:30 PM</option>
                    <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                  </select>
                </div>
              </div>

              {/* Topic Covered Field */}
              <div>
                <label className="block text-3xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                  Topic Covered in Lecture
                </label>
                <input
                  type="text"
                  value={topicCovered}
                  onChange={(e) => setTopicCovered(e.target.value)}
                  placeholder="e.g. Aphorisms 1-10 / Kent Repertory Mind Rubrics"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Attendance Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl">
                <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-wider block">
                  Total Enrolled
                </span>
                <span className="text-xl font-black text-slate-900 dark:text-white mt-0.5 block">
                  {students.length}
                </span>
              </div>
              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/50 rounded-2xl">
                <span className="text-3xs font-extrabold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                  Present
                </span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300 mt-0.5 block">
                  {presentCount}
                </span>
              </div>
              <div className="p-4 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50 rounded-2xl">
                <span className="text-3xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                  Late
                </span>
                <span className="text-xl font-black text-amber-700 dark:text-amber-300 mt-0.5 block">
                  {lateCount}
                </span>
              </div>
              <div className="p-4 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-900/50 rounded-2xl">
                <span className="text-3xs font-extrabold text-rose-600 dark:text-rose-400 uppercase tracking-wider block">
                  Absent ({100 - attendanceRate}%)
                </span>
                <span className="text-xl font-black text-rose-700 dark:text-rose-300 mt-0.5 block">
                  {absentCount}
                </span>
              </div>
            </div>

            {/* Table Action Header */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search student by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMarkAll('PRESENT')}
                  className="px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 rounded-xl text-3xs font-extrabold uppercase tracking-wider hover:bg-emerald-200 transition cursor-pointer"
                >
                  Mark All Present
                </button>
                <button
                  onClick={() => handleMarkAll('ABSENT')}
                  className="px-3 py-1.5 bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 rounded-xl text-3xs font-extrabold uppercase tracking-wider hover:bg-rose-200 transition cursor-pointer"
                >
                  Mark All Absent
                </button>
                <button
                  onClick={handleSaveAttendance}
                  disabled={isSaving}
                  className="px-4 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl text-xs font-bold shadow-md hover:from-emerald-700 hover:to-teal-700 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  )}
                  Save Attendance
                </button>
              </div>
            </div>

            {/* Students Attendance Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-3xs uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200/80 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">#</th>
                      <th className="py-3.5 px-4">Roll No</th>
                      <th className="py-3.5 px-4">Student Name</th>
                      <th className="py-3.5 px-4">Batch</th>
                      <th className="py-3.5 px-4 text-center">Status Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          Loading student list...
                        </td>
                      </tr>
                    ) : filteredStudents.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No students matching search criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredStudents.map((student, idx) => (
                        <tr
                          key={student.studentId}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition"
                        >
                          <td className="py-3.5 px-4 font-mono text-slate-400">{idx + 1}</td>
                          <td className="py-3.5 px-4 font-extrabold text-slate-800 dark:text-slate-200">
                            {student.rollNo}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                            {student.studentName}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 text-3xs font-semibold">
                            {student.batch}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                                className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition flex items-center gap-1 cursor-pointer ${
                                  student.status === 'PRESENT'
                                    ? 'bg-emerald-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600'
                                }`}
                              >
                                <CheckCircle2 className="w-3 h-3" /> Present
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.studentId, 'LATE')}
                                className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition flex items-center gap-1 cursor-pointer ${
                                  student.status === 'LATE'
                                    ? 'bg-amber-500 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-amber-600'
                                }`}
                              >
                                <Clock className="w-3 h-3" /> Late
                              </button>
                              <button
                                onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                                className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold transition flex items-center gap-1 cursor-pointer ${
                                  student.status === 'ABSENT'
                                    ? 'bg-rose-600 text-white shadow-xs'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-600'
                                }`}
                              >
                                <XCircle className="w-3 h-3" /> Absent
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === 'SUMMARY' && (
          <div className="space-y-6">
            <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-emerald-600" />
                    Monthly Attendance Overview & Shortage Alerts
                  </h3>
                  <p className="text-xs text-slate-500">
                    Students with overall attendance below 75% require official notification under WBUHS guidelines.
                  </p>
                </div>
                <button
                  onClick={() => alert('Exporting PDF Report...')}
                  className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export PDF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-rose-900 dark:text-rose-200">
                      2 Students Below 75% Threshold
                    </h4>
                    <p className="text-3xs text-rose-700 dark:text-rose-400 mt-0.5">
                      Rohan Das (68%), Megha Dutta (72%) - Warnings issued.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-emerald-900 dark:text-emerald-200">
                      Average Batch Attendance: 88.4%
                    </h4>
                    <p className="text-3xs text-emerald-700 dark:text-emerald-400 mt-0.5">
                      1st Year BHMS (Batch A) maintains high clinical class compliance.
                    </p>
                  </div>
                </div>

                <div className="p-4 border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl flex items-start gap-3">
                  <BookOpen className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold text-xs text-blue-900 dark:text-blue-200">
                      Total Lectures Delivered: 34 Hours
                    </h4>
                    <p className="text-3xs text-blue-700 dark:text-blue-400 mt-0.5">
                      Academic Year 2026-27 - Semester 1.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};
