import React from 'react';
import { cn } from '../../lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glassmorphism?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, className, glassmorphism = false, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900',
        glassmorphism && 'bg-white/70 backdrop-blur-md dark:bg-slate-900/70',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
