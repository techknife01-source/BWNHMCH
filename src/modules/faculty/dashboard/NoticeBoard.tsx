import React, { useState, useEffect } from 'react';
import { Bell, Pin, FileText, Plus, ChevronRight, Paperclip } from 'lucide-react';
import { WidgetContainer } from './components/WidgetContainer';
import { noticeService } from '../../../services/noticeService';
import { NoticeItem } from '../../../types/notice';
import { NoticeDetailModal } from '../../../components/notice/NoticeDetailModal';
import { NoticeFormModal } from '../../../components/notice/NoticeFormModal';

export const NoticeBoard: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [notices, setNotices] = useState<NoticeItem[]>([]);
  const [selectedNotice, setSelectedNotice] = useState<NoticeItem | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState<NoticeItem | null>(null);

  const categories = ['ALL', 'ACADEMIC', 'EXAM', 'HOSPITAL', 'RESEARCH', 'GENERAL'];

  const loadNotices = () => {
    const res = noticeService.getNotices({
      role: 'FACULTY',
      category: selectedCategory,
      pageSize: 5,
    });
    setNotices(res.data);
  };

  useEffect(() => {
    loadNotices();
  }, [selectedCategory]);

  return (
    <WidgetContainer
      title="Departmental & Academic Notice Board"
      subtitle="Official notices, circulars & hospital directives"
      icon={Bell}
      iconColorClass="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60"
      isEmpty={notices.length === 0}
      emptyMessage={`No notices found in category "${selectedCategory}".`}
    >
      <div className="space-y-3">
        {/* Category Filters & Add Action */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-1.5">
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

          <button
            onClick={() => {
              setNoticeToEdit(null);
              setIsCreateModalOpen(true);
            }}
            className="px-2.5 py-1 bg-[#002147] hover:bg-slate-800 text-white text-3xs font-bold rounded-lg transition shrink-0 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3 h-3 text-[#00A651]" /> New Notice
          </button>
        </div>

        {/* List of Notices */}
        <div className="space-y-2.5">
          {notices.map((notice) => {
            const isRead = noticeService.isNoticeRead(notice.id);
            return (
              <div
                key={notice.id}
                onClick={() => {
                  noticeService.markNoticeAsRead(notice.id);
                  setSelectedNotice(notice);
                }}
                className={`p-3 rounded-xl border transition cursor-pointer hover:border-amber-400 ${
                  notice.isImportant
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/40'
                    : isRead
                    ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-100 dark:border-slate-800'
                    : 'bg-blue-50/40 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {!isRead && <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />}
                    {notice.isImportant && (
                      <Pin className="w-3.5 h-3.5 text-amber-600 shrink-0 fill-amber-600 rotate-45" />
                    )}
                    <span className="text-3xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-400">
                      {notice.category}
                    </span>
                    <span className="text-3xs font-bold text-slate-400">• {notice.department}</span>
                  </div>
                  <span className="text-3xs font-semibold text-slate-400 shrink-0">
                    {notice.publishedDate}
                  </span>
                </div>

                <h5 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1 leading-snug">
                  {notice.title}
                </h5>

                {notice.summary && (
                  <p className="text-3xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 font-medium">
                    {notice.summary}
                  </p>
                )}

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-3xs">
                  <span className="font-bold text-slate-500">From: {notice.author}</span>
                  {notice.attachments && notice.attachments.length > 0 && (
                    <span className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <Paperclip className="w-3 h-3" /> {notice.attachments.length} Document(s)
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Detail Modal */}
      <NoticeDetailModal
        isOpen={!!selectedNotice}
        onClose={() => setSelectedNotice(null)}
        notice={selectedNotice}
        currentRole="FACULTY"
        onEdit={(n) => {
          setNoticeToEdit(n);
          setIsCreateModalOpen(true);
        }}
        onDelete={(id) => {
          noticeService.deleteNotice(id);
          loadNotices();
        }}
      />

      {/* Form Modal */}
      <NoticeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        noticeToEdit={noticeToEdit}
        onSave={(data) => {
          if (noticeToEdit) {
            noticeService.updateNotice(noticeToEdit.id, data);
          } else {
            noticeService.createNotice(data);
          }
          loadNotices();
        }}
        currentRole="FACULTY"
      />
    </WidgetContainer>
  );
};
