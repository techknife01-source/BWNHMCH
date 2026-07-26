import React from 'react';
import { SectionCompletionStatus } from '../utils/profileCompleteness';
import { ProfileTab } from '../types/profile.types';
import { ShieldCheck, AlertCircle, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';

interface ProfileCompletenessWidgetProps {
  overallPercentage: number;
  missingSections: SectionCompletionStatus[];
  onNavigateToTab: (tab: ProfileTab) => void;
}

export const ProfileCompletenessWidget: React.FC<ProfileCompletenessWidgetProps> = ({
  overallPercentage,
  missingSections,
  onNavigateToTab,
}) => {
  const getBadgeColor = (pct: number) => {
    if (pct >= 90) return 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800';
    if (pct >= 70) return 'text-amber-600 bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800';
    return 'text-rose-600 bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800';
  };

  return (
    <div className="p-5 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
            Profile Completion Index
          </h3>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-black border ${getBadgeColor(
            overallPercentage
          )} flex items-center gap-1`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          {overallPercentage}% Complete
        </span>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-emerald-500 to-[#002147] h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <p className="text-3xs text-slate-500 flex justify-between font-semibold">
          <span>Target: 100% Verified Profile</span>
          <span>{100 - overallPercentage}% pending</span>
        </p>
      </div>

      {/* Missing Sections Highlight */}
      {missingSections.length > 0 ? (
        <div className="space-y-2 pt-1 border-t border-slate-100 dark:border-slate-800">
          <p className="text-3xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-amber-500" /> Action Required ({missingSections.length} Sections)
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {missingSections.map((sec) => (
              <button
                key={sec.key}
                onClick={() => onNavigateToTab(sec.key as ProfileTab)}
                className="p-2.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40 text-left hover:border-amber-400 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {sec.label}
                  </h4>
                  <p className="text-[10px] text-amber-700/80 dark:text-amber-400/80">
                    Missing: {sec.missingFields.join(', ')}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600 group-hover:translate-x-0.5 transition shrink-0 ml-2" />
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl flex items-center gap-2.5 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>All profile sections verified! Your faculty profile is 100% complete and compliant with NCH standards.</span>
        </div>
      )}
    </div>
  );
};
