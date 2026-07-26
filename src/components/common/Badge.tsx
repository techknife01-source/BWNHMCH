import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'warning' | 'outline';
}

export const Badge: React.FC<BadgeProps> = ({ children, className, variant = 'primary', ...props }) => {
  const styles = {
    primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300',
    secondary: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200',
    accent: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300',
    danger: 'bg-rose-100 text-rose-800 dark:bg-rose-900/50 dark:text-rose-300',
    warning: 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300',
    outline: 'border border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300',
  };

  return (
    <span
      className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors', styles[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
};
