import React, { useState, useMemo } from 'react';
import { Activity, CheckSquare, FileText, Upload, FlaskConical, Bell, Filter, ChevronDown } from 'lucide-react';
import { useRecentActivities } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const RecentActivities: React.FC = () => {
  const { activities, isLoading, isError, error, refetch } = useRecentActivities();
  const [filterType, setFilterType] = useState<string>('all');
  const [displayCount, setDisplayCount] = useState<number>(5);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'attendance':
        return <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'assignment':
        return <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'upload':
        return <Upload className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'research':
        return <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600 dark:text-slate-400" />;
    }
  };

  const filteredActivities = useMemo(() => {
    if (filterType === 'all') return activities;
    return activities.filter((a) => a.type === filterType);
  }, [activities, filterType]);

  const paginated = useMemo(() => {
    return filteredActivities.slice(0, displayCount);
  }, [filteredActivities, displayCount]);

  const hasMore = paginated.length < filteredActivities.length;

  return (
    <WidgetContainer
      title="Recent Activity Timeline"
      subtitle="Audited records of registers marked, submissions & research updates"
      icon={Activity}
      iconColorClass="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={activities.length === 0}
      emptyMessage="No recent activity logs recorded."
      onRetry={refetch}
    >
      {/* Activity Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'All Logs' },
          { id: 'attendance', label: 'Attendance' },
          { id: 'assignment', label: 'Assignments' },
          { id: 'upload', label: 'Uploads' },
          { id: 'research', label: 'Research' },
        ].map((chip) => (
          <button
            key={chip.id}
            onClick={() => setFilterType(chip.id)}
            className={`px-2.5 py-1 text-3xs font-black rounded-lg transition uppercase tracking-wider shrink-0 cursor-pointer ${
              filterType === chip.id
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
            }`}
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Timeline Stream */}
      <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-100 dark:before:bg-slate-800 pt-1">
        {paginated.map((item) => (
          <div key={item.id} className="flex items-start gap-3 relative z-10">
            <div className="p-1.5 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs shrink-0 mt-0.5">
              {getActivityIcon(item.type)}
            </div>
            <div className="flex-1 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-1">
              <div className="flex items-center justify-between gap-2">
                <h6 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h6>
                <span className="text-3xs font-semibold text-slate-400 shrink-0">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-3xs text-slate-600 dark:text-slate-400 font-medium">
                {item.details}
              </p>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="pt-2 text-center">
          <button
            onClick={() => setDisplayCount((prev) => prev + 4)}
            className="px-3 py-1.5 rounded-xl text-3xs font-black uppercase text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer"
          >
            Load Earlier Logs
          </button>
        </div>
      )}
    </WidgetContainer>
  );
};
