import React from 'react';
import { BookOpen, Users, Clock, MapPin, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTodaysClasses } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const UpcomingClasses: React.FC = () => {
  const navigate = useNavigate();
  const { classes, isLoading, isError, error, refetch } = useTodaysClasses();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Ongoing':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-300';
      case 'Upcoming':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-300';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300';
    }
  };

  return (
    <WidgetContainer
      title="Today's Academic Classes"
      subtitle="Scheduled lectures, practicals & seminars"
      icon={BookOpen}
      iconColorClass="text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={classes.length === 0}
      emptyMessage="No classes scheduled for today."
      onRetry={refetch}
      headerAction={
        <button
          onClick={() => navigate('/faculty/classes')}
          className="text-2xs font-extrabold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center gap-1 cursor-pointer"
        >
          <span>View All</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-3">
        {classes.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2.5 hover:border-blue-200 dark:hover:border-blue-800 transition"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="text-3xs font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">
                  {item.batch}
                </span>
                <h5 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {item.subject}
                </h5>
              </div>
              <span
                className={`px-2 py-0.5 text-3xs font-black rounded-full border ${getStatusBadge(
                  item.status
                )}`}
              >
                {item.status}
              </span>
            </div>

            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
              <span className="text-slate-400 font-normal">Topic: </span>
              {item.topic}
            </p>

            <div className="flex items-center justify-between text-2xs text-slate-500 font-medium flex-wrap gap-2 pt-0.5">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-blue-500" />
                  {item.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {item.room}
                </span>
              </div>
              <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-bold">
                <Users className="w-3.5 h-3.5 text-indigo-500" />
                {item.studentsCount} Students
              </span>
            </div>
          </div>
        ))}
      </div>
    </WidgetContainer>
  );
};
