import React, { useState } from 'react';
import { TrendingUp, BarChart3, Clock, GraduationCap, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { usePerformanceStatistics } from './hooks/useFacultyDashboardHooks';
import {
  AttendanceTrendChart,
  TeachingHoursChart,
  AssignmentCompletionChart,
  StudentPerformanceChart,
} from './components/ReusableCharts';

type TabType = 'attendance' | 'assignments' | 'teaching' | 'performance';
type TimeframeType = 'weekly' | 'monthly' | 'term';

export const PerformanceChart: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('attendance');
  const [timeframe, setTimeframe] = useState<TimeframeType>('monthly');

  const { performanceStatistics, isLoading, isError, error, refetch } = usePerformanceStatistics();

  if (isLoading) {
    return (
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 animate-pulse">
        <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-xl w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs p-4 bg-rose-50 dark:bg-rose-950/30 text-center space-y-3">
        <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-sm">
          <AlertCircle className="w-5 h-5" />
          <span>Failed to load performance chart data: {error?.message}</span>
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  const attendanceData = performanceStatistics?.attendanceTrend?.[timeframe] || [];
  const teachingHoursData = performanceStatistics?.teachingHoursBreakdown || [];
  const assignmentData = performanceStatistics?.assignmentCompletion || [];
  const performanceData = performanceStatistics?.studentPerformanceDistribution || [];

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Faculty Academic & Teaching Performance Analytics
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Visual tracking of attendance metrics, evaluation workloads, and student score distributions.
          </p>
        </div>

        {/* Timeframe Selector */}
        {activeTab === 'attendance' && (
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl shrink-0">
            <Calendar className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {(['weekly', 'monthly', 'term'] as TimeframeType[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-3xs font-black rounded-lg transition uppercase tracking-wider cursor-pointer ${
                  timeframe === tf
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Metric Tabs */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'attendance'
              ? 'bg-[#002147] text-white shadow-xs dark:bg-[#00A651]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Attendance Trend</span>
        </button>

        <button
          onClick={() => setActiveTab('assignments')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'assignments'
              ? 'bg-[#002147] text-white shadow-xs dark:bg-[#00A651]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Assignment Status</span>
        </button>

        <button
          onClick={() => setActiveTab('teaching')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'teaching'
              ? 'bg-[#002147] text-white shadow-xs dark:bg-[#00A651]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Teaching Hours</span>
        </button>

        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
            activeTab === 'performance'
              ? 'bg-[#002147] text-white shadow-xs dark:bg-[#00A651]'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Student Performance</span>
        </button>
      </div>

      {/* Chart Canvas Area */}
      <div className="h-64 sm:h-72 w-full pt-2">
        {activeTab === 'attendance' && <AttendanceTrendChart data={attendanceData} />}
        {activeTab === 'assignments' && <AssignmentCompletionChart data={assignmentData} />}
        {activeTab === 'teaching' && <TeachingHoursChart data={teachingHoursData} />}
        {activeTab === 'performance' && <StudentPerformanceChart data={performanceData} />}
      </div>

      {/* Footer Insight Note */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-2xs text-slate-600 dark:text-slate-400 flex items-center justify-between flex-wrap gap-2">
        <span className="font-semibold">
          💡 Insight: {performanceStatistics?.insightMessage || 'Attendance across 1st BHMS lectures is up by 4.2% this month.'}
        </span>
        <span className="font-bold text-emerald-600 dark:text-emerald-400">
          Last Synced: {performanceStatistics?.lastSyncedTimestamp || 'Today 09:30 AM'}
        </span>
      </div>
    </div>
  );
};
