import React from 'react';
import { FlaskConical, ArrowUpRight, BookOpen, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResearchSummary } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const ResearchSummary: React.FC = () => {
  const navigate = useNavigate();
  const { researchSummary, isLoading, isError, error, refetch } = useResearchSummary();

  return (
    <WidgetContainer
      title="Research & Publications"
      subtitle="AYUSH & CCRH grant projects and peer-reviewed journals"
      icon={FlaskConical}
      iconColorClass="text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={!researchSummary}
      emptyMessage="No research publications or ongoing grants found."
      onRetry={refetch}
      headerAction={
        <button
          onClick={() => navigate('/faculty/research')}
          className="text-2xs font-extrabold text-purple-600 hover:text-purple-700 dark:text-purple-400 flex items-center gap-1 cursor-pointer"
        >
          <span>Research Portal</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      }
    >
      <div className="space-y-3">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-purple-50/60 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900/40 text-center space-y-0.5">
            <span className="text-3xs font-black text-purple-700 dark:text-purple-300 uppercase tracking-wider block">
              Published
            </span>
            <span className="text-lg font-black text-purple-950 dark:text-purple-100">
              {researchSummary?.publishedCount || 8}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-amber-50/60 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 text-center space-y-0.5">
            <span className="text-3xs font-black text-amber-700 dark:text-amber-300 uppercase tracking-wider block">
              Under Review
            </span>
            <span className="text-lg font-black text-amber-950 dark:text-amber-100">
              {researchSummary?.underReviewCount || 2}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 text-center space-y-0.5">
            <span className="text-3xs font-black text-emerald-700 dark:text-emerald-300 uppercase tracking-wider block">
              Grants
            </span>
            <span className="text-base font-black text-emerald-950 dark:text-emerald-100">
              {researchSummary?.totalGrantsAmount || '₹4.5 L'}
            </span>
          </div>
        </div>

        {/* Recent Publications */}
        <div className="space-y-2">
          <span className="text-3xs font-black uppercase text-slate-400 tracking-wider block">
            Recent Peer-Reviewed Papers
          </span>

          {researchSummary?.recentPublications?.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-1"
            >
              <div className="flex items-start justify-between gap-2">
                <h6 className="font-extrabold text-xs text-slate-900 dark:text-white leading-snug">
                  {item.title}
                </h6>
                <span className="px-2 py-0.5 text-3xs font-bold rounded-md bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 shrink-0">
                  {item.status}
                </span>
              </div>
              <p className="text-3xs text-slate-500 font-medium">
                {item.journal} • {item.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </WidgetContainer>
  );
};
