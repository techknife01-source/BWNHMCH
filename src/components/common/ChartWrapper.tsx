import React from 'react';
import { ResponsiveContainer } from 'recharts';
import { Card } from './Card';

export interface ChartWrapperProps {
  title: string;
  subtitle?: string;
  children: React.ReactElement;
  height?: number;
}

export const ChartWrapper: React.FC<ChartWrapperProps> = ({
  title,
  subtitle,
  children,
  height = 300,
}) => {
  return (
    <Card className="flex flex-col space-y-4">
      <div>
        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-100">{title}</h4>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
