import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, className, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex items-center space-x-2.5">
        <input
          id={inputId}
          ref={ref}
          type="radio"
          className={cn(
            'h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-slate-700 dark:bg-slate-900',
            className
          )}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300 select-none">
            {label}
          </label>
        )}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
