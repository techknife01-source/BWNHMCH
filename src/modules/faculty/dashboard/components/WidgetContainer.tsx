import React from 'react';
import { AlertTriangle, RefreshCw, Inbox, LucideIcon } from 'lucide-react';

interface WidgetContainerProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColorClass?: string;
  headerAction?: React.ReactNode;
  isLoading?: boolean;
  isError?: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  children: React.ReactNode;
  className?: string;
}

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  title,
  subtitle,
  icon: Icon,
  iconColorClass = 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60',
  headerAction,
  isLoading = false,
  isError = false,
  error,
  isEmpty = false,
  emptyMessage = 'No data available at this time.',
  onRetry,
  children,
  className = '',
}) => {
  return (
    <div className={`p-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className={`p-2 rounded-xl ${iconColorClass} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div className="min-w-0">
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate">
              {title}
            </h4>
            {subtitle && (
              <p className="text-2xs text-slate-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>

        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {/* Content Area Handling States */}
      {isLoading ? (
        <div className="space-y-3 py-2 animate-pulse">
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-md w-3/4" />
          <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full" />
          <div className="h-12 bg-slate-100 dark:bg-slate-800/60 rounded-xl w-full" />
        </div>
      ) : isError ? (
        <div className="p-4 rounded-xl bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 space-y-2 text-center">
          <div className="flex items-center justify-center gap-2 text-rose-700 dark:text-rose-400 font-extrabold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Unable to load {title}</span>
          </div>
          <p className="text-3xs text-rose-600 dark:text-rose-300">
            {error?.message || 'A network error occurred while reaching the server.'}
          </p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-1 px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-3xs font-extrabold transition inline-flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Retry
            </button>
          )}
        </div>
      ) : isEmpty ? (
        <div className="py-8 text-center space-y-2">
          <Inbox className="w-8 h-8 text-slate-300 dark:text-slate-700 mx-auto" />
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{emptyMessage}</p>
        </div>
      ) : (
        children
      )}
    </div>
  );
};
