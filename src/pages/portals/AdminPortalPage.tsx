import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Building2,
  Award,
  UserCheck,
  CalendarCheck,
  Calendar,
  Briefcase,
  FileCheck,
  FileText,
  QrCode,
  CreditCard,
  Network,
  Users2,
  Bell,
  BellRing,
  Shield,
  Search,
  Plus,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

// Sub-modules
import { AdminDashboardView } from '../../modules/admin/components/AdminDashboardView';
import { HrDashboardView } from '../../modules/admin/components/HrDashboardView';
import { EmployeeManagementView } from '../../modules/admin/components/EmployeeManagementView';
import { DepartmentManagementView } from '../../modules/admin/components/DepartmentManagementView';
import { DesignationManagementView } from '../../modules/admin/components/DesignationManagementView';
import { AttendanceManagementView } from '../../modules/admin/components/AttendanceManagementView';
import { LeaveManagementView } from '../../modules/admin/components/LeaveManagementView';
import { HolidayCalendarView } from '../../modules/admin/components/HolidayCalendarView';
import { RecruitmentView } from '../../modules/admin/components/RecruitmentView';
import { JoiningProcessView } from '../../modules/admin/components/JoiningProcessView';
import { EmployeeDocumentsView } from '../../modules/admin/components/EmployeeDocumentsView';
import { IdentityCardsView } from '../../modules/admin/components/IdentityCardsView';
import { PayrollStructureView } from '../../modules/admin/components/PayrollStructureView';
import { OrgStructureView } from '../../modules/admin/components/OrgStructureView';
import { CommitteesView } from '../../modules/admin/components/CommitteesView';
import { CircularsView } from '../../modules/admin/components/CircularsView';
import { NotificationsView } from '../../modules/admin/components/NotificationsView';
import { ActivityAuditLogsView } from '../../modules/admin/components/ActivityAuditLogsView';
import { AdmissionErpView } from '../../modules/admin/components/AdmissionErpView';
import { LibraryErpView } from '../../modules/admin/components/LibraryErpView';
import { FinanceErpView } from '../../modules/admin/components/FinanceErpView';
import { AnalyticsDashboardView } from '../../modules/admin/components/AnalyticsDashboardView';
import { ReportsCenterView } from '../../modules/admin/components/ReportsCenterView';
import { UserPlus, BookOpen, Receipt, PieChart, FileCheck2 } from 'lucide-react';

type AdminTab =
  | 'dashboard'
  | 'hr-analytics'
  | 'admission-erp'
  | 'library-erp'
  | 'finance-erp'
  | 'executive-analytics'
  | 'reports-center'
  | 'employees'
  | 'departments'
  | 'designations'
  | 'attendance'
  | 'leave'
  | 'holidays'
  | 'recruitment'
  | 'joining'
  | 'documents'
  | 'id-cards'
  | 'payroll'
  | 'org-chart'
  | 'committees'
  | 'circulars'
  | 'notifications'
  | 'audit-logs';

