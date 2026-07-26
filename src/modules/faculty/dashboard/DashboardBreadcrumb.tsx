import React from 'react';
import { Home, ChevronRight, RefreshCw, Calendar, Search, LayoutGrid, Settings, Bell } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
  onOpenSearch?: () => void;
  onOpenCalendar?: () => void;
  onOpenNotificationCenter?: () => void;
  onOpenCustomizer?: () => void;
  onOpenSettings?: () => void;
}

export const DashboardBreadcrumb: React.FC<BreadcrumbProps> = ({
  onRefresh,
  isRefreshing,
  onOpenSearch,
  onOpenCalendar,
  onOpenNotificationCenter,
  onOpenCustomizer,
  onOpenSettings,
}) => {
  const location = useLocation();
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const currentSegment = pathSegments[pathSegments.length - 1] || 'dashboard';

  return (
    <nav
      aria-label="Breadcrumb Navigation"
      className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-2xs"
    >
      <ol className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
        <li>
          <Link
            to="/faculty/dashboard"
            className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition"
          >
            <Home className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Faculty Portal</span>
          </Link>
        </li>
        <li>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </li>
        <li className="text-slate-900 dark:text-slate-100 font-extrabold capitalize" aria-current="page">
          {currentSegment.replace('-', ' ')}
        </li>
      </ol>

      <div className="flex flex-wrap items-center gap-2">
        {onOpenSearch && (
          <button
            onClick={onOpenSearch}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Search (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Quick Search</span>
            <kbd className="hidden lg:inline text-[9px] font-mono px-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">Cmd+K</kbd>
          </button>
        )}

        {onOpenCalendar && (
          <button
            onClick={onOpenCalendar}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Calendar"
          >
            <Calendar className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        )}

        {onOpenNotificationCenter && (
          <button
            onClick={onOpenNotificationCenter}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span className="hidden sm:inline">Alerts</span>
          </button>
        )}

        {onOpenCustomizer && (
          <button
            onClick={onOpenCustomizer}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Layout Customizer"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span className="hidden sm:inline">Customize</span>
          </button>
        )}

        {onOpenSettings && (
          <button
            onClick={onOpenSettings}
            className="px-3 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            title="Settings"
          >
            <Settings className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        )}

        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-3 py-1 bg-[#002147] hover:bg-[#003366] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            aria-label="Refresh Dashboard Data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-emerald-400' : ''}`} />
            <span className="hidden xs:inline">Sync</span>
          </button>
        )}
      </div>
    </nav>
  );
};
