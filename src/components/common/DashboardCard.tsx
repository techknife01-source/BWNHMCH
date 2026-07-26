import React from 'react';
import { Card } from './Card';

export interface DashboardCardProps {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, action, children }) => {
  return (
    <Card className="flex flex-col space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{title}</h3>
        {action}
      </div>
      <div>{children}</div>
    </Card>
  );
};