export const AdminPortalPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [isAddStaffModalOpen, setIsAddStaffModalOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, category: 'Core' },
    { id: 'executive-analytics', label: 'Executive Analytics', icon: PieChart, category: 'Analytics' },
    { id: 'admission-erp', label: 'Admission ERP', icon: UserPlus, category: 'Academic ERP' },
    { id: 'library-erp', label: 'Library ERP', icon: BookOpen, category: 'Academic ERP' },
    { id: 'finance-erp', label: 'Finance & Accounts', icon: Receipt, category: 'Finance ERP' },
    { id: 'reports-center', label: 'Reports & Audits', icon: FileCheck2, category: 'Compliance' },
    { id: 'hr-analytics', label: 'HR Analytics', icon: TrendingUp, category: 'Core' },
    { id: 'employees', label: 'Staff Directory', icon: Users, category: 'Workforce' },
    { id: 'departments', label: 'Departments', icon: Building2, category: 'Workforce' },
    { id: 'designations', label: 'Designations', icon: Award, category: 'Workforce' },
    { id: 'attendance', label: 'Attendance Log', icon: UserCheck, category: 'Operations' },
    { id: 'leave', label: 'Leave Requests', icon: CalendarCheck, category: 'Operations' },
    { id: 'holidays', label: 'Holiday Calendar', icon: Calendar, category: 'Operations' },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase, category: 'Talent' },
    { id: 'joining', label: 'Onboarding & Joining', icon: FileCheck, category: 'Talent' },
    { id: 'documents', label: 'Document Vault', icon: FileText, category: 'Records' },
    { id: 'id-cards', label: 'Identity Cards', icon: QrCode, category: 'Records' },
    { id: 'payroll', label: 'Payroll & Salary', icon: CreditCard, category: 'Finance' },
    { id: 'org-chart', label: 'Org Hierarchy', icon: Network, category: 'Governance' },
    { id: 'committees', label: 'Committees & Boards', icon: Users2, category: 'Governance' },
    { id: 'circulars', label: 'Circulars & Orders', icon: Bell, category: 'Comms' },
    { id: 'notifications', label: 'Internal Broadcasts', icon: BellRing, category: 'Comms' },
    { id: 'audit-logs', label: 'Audit Trail', icon: Shield, category: 'Compliance' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-[#002147] via-[#003366] to-[#001833] text-white p-6 rounded-3xl shadow-lg border border-blue-900/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-amber-400 text-slate-900">
              ADMINISTRATION & HR ERP
            </span>
            <span className="text-xs text-blue-200 font-bold">• Smart College Digital Ecosystem</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Institutional HR & Governance Terminal</h1>
          <p className="text-xs text-blue-200 max-w-2xl">
            Centralized workforce management, biometric attendance, faculty recruitment, monthly payroll processing, statutory committees & audit compliance
          </p>
        </div>

        <button
          onClick={() => {
            setActiveTab('employees');
            setIsAddStaffModalOpen(true);
          }}
          className="px-5 py-3 bg-[#00A651] hover:bg-[#008c44] text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Staff Member</span>
        </button>
      </div>

      {/* Sub-module Navigation Pills (Categorized) */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as AdminTab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'bg-[#002147] text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab View Render */}
      <div>
        {activeTab === 'dashboard' && (
          <AdminDashboardView
            onNavigate={(tab) => setActiveTab(tab as AdminTab)}
            onOpenAddEmployee={() => {
              setActiveTab('employees');
              setIsAddStaffModalOpen(true);
            }}
          />
        )}

        {activeTab === 'hr-analytics' && <HrDashboardView />}

        {activeTab === 'executive-analytics' && <AnalyticsDashboardView />}

        {activeTab === 'admission-erp' && <AdmissionErpView />}

        {activeTab === 'library-erp' && <LibraryErpView />}

        {activeTab === 'finance-erp' && <FinanceErpView />}

        {activeTab === 'reports-center' && <ReportsCenterView />}

        {activeTab === 'employees' && (
          <EmployeeManagementView
            isAddModalOpenInitially={isAddStaffModalOpen}
            onCloseAddModalInitially={() => setIsAddStaffModalOpen(false)}
          />
        )}

        {activeTab === 'departments' && <DepartmentManagementView />}

        {activeTab === 'designations' && <DesignationManagementView />}

        {activeTab === 'attendance' && <AttendanceManagementView />}

        {activeTab === 'leave' && <LeaveManagementView />}

        {activeTab === 'holidays' && <HolidayCalendarView />}

        {activeTab === 'recruitment' && <RecruitmentView />}

        {activeTab === 'joining' && <JoiningProcessView />}

        {activeTab === 'documents' && <EmployeeDocumentsView />}

        {activeTab === 'id-cards' && <IdentityCardsView />}

        {activeTab === 'payroll' && <PayrollStructureView />}

        {activeTab === 'org-chart' && <OrgStructureView />}

        {activeTab === 'committees' && <CommitteesView />}

        {activeTab === 'circulars' && <CircularsView />}

        {activeTab === 'notifications' && <NotificationsView />}

        {activeTab === 'audit-logs' && <ActivityAuditLogsView />}
      </div>
    </div>
  );
};
