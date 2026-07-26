import React from 'react';

export interface MetricCardProps {
  label: string;
  metric: string;
  description?: string;
  badge?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, metric, description, badge }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
        {badge && (
          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">{metric}</p>
      {description && <p className="mt-1 text-xs text-slate-400">{description}</p>}
    </div>
  );
};
