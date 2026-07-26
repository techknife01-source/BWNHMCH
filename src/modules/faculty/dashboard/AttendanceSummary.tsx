import React from 'react';
import { CheckSquare, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAttendanceSummary } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const AttendanceSummary: React.FC = () => {
  const navigate = useNavigate();
  const { attendanceSummary, isLoading, isError, error, refetch } = useAttendanceSummary();

  const stats = [
    {
      label: 'Avg Attendance Rate',
      value: `${attendanceSummary?.avgAttendanceRate || 87.4}%`,
      change: '+3.1%',
      status: 'good',
    },
    {
      label: 'Classes Conducted',
      value: attendanceSummary?.classesConducted || '48 / 52',
      sub: `${attendanceSummary?.completionRatePercentage || 92}% completed`,
      status: 'neutral',
    },
    {
      label: 'Low Attendance Alert',
      value: `${attendanceSummary?.lowAttendanceStudentsCount || 14} Students`,
      sub: '<75% threshold',
      status: 'warning',
    },
    {
      label: 'Pending Registers',
      value: `${attendanceSummary?.pendingRegistersCount || 1} Batch`,
      sub: '3rd BHMS Organon',
      status: 'pending',
    },
  ];

  return (
    <WidgetContainer
      title="Attendance Summary"
      subtitle="Subject registers & percentage tracking"
      icon={CheckSquare}
      iconColorClass="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!attendanceSummary}
      emptyMessage="No attendance summary available."
      onRetry={refetch}
      headerAction={
        <button
          onClick={() => navigate('/faculty/attendance')}
          className="text-2xs font-extrabold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Mark Register</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((item, idx) => (
            <div
              key={idx}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1"
            >
              <span className="text-3xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                {item.label}
              </span>
              <div className="flex items-baseline justify-between">
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {item.value}
                </span>
                {item.change && (
                  <span className="text-3xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    {item.change}
                  </span>
                )}
              </div>
              {item.sub && (
                <p className="text-3xs font-semibold text-slate-400 dark:text-slate-500">
                  {item.sub}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar Component */}
        <div className="space-y-1.5 pt-1">
          <div className="flex justify-between text-2xs font-extrabold text-slate-700 dark:text-slate-300">
            <span>Monthly Target Attendance ({attendanceSummary?.monthlyTargetPercentage || 85}%)</span>
            <span className="text-emerald-600 dark:text-emerald-400">
              {attendanceSummary?.avgAttendanceRate || 87.4}% Achieved
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, attendanceSummary?.avgAttendanceRate || 87.4)}%` }}
            />
          </div>
        </div>

        {attendanceSummary?.actionRequiredNotice && (
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 flex items-center gap-2 text-amber-800 dark:text-amber-300 text-3xs font-bold">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{attendanceSummary.actionRequiredNotice}</span>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
};
