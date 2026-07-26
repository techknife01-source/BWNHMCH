import React from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUpcomingSchedule } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const TodaysSchedule: React.FC = () => {
  const { schedule, isLoading, isError, error, refetch } = useUpcomingSchedule();

  const getTypeStyle = (type: string) => {
    switch (type) {
      case 'Administrative':
        return 'border-l-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/30 text-indigo-900 dark:text-indigo-200';
      case 'Class Lecture':
        return 'border-l-blue-500 bg-blue-50/50 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200';
      case 'Clinical Duty':
        return 'border-l-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200';
      case 'Academic Review':
        return 'border-l-amber-500 bg-amber-50/50 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200';
      case 'Meeting':
        return 'border-l-purple-500 bg-purple-50/50 dark:bg-purple-950/30 text-purple-900 dark:text-purple-200';
      default:
        return 'border-l-slate-400 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200';
    }
  };

  return (
    <WidgetContainer
      title="Today's Time-Slot Schedule"
      subtitle="Lectures, clinical duty & departmental meetings"
      icon={Calendar}
      iconColorClass="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={schedule.length === 0}
      emptyMessage="No time slots scheduled."
      onRetry={refetch}
    >
      <div className="space-y-2.5">
        {schedule.map((item) => (
          <div
            key={item.id}
            className={`p-3 rounded-xl border-l-4 border-y border-r border-slate-100 dark:border-slate-800 ${getTypeStyle(
              item.type
            )} flex items-center justify-between gap-3`}
          >
            <div className="space-y-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-3xs font-black uppercase tracking-wider opacity-75">
                  {item.type}
                </span>
                {item.status === 'completed' && (
                  <span className="inline-flex items-center gap-0.5 text-3xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </span>
                )}
                {item.status === 'in-progress' && (
                  <span className="inline-flex items-center gap-0.5 text-3xs font-extrabold text-blue-600 dark:text-blue-400 animate-pulse">
                    <AlertCircle className="w-3 h-3" /> In Progress
                  </span>
                )}
              </div>
              <h5 className="font-extrabold text-xs leading-snug truncate">
                {item.title}
              </h5>
              <div className="flex items-center gap-3 text-3xs font-medium opacity-80">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 shrink-0" /> {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 shrink-0" /> {item.location}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};
