import React from 'react';
import { Card } from './Card';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon, trend, trendUp }) => {
  return (
    <Card className="flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{value}</p>
        {trend && (
          <p className={`text-xs font-semibold ${trendUp ? 'text-emerald-600' : 'text-rose-600'}`}>
            {trend}
          </p>
        )}
      </div>
      {icon && <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">{icon}</div>}
    </Card>
  );
};
