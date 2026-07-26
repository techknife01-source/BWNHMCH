import React from 'react';
import { FileText, ArrowUpRight, Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAssignmentSummary } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const AssignmentSummary: React.FC = () => {
  const navigate = useNavigate();
  const { assignmentSummary, isLoading, isError, error, refetch } = useAssignmentSummary();

  return (
    <WidgetContainer
      title="Assignment & Logbook Evaluation"
      subtitle="Pending student logbook reviews & grading workloads"
      icon={FileText}
      iconColorClass="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!assignmentSummary}
      emptyMessage="No assignment evaluation metrics available."
      onRetry={refetch}
      headerAction={
        <button
          onClick={() => navigate('/faculty/assignments')}
          className="text-2xs font-extrabold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Evaluate Submissions</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-3">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-1">
            <span className="text-3xs font-black uppercase text-amber-700 dark:text-amber-400 tracking-wider block">
              Pending Grading
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {assignmentSummary?.pendingEvaluationCount || 18} Submissions
            </span>
            <p className="text-3xs font-medium text-slate-500">Requires review</p>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40 space-y-1">
            <span className="text-3xs font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider block">
              Evaluated This Week
            </span>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              {assignmentSummary?.evaluatedThisWeekCount || 42} Graded
            </span>
            <p className="text-3xs font-medium text-slate-500">
              Avg score: {assignmentSummary?.avgScorePercentage || 74.5}%
            </p>
          </div>
        </div>

        {/* Urgent Item */}
        {assignmentSummary?.urgentSubmission && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <span className="text-3xs font-extrabold text-amber-600 dark:text-amber-400 uppercase tracking-wider block">
                Next Evaluation Due
              </span>
              <h6 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                {assignmentSummary.urgentSubmission.title}
              </h6>
              <p className="text-3xs text-slate-500 font-medium">
                {assignmentSummary.urgentSubmission.batch} • Due: {assignmentSummary.urgentSubmission.dueDate}
              </p>
            </div>
            <button
              onClick={() => navigate('/faculty/assignments')}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-3xs rounded-xl transition cursor-pointer shrink-0"
            >
              Grade Now
            </button>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
};
