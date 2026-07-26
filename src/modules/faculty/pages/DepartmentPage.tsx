import React, { useState } from 'react';
import { FacultyLayout } from '../layout/FacultyLayout';
import { Building2, RefreshCw, AlertTriangle } from 'lucide-react';

export const DepartmentPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <FacultyLayout pageTitle="Department">
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5 text-emerald-600" />
              Departmental Overview & Roster
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Department faculty directory, curriculum planning, and HOD circulars.
            </p>
          </div>
          <button
            onClick={() => setIsLoading(false)}
            className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>

        {isLoading && (
          <div className="p-8 border border-slate-200/80 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center gap-3">
            <RefreshCw className="w-5 h-5 text-emerald-600 animate-spin" />
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Loading department info...
            </span>
          </div>
        )}

        {error && (
          <div className="p-4 border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 rounded-2xl flex items-center gap-3 text-rose-700 dark:text-rose-300 text-xs font-bold">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!isLoading && !error && (
          <div className="p-8 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl bg-white/50 dark:bg-slate-900/50 text-center space-y-2">
            <p className="text-xs font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Faculty Department Module Foundation Ready
            </p>
            <p className="text-2xs text-slate-500 max-w-md mx-auto">
              Prepared for departmental meetings, curriculum distribution, and peer faculty rosters.
            </p>
          </div>
        )}
      </div>
    </FacultyLayout>
  );
};
