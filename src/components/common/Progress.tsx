import React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps {
  value: number; // 0 - 100
  max?: number;
  className?: string;
  colorClass?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  colorClass = 'bg-blue-600',
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800', className)}>
      <div
        className={cn('h-full transition-all duration-300 ease-out', colorClass)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
