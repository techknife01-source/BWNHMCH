import React, { useState } from 'react';
import { Bell, X, CheckCheck, Filter, Search, GraduationCap, Building2, Stethoscope, FlaskConical, Library, ShieldAlert, ArrowRight, RefreshCw, Trash2 } from 'lucide-react';
import { useNotificationCenter, NotificationCategory, NotificationPriority } from '../hooks/useNotificationCenter';
import { useNavigate } from 'react-router-dom';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({ isOpen, onClose }) => {
  const {
    notifications,
    unreadCount,
    totalFilteredCount,
    hasMore,
    searchQuery,
    setSearchQuery,
    categoryFilter,
    setCategoryFilter,
    priorityFilter,
    setPriorityFilter,
    dateRangeFilter,
    setDateRangeFilter,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    loadMore,
    resetFilters,
  } = useNotificationCenter();

  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleSimulateRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    setTimeout(() => {
      setIsLoading(false);
    }, 600);
  };

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'Academic': return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'Department': return <Building2 className="w-4 h-4 text-purple-500" />;
      case 'Hospital': return <Stethoscope className="w-4 h-4 text-teal-500" />;
      case 'Research': return <FlaskConical className="w-4 h-4 text-amber-500" />;
      case 'Library': return <Library className="w-4 h-4 text-emerald-500" />;
      case 'System': return <ShieldAlert className="w-4 h-4 text-slate-500" />;
    }
  };

  const getPriorityBadge = (priority: NotificationPriority) => {
    switch (priority) {
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-full text-3xs font-black uppercase bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 border border-rose-200">Critical</span>;
      case 'High':
        return <span className="px-2 py-0.5 rounded-full text-3xs font-black uppercase bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200">High</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-3xs font-black uppercase bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">Medium</span>;
      case 'Low':
        return <span className="px-2 py-0.5 rounded-full text-3xs font-black uppercase bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">Low</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400 relative">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              )}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                Faculty Notification Center
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-3xs font-black bg-rose-500 text-white">
                    {unreadCount} Unread
                  </span>
                )}
              </h3>
              <p className="text-2xs text-slate-500 dark:text-slate-400">
                Official academic alerts, department circulars, and hospital duty updates
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition flex items-center gap-1.5 cursor-pointer"
              >
                <CheckCheck className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}

            <button
              onClick={handleSimulateRefresh}
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              title="Refresh notifications"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-emerald-600' : ''}`} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter Controls Row */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 space-y-3 bg-white dark:bg-slate-900">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notifications..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-2.5 py-1.5 text-2xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Categories</option>
                <option value="Academic">Academic</option>
                <option value="Department">Department</option>
                <option value="Hospital">Hospital</option>
                <option value="Research">Research</option>
                <option value="Library">Library</option>
                <option value="System">System</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="px-2.5 py-1.5 text-2xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={dateRangeFilter}
                onChange={(e) => setDateRangeFilter(e.target.value)}
                className="px-2.5 py-1.5 text-2xs font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
              >
                <option value="All">All Dates</option>
                <option value="Today">Today Only</option>
              </select>

              <button
                onClick={resetFilters}
                className="px-2.5 py-1.5 text-3xs font-black uppercase text-slate-500 hover:text-rose-600 shrink-0 cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Notifications Body List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {isLoading ? (
            <div className="py-12 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
              <p className="text-xs font-bold text-slate-500">Loading notifications...</p>
            </div>
          ) : hasError ? (
            <div className="p-6 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900 text-center space-y-2">
              <p className="text-xs font-extrabold text-rose-700 dark:text-rose-300">
                Failed to load notification updates
              </p>
              <button
                onClick={handleSimulateRefresh}
                className="px-3 py-1.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
              >
                Retry
              </button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="space-y-3">
              {notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition space-y-2 relative group ${
                    !item.read
                      ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-300/80 dark:border-emerald-800'
                      : 'bg-white dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-2xs">
                        {getCategoryIcon(item.category)}
                      </span>
                      <span className="text-3xs font-black uppercase tracking-wider text-slate-500">
                        {item.category}
                      </span>
                      {getPriorityBadge(item.priority)}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-3xs text-slate-400 font-medium">{item.time}</span>
                      <button
                        onClick={() => deleteNotification(item.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition cursor-pointer"
                        title="Delete notification"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">
                      {item.desc}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    {item.actionUrl ? (
                      <button
                        onClick={() => {
                          markAsRead(item.id);
                          navigate(item.actionUrl!);
                          onClose();
                        }}
                        className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                      >
                        <span>{item.actionLabel || 'View Details'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : <span />}

                    {!item.read && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="text-3xs font-extrabold uppercase text-slate-500 hover:text-emerald-600 cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {hasMore && (
                <div className="pt-2 text-center">
                  <button
                    onClick={loadMore}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 transition cursor-pointer"
                  >
                    Load More Notifications ({totalFilteredCount - notifications.length} remaining)
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center space-y-2">
              <Bell className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                No notifications match your current filter criteria
              </p>
              <p className="text-3xs text-slate-400">
                Try clearing filters or search query to view all circulars.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>
            Total Filtered: <strong className="text-slate-800 dark:text-slate-200">{totalFilteredCount}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 hover:bg-slate-300 transition cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
