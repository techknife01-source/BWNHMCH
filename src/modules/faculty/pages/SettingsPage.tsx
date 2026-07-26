import React, { useState, useEffect } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import {
  Settings,
  Calendar as CalendarIcon,
  Bell,
  FileText,
  Clock,
  Plus,
  CheckCircle2,
  AlertCircle,
  Download,
  Lock,
  User,
  Sparkles,
  Shield,
  Layers,
} from 'lucide-react';
import { facultyErpService } from '../services/facultyErp.service';
import {
  LeaveApplication,
  LeaveBalance,
  FacultyNotification,
  FacultyDocument,
} from '../types';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'LEAVE' | 'NOTIFICATIONS' | 'CALENDAR' | 'DOCUMENTS' | 'SECURITY'>('LEAVE');
  
  // Leave State
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [leavesHistory, setLeavesHistory] = useState<LeaveApplication[]>([]);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState<boolean>(false);
  const [leaveType, setLeaveType] = useState<'Casual Leave' | 'Medical Leave' | 'Duty Leave' | 'Earned Leave'>('Duty Leave');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [substitute, setSubstitute] = useState<string>('Dr. S. Roy');

  // Documents & Notifications State
  const [documents, setDocuments] = useState<FacultyDocument[]>([]);
  const [notifications, setNotifications] = useState<FacultyNotification[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [bal, history, docs] = await Promise.all([
        facultyErpService.getLeaveBalance(),
        facultyErpService.getLeavesHistory(),
        facultyErpService.getDocuments(),
      ]);
      setLeaveBalance(bal);
      setLeavesHistory(history);
      setDocuments(docs);
      
      setNotifications([
        { id: '1', title: 'WBUHS Examiner Duty Notification', message: 'You have been assigned as External Examiner for Practical Exam at NIH Kolkata on Aug 18.', type: 'EXAM', timestamp: '2 hours ago', isRead: false },
        { id: '2', title: 'Academic Council Meeting Notice', message: 'HODs & Senior Faculty meeting on July 28, 2026 at 03:00 PM in Conference Room.', type: 'MEETING', timestamp: '1 day ago', isRead: false },
        { id: '3', title: 'OPD Duty Roster Revision', message: 'Revised OPD schedule for August 2026 has been published.', type: 'HOSPITAL', timestamp: '2 days ago', isRead: true },
      ]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      alert('Please fill in all leave details.');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

    const updatedLeaves = await facultyErpService.applyLeave({
      leaveType,
      startDate,
      endDate,
      daysCount: days,
      reason,
      substituteFaculty: substitute,
    });

    setLeavesHistory(updatedLeaves);
    setIsApplyLeaveOpen(false);
    setReason('');
    setToastMessage('Leave application submitted to Principal & HOD for approval.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <FacultyLayout pageTitle="Leave Management & Portal Settings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-600" />
              Faculty Portal Operations & Leave Management
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Apply for casual & duty leaves, view academic calendar, manage notifications and official documents.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('LEAVE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'LEAVE'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Leave Portal
            </button>
            <button
              onClick={() => setActiveTab('NOTIFICATIONS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'NOTIFICATIONS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab('CALENDAR')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'CALENDAR'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('DOCUMENTS')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'DOCUMENTS'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Documents
            </button>
            <button
              onClick={() => setActiveTab('SECURITY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'SECURITY'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              Security
            </button>
          </div>
        </div>

        {toastMessage && (
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-xs font-bold animate-fadeIn">
            <Sparkles className="w-4 h-4 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* TAB 1: LEAVE */}
        {activeTab === 'LEAVE' && (
          <div className="space-y-6">
            {/* Leave Balance Cards */}
            {leaveBalance && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-1">
                  <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                    Casual Leave
                  </span>
                  <span className="text-xl font-black text-slate-900 dark:text-white block">
                    {leaveBalance.casualLeave.remaining} / {leaveBalance.casualLeave.total} Days Left
                  </span>
                  <span className="text-3xs font-bold text-slate-400">
                    Used: {leaveBalance.casualLeave.used} Days
                  </span>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-1">
                  <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                    Duty Leave
                  </span>
                  <span className="text-xl font-black text-emerald-600 block">
                    {leaveBalance.dutyLeave.remaining} / {leaveBalance.dutyLeave.total} Days Left
                  </span>
                  <span className="text-3xs font-bold text-slate-400">
                    Used: {leaveBalance.dutyLeave.used} Days
                  </span>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-1">
                  <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                    Medical Leave
                  </span>
                  <span className="text-xl font-black text-blue-600 block">
                    {leaveBalance.medicalLeave.remaining} / {leaveBalance.medicalLeave.total} Days Left
                  </span>
                  <span className="text-3xs font-bold text-slate-400">
                    Used: {leaveBalance.medicalLeave.used} Days
                  </span>
                </div>

                <div className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-1">
                  <span className="text-3xs font-extrabold uppercase tracking-wider text-slate-400 block">
                    Earned Leave
                  </span>
                  <span className="text-xl font-black text-amber-600 block">
                    {leaveBalance.earnedLeave.remaining} / {leaveBalance.earnedLeave.total} Days Left
                  </span>
                  <span className="text-3xs font-bold text-slate-400">
                    Used: {leaveBalance.earnedLeave.used} Days
                  </span>
                </div>
              </div>
            )}

            {/* Apply Leave Button Header */}
            <div className="flex justify-between items-center">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                Leave Applications History
              </h3>
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Apply New Leave
              </button>
            </div>

            {/* History Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                  <thead className="bg-slate-50 dark:bg-slate-800/80 text-3xs uppercase tracking-wider text-slate-500 font-extrabold border-b border-slate-200/80 dark:border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Leave Type</th>
                      <th className="py-3.5 px-4">Duration</th>
                      <th className="py-3.5 px-4">Days</th>
                      <th className="py-3.5 px-4">Substitute Faculty</th>
                      <th className="py-3.5 px-4">Reason</th>
                      <th className="py-3.5 px-4 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {leavesHistory.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                        <td className="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">
                          {l.leaveType}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-3xs font-semibold">
                          {l.startDate} to {l.endDate}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                          {l.daysCount} Days
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 text-3xs font-semibold">
                          {l.substituteFaculty}
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400 text-3xs max-w-xs truncate">
                          {l.reason}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-3xs font-black uppercase ${
                              l.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                : l.status === 'PENDING'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Apply Leave Modal */}
            {isApplyLeaveOpen && (
              <div className="fixed inset-0 bg-slate-950/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-xl">
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Apply for Faculty Leave
                  </h3>
                  <form onSubmit={handleApplyLeave} className="space-y-3">
                    <div>
                      <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                        Leave Type *
                      </label>
                      <select
                        value={leaveType}
                        onChange={(e) =>
                          setLeaveType(
                            e.target.value as 'Casual Leave' | 'Medical Leave' | 'Duty Leave' | 'Earned Leave'
                          )
                        }
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                      >
                        <option value="Casual Leave">Casual Leave</option>
                        <option value="Duty Leave">Duty Leave (Conferences & External Exam)</option>
                        <option value="Medical Leave">Medical Leave</option>
                        <option value="Earned Leave">Earned Leave</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                          Start Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                        />
                      </div>
                      <div>
                        <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                          End Date *
                        </label>
                        <input
                          type="date"
                          required
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                        Substitute Faculty (Lecture & OPD Duty) *
                      </label>
                      <input
                        type="text"
                        required
                        value={substitute}
                        onChange={(e) => setSubstitute(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                        Reason for Leave *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="State purpose of leave..."
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                      />
                    </div>

                    <div className="pt-3 flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsApplyLeaveOpen(false)}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-emerald-700 transition"
                      >
                        Submit Application
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: NOTIFICATIONS */}
        {activeTab === 'NOTIFICATIONS' && (
          <div className="space-y-4">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="p-5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl shadow-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-3xs font-black uppercase bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    {n.type}
                  </span>
                  <span className="text-3xs text-slate-400 font-semibold">{n.timestamp}</span>
                </div>
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white pt-1">
                  {n.title}
                </h4>
                <p className="text-xs text-slate-500">{n.message}</p>
              </div>
            ))}
          </div>
        )}

        {/* TAB 3: CALENDAR */}
        {activeTab === 'CALENDAR' && (
          <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-emerald-600" />
              Academic & Institutional Events Calendar
            </h3>
            <p className="text-xs text-slate-500">
              Synchronized schedules for WBUHS term exams, college holidays, faculty meetings, and hospital duties.
            </p>
            <div className="p-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-center space-y-2 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                July & August 2026 Academic Calendar Active
              </span>
              <p className="text-3xs text-slate-400">
                July 28: Academic Council Meeting • August 15: Independence Day Flag Hoisting • August 18: WBUHS Practical Invigilation.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: DOCUMENTS */}
        {activeTab === 'DOCUMENTS' && (
          <div className="space-y-4">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="p-4 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xs flex items-center justify-between gap-4"
              >
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-xs text-slate-900 dark:text-white">
                    {doc.title}
                  </h4>
                  <p className="text-3xs text-slate-400">
                    Category: {doc.category} • Size: {doc.fileSize} • Format: {doc.fileType}
                  </p>
                </div>
                <button
                  onClick={() => alert(`Downloading ${doc.title}...`)}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        )}

        {/* TAB 5: SECURITY */}
        {activeTab === 'SECURITY' && (
          <div className="max-w-xl mx-auto p-6 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-emerald-600" />
              Faculty Portal Security & Account Password
            </h3>
            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-3xs font-bold uppercase text-slate-500 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                />
              </div>
              <button
                onClick={() => alert('Password updated successfully!')}
                className="w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-sm hover:bg-emerald-700 transition cursor-pointer"
              >
                Update Security Password
              </button>
            </div>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};
