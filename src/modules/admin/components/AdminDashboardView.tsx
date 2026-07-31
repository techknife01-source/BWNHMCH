import React from 'react';
import { adminHrService } from '../../../services/adminHrService';
import {
  Users,
  Building2,
  CalendarCheck,
  CreditCard,
  Briefcase,
  FileText,
  UserCheck,
  TrendingUp,
  Clock,
  Bell,
  ArrowRight,
  Plus,
} from 'lucide-react';

interface AdminDashboardViewProps {
  onNavigateTab: (tabKey: string) => void;
  onOpenNewEmployeeModal: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  onNavigateTab,
  onOpenNewEmployeeModal,
}) => {
  const stats = adminHrService.getAdminStats();
  const recentActivities = adminHrService.getActivityLogs().slice(0, 5);
  const pendingLeaves = adminHrService.getLeaveApplications().filter((l) => l.status === 'PENDING');
  const recentCirculars = adminHrService.getCirculars().slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#002147] to-[#003366] text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-300 bg-blue-900/50 px-2.5 py-1 rounded-full border border-blue-700/50">
            Institutional Administration & HR Portal
          </span>
          <h2 className="text-xl sm:text-2xl font-black mt-2">
            BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL ERP
          </h2>
          <p className="text-xs text-blue-200 mt-1 max-w-2xl">
            Real-time management of college faculty, hospital medical staff, non-teaching personnel, department budgets, payroll, attendance, regulatory filings & committees.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNewEmployeeModal}
            className="px-4 py-2 bg-[#00A651] hover:bg-[#008c44] text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Staff</span>
          </button>
          <button
            onClick={() => onNavigateTab('circulars')}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer border border-white/20"
          >
            <Bell className="w-4 h-4 text-amber-300" />
            <span>Publish Notice</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => onNavigateTab('employees')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-blue-500 transition cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Staff Strength</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalEmployees}</h3>
            </div>
            <span className="p-3 bg-blue-50 dark:bg-blue-950/50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span className="text-emerald-600 font-bold">{stats.activeEmployees} Active</span>
            <span>{stats.onLeaveEmployees} On Leave</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('departments')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-emerald-500 transition cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Academic & Hospital Depts</p>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{stats.totalDepartments}</h3>
            </div>
            <span className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 rounded-xl">
              <Building2 className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Teaching: {stats.teachingStaff}</span>
            <span>Hospital: {stats.hospitalStaff}</span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('leave')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-amber-500 transition cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending Leave Requests</p>
              <h3 className="text-2xl font-black text-amber-600 mt-1">{stats.pendingLeaveApps}</h3>
            </div>
            <span className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 rounded-xl">
              <CalendarCheck className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span>Action Required</span>
            <span className="text-amber-600 font-bold flex items-center gap-1">Review <ArrowRight className="w-3 h-3" /></span>
          </div>
        </div>

        <div
          onClick={() => onNavigateTab('payroll')}
          className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs hover:border-indigo-500 transition cursor-pointer"
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Monthly Payroll Disbursed</p>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">₹{(stats.totalMonthlyPayroll / 100000).toFixed(2)} Lakhs</h3>
            </div>
            <span className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 flex justify-between">
            <span className="text-emerald-600 font-bold">100% Processed</span>
            <span>July 2026</span>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Action Required & Quick Links */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Leave Approvals Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 rounded-lg">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="font-black text-sm text-slate-900 dark:text-white">
                  Pending Leave Applications ({pendingLeaves.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('leave')}
                className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {pendingLeaves.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 text-center">No pending leave applications requiring approval.</p>
            ) : (
              <div className="space-y-3">
                {pendingLeaves.map((app) => (
                  <div
                    key={app.id}
                    className="p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-slate-900 dark:text-white">{app.empName}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                          {app.departmentName}
                        </span>
                      </div>
                      <p className="text-slate-500 mt-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{app.leaveType} Leave</span> ({app.totalDays} days): {app.startDate} to {app.endDate}
                      </p>
                      <p className="text-slate-400 text-[11px] mt-0.5 italic">"{app.reason}"</p>
                    </div>

                    <button
                      onClick={() => onNavigateTab('leave')}
                      className="px-3 py-1.5 bg-[#002147] text-white font-bold rounded-lg hover:bg-blue-900 transition shrink-0 cursor-pointer"
                    >
                      Process Leave
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Action Navigation Grid */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-4">
            <h3 className="font-black text-sm text-slate-900 dark:text-white">
              Institutional Admin Quick Actions
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigateTab('attendance')}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer group"
              >
                <UserCheck className="w-5 h-5 text-blue-600 mb-1 group-hover:scale-110 transition" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">Daily Attendance</p>
                <p className="text-[10px] text-slate-500">Biometric & Duty log</p>
              </button>

              <button
                onClick={() => onNavigateTab('id-cards')}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer group"
              >
                <FileText className="w-5 h-5 text-emerald-600 mb-1 group-hover:scale-110 transition" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">Generate ID Cards</p>
                <p className="text-[10px] text-slate-500">Print staff credentials</p>
              </button>

              <button
                onClick={() => onNavigateTab('recruitment')}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-purple-50 dark:hover:bg-purple-950/40 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer group"
              >
                <Briefcase className="w-5 h-5 text-purple-600 mb-1 group-hover:scale-110 transition" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">Recruitment & Hiring</p>
                <p className="text-[10px] text-slate-500">Requisitions & interviews</p>
              </button>

              <button
                onClick={() => onNavigateTab('meetings')}
                className="p-3 bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl border border-slate-200 dark:border-slate-700 text-left transition cursor-pointer group"
              >
                <TrendingUp className="w-5 h-5 text-amber-600 mb-1 group-hover:scale-110 transition" />
                <p className="font-bold text-xs text-slate-900 dark:text-white">Meetings & MoM</p>
                <p className="text-[10px] text-slate-500">Council & Committees</p>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Circulars & Audit Feeds */}
        <div className="space-y-6">
          {/* Active Circulars Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-blue-600" />
                <span>Recent Circulars</span>
              </h3>
              <button
                onClick={() => onNavigateTab('circulars')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                All Circulars
              </button>
            </div>

            <div className="space-y-2.5">
              {recentCirculars.map((cir) => (
                <div key={cir.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-[10px] font-bold text-blue-600">{cir.circularNo}</span>
                    <span className="text-[10px] text-slate-400">{cir.publishedDate}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{cir.title}</h4>
                  <p className="text-slate-500 line-clamp-2 text-[11px]">{cir.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Logs Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>Recent Activity Log</span>
              </h3>
              <button
                onClick={() => onNavigateTab('activity-logs')}
                className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
              >
                View Audit
              </button>
            </div>

            <div className="space-y-3">
              {recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-2.5 text-xs pb-2 border-b border-slate-100 dark:border-slate-800 last:border-0">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-200">{act.details}</p>
                    <p className="text-[10px] text-slate-400">{act.performedBy} • {act.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
