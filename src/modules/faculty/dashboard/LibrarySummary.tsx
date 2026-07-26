import React from 'react';
import { Library, ArrowUpRight, Upload, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLibrarySummary } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const LibrarySummary: React.FC = () => {
  const navigate = useNavigate();
  const { librarySummary, isLoading, isError, error, refetch } = useLibrarySummary();

  return (
    <WidgetContainer
      title="E-Library & Digital Study Resources"
      subtitle="E-book requisitions & faculty study material uploads"
      icon={Library}
      iconColorClass="text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!librarySummary}
      emptyMessage="No library metrics available."
      onRetry={refetch}
      headerAction={
        <button
          onClick={() => navigate('/faculty/library')}
          className="text-2xs font-extrabold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center gap-1 cursor-pointer"
        >
          <span>E-Library Portal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-center space-y-0.5">
            <span className="text-3xs font-black text-indigo-700 dark:text-indigo-300 uppercase tracking-wider block">
              Requisitions
            </span>
            <span className="text-lg font-black text-indigo-950 dark:text-indigo-100">
              {librarySummary?.requestedBooksCount || 5}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center space-y-0.5">
            <span className="text-3xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Approved
            </span>
            <span className="text-lg font-black text-emerald-950 dark:text-emerald-100">
              {librarySummary?.approvedRequisitionsCount || 4}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 text-center space-y-0.5">
            <span className="text-3xs font-black text-blue-700 dark:text-blue-300 uppercase tracking-wider block">
              E-Notes
            </span>
            <span className="text-lg font-black text-blue-950 dark:text-blue-100">
              {librarySummary?.eNotesUploadedCount || 24}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider block">
            Recent Material Uploads
          </span>

          {librarySummary?.recentUploads?.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
            >
              <div className="space-y-0.5 min-w-0">
                <h6 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                  {item.title}
                </h6>
                <p className="text-3xs text-slate-500 font-medium">
                  {item.category} • Uploaded {item.uploadedAt}
                </p>
              </div>
              <Upload className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </WidgetContainer>
  );
};
