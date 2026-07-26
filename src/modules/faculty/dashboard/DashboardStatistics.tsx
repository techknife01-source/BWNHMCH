import React from 'react';
import {
  BookOpen,
  CheckSquare,
  FileText,
  FlaskConical,
  Library,
  Stethoscope,
  Clock,
  TrendingUp,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { useDashboardStatistics } from './hooks/useFacultyDashboardHooks';

export const DashboardStatistics: React.FC = () => {
  const { statistics, isLoading, isError, error, refetch } = useDashboardStatistics();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {Array.from({ length: 4 }).map((_, idx) => (
          <div key={idx} className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 animate-pulse space-y-3">
            <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
            <div className="h-8 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800/60 rounded w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 rounded-2xl flex items-center justify-between gap-3 text-rose-800 dark:text-rose-300">
        <div className="flex items-center gap-2 text-xs font-bold">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Failed to load faculty statistics: {error?.message}</span>
        </div>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-3xs font-extrabold flex items-center gap-1 cursor-pointer shrink-0"
        >
          <RefreshCw className="w-3 h-3" /> Retry
        </button>
      </div>
    );
  }

  const statsList = [
    {
      id: 'classes',
      title: 'Active Classes',
      value: `${statistics?.activeClassesCount || 12} Batches`,
      subtext: `${statistics?.assignedSubjectsCount || 4} Subjects Assigned`,
      trend: '+2 this term',
      trendUp: true,
      icon: BookOpen,
      iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/80 dark:text-blue-400',
      borderColor: 'border-blue-100 dark:border-blue-900/50',
    },
    {
      id: 'attendance',
      title: 'Overall Attendance Rate',
      value: `${statistics?.overallAttendancePercentage || 87.4}%`,
      subtext: `Target: >${statistics?.attendanceTargetPercentage || 85.0}%`,
      trend: `+${statistics?.attendanceTrendPercentage || 3.1}% vs last month`,
      trendUp: true,
      icon: CheckSquare,
      iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/80 dark:text-emerald-400',
      borderColor: 'border-emerald-100 dark:border-emerald-900/50',
    },
    {
      id: 'assignments',
      title: 'Assignments & Logbooks',
      value: `${statistics?.pendingAssignmentsCount || 18} Pending`,
      subtext: `${statistics?.evaluatedAssignmentsCount || 173} Evaluated total`,
      trend: 'Action needed',
      trendUp: false,
      icon: FileText,
      iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400',
      borderColor: 'border-amber-100 dark:border-amber-900/50',
    },
    {
      id: 'research',
      title: 'Research Publications',
      value: `${statistics?.publishedResearchCount || 8} Published`,
      subtext: `${statistics?.underReviewResearchCount || 2} Under Review`,
      trend: '₹4.5 L Grants',
      trendUp: true,
      icon: FlaskConical,
      iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950/80 dark:text-purple-400',
      borderColor: 'border-purple-100 dark:border-purple-900/50',
    },
    {
      id: 'materials',
      title: 'E-Books & Materials',
      value: `${statistics?.uploadedMaterialsCount || 24} Uploaded`,
      subtext: 'Across 3 Departments',
      trend: '+4 this week',
      trendUp: true,
      icon: Library,
      iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/80 dark:text-indigo-400',
      borderColor: 'border-indigo-100 dark:border-indigo-900/50',
    },
    {
      id: 'hospital',
      title: 'Hospital Duty Hours',
      value: `${statistics?.hospitalMonthlyDutyHours || 36} Hrs / Mo`,
      subtext: statistics?.opdRoomNumber || 'General OPD Room 4',
      trend: 'Next shift 11:30 AM',
      trendUp: true,
      icon: Stethoscope,
      iconBg: 'bg-teal-50 text-teal-600 dark:bg-teal-950/80 dark:text-teal-400',
      borderColor: 'border-teal-100 dark:border-teal-900/50',
    },
    {
      id: 'reviews',
      title: 'Pending Reviews',
      value: `${statistics?.pendingReviewsCount || 5} Clearances`,
      subtext: 'Interns & Logbooks',
      trend: 'High Priority',
      trendUp: false,
      icon: Clock,
      iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950/80 dark:text-rose-400',
      borderColor: 'border-rose-100 dark:border-rose-900/50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      {statsList.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className={`p-4 bg-white dark:bg-slate-900 rounded-2xl border ${item.borderColor} dark:border-slate-800 shadow-2xs space-y-3 hover:shadow-xs transition`}
          >
            <div className="flex items-center justify-between">
              <span className="text-3xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {item.title}
              </span>
              <div className={`p-2 rounded-xl ${item.iconBg}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="space-y-0.5">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {item.value}
              </h3>
              <p className="text-3xs text-slate-500 font-medium">{item.subtext}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-3xs font-bold">
              <span
                className={`flex items-center gap-1 ${
                  item.trendUp
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-amber-600 dark:text-amber-400'
                }`}
              >
                {item.trendUp ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                {item.trend}
              </span>
              <span className="text-slate-400">Updated</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
