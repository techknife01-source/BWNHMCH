import React, { useState } from 'react';
import { Bell, Pin, ArrowUpRight, FileText, ChevronRight } from 'lucide-react';
import { useDepartmentNotices } from './hooks/useFacultyDashboardHooks';
import { WidgetContainer } from './components/WidgetContainer';

export const NoticeBoard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const { notices, isLoading, isError, error, refetch } = useDepartmentNotices();

  const categories = ['All', 'Department', 'Academic', 'Hospital', 'Research'];

  const filteredNotices = notices.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  return (
    <WidgetContainer
      title="Departmental & Academic Notice Board"
      subtitle="Official notices, circulars & hospital directives"
      icon={Bell}
      iconColorClass="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60"
      isLoading={isLoading}
      isError={isError}
      error={error}
      isEmpty={filteredNotices.length === 0}
      emptyMessage={`No notices found in category "${selectedCategory}".`}
      onRetry={refetch}
    >
      <div className="space-y-3">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-3xs font-extrabold rounded-lg whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-2xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* List of Notices */}
        <div className="space-y-2.5">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              className={`p-3 rounded-xl border transition ${
                notice.pinned
                  ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  {notice.pinned && (
                    <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0 fill-amber-600 rotate-45" />
                  )}
                  <span className="text-3xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    {notice.category}
                  </span>
                </div>
                <span className="text-3xs font-semibold text-slate-400 shrink-0">
                  {notice.date}
                </span>
              </div>

              <h5 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 leading-snug">
                {notice.title}
              </h5>

              <p className="text-3xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                {notice.desc}
              </p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-3xs">
                <span className="font-bold text-slate-500">From: {notice.sender}</span>
                {notice.attachmentUrl && (
                  <a
                    href={notice.attachmentUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3" /> View Document
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </WidgetContainer>
  );
};
