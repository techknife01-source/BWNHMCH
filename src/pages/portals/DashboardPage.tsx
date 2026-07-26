import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { StatCard } from '../../components/common/StatCard';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Users, GraduationCap, Stethoscope, BookOpen, Activity, FileText } from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            Welcome back, {user?.fullName || 'Doctor/Scholar'}!
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Digital ERP Operational Overview • Role: <span className="font-semibold text-blue-600">{user?.roles?.[0]}</span>
          </p>
        </div>
        <Badge variant="accent" className="px-3 py-1 text-xs shrink-0">System Status: Active</Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Students" value="315" icon={<GraduationCap className="h-6 w-6" />} trend="+12% this year" trendUp={true} />
        <StatCard title="Faculty & Doctors" value="48" icon={<Users className="h-6 w-6 text-emerald-600" />} trend="All Positions Filled" trendUp={true} />
        <StatCard title="Daily OPD Registrations" value="240+" icon={<Stethoscope className="h-6 w-6 text-amber-600" />} trend="+18% vs last month" trendUp={true} />
        <StatCard title="Library Borrowed Volumes" value="1,120" icon={<BookOpen className="h-6 w-6 text-purple-600" />} trend="Catalog Updated" trendUp={true} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center">
              <Activity className="h-4 w-4 mr-2 text-blue-600" />
              <span>Real-time System Audit & Activities</span>
            </h3>
            <span className="text-[10px] text-slate-400">Live feed</span>
          </div>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">WBUHS Exam Marks Uploaded - BHMS 2nd Year</span>
              <span className="text-[10px] text-slate-400">10 mins ago</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">New Clinical Case Registered - OPD #4421</span>
              <span className="text-[10px] text-slate-400">25 mins ago</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800">
              <span className="text-slate-700 dark:text-slate-300">Fee Clearance Slip Generated - Reg #2024-089</span>
              <span className="text-[10px] text-slate-400">1 hour ago</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center">
              <FileText className="h-4 w-4 mr-2 text-emerald-600" />
              <span>Active Circulars & Announcements</span>
            </h3>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800">
              <p className="font-bold text-slate-800 dark:text-slate-200">National Homoeopathic Conference 2026</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Faculty delegates registration deadline is 28th July 2026.</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
