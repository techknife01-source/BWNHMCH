import React, { useState, useEffect } from 'react';
import { noticeService } from '../../../services/noticeService';
import { NoticeItem, NoticeStatus } from '../../../types/notice';
import { Card } from '../../../components/common/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { isSuperAdmin, isAdmin, isPrincipal, isVicePrincipal } from '../../../utils/permissionHelper';
import { NoticeFormModal } from '../../../components/notice/NoticeFormModal';
import { NoticeDetailModal } from '../../../components/notice/NoticeDetailModal';
import {
  Pin,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  Calendar,
  Clock,
  Paperclip,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  FileText,
  ShieldAlert,
  Sparkles,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Send,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const NoticeBoardManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized = isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'IMPORTANT' | 'NORMAL'>('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [noticeData, setNoticeData] = useState(() =>
    noticeService.getNotices({
      search,
      status: statusFilter,
      priority: priorityFilter,
      role: isAuthorized ? 'ADMIN' : 'STUDENT',
      page,
      pageSize,
    })
  );

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [viewNoticeDetail, setViewNoticeDetail] = useState<NoticeItem | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id?: string; bulk?: boolean } | null>(null);

  const loadData = () => {
    const res = noticeService.getNotices({
      search,
      status: statusFilter,
      priority: priorityFilter,
      role: isAuthorized ? 'ADMIN' : 'STUDENT',
      page,
      pageSize,
    });
    setNoticeData(res);
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter, priorityFilter, page, pageSize, isAuthorized]);

  const toggleSelectAll = () => {
    if (selectedIds.length === noticeData.data.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(noticeData.data.map((n) => n.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSaveNotice = (data: Partial<NoticeItem>) => {
    if (!isAuthorized) {
      toast.error('Permission denied.');
      return;
    }
    if (editingNotice) {
      noticeService.updateNotice(editingNotice.id, data);
    } else {
      noticeService.createNotice(data);
    }
    setIsFormModalOpen(false);
    setEditingNotice(null);
    loadData();
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmTarget) return;
    if (deleteConfirmTarget.bulk) {
      noticeService.bulkDeleteNotices(selectedIds);
      setSelectedIds([]);
    } else if (deleteConfirmTarget.id) {
      noticeService.deleteNotice(deleteConfirmTarget.id);
    }
    setDeleteConfirmTarget(null);
    loadData();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 text-[#00A651] rounded-2xl">
              <Pin className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Institutional Notice Board Control
            </h2>
            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-2xs rounded-full">
              {noticeData.total} Live Board Entries
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pin top priority items, manage scheduled publishing, attach PDFs/images, and toggle public board status.
          </p>
        </div>

        {isAuthorized ? (
          <button
            onClick={() => {
              setEditingNotice(null);
              setIsFormModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Notice Board Entry
          </button>
        ) : (
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 rounded-xl text-2xs font-extrabold flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" /> Read-Only Mode
          </div>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="relative md:col-span-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search notice board items..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#00A651]"
            />
          </div>

          <div>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Board Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft / Unpublished</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>

          <div>
            <select
              value={priorityFilter}
              onChange={(e) => {
                setPriorityFilter(e.target.value as any);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              <option value="ALL">All Priorities</option>
              <option value="IMPORTANT">Pinned / High Priority Only</option>
              <option value="NORMAL">Standard Priority</option>
            </select>
          </div>
        </div>

        {isAuthorized && selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-2xl">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  noticeService.bulkPublishNotices(selectedIds);
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl cursor-pointer"
              >
                Publish Selected
              </button>
              <button
                onClick={() => setDeleteConfirmTarget({ bulk: true })}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xs rounded-xl cursor-pointer"
              >
                Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notice Board Items Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {noticeData.data.map((notice) => {
          const isSelected = selectedIds.includes(notice.id);
          const hasAttachment = notice.attachments && notice.attachments.length > 0;

          return (
            <Card
              key={notice.id}
              className={`p-5 space-y-3 border transition rounded-3xl relative ${
                notice.isImportant
                  ? 'border-emerald-500 ring-1 ring-emerald-500/30 bg-emerald-50/10'
                  : 'border-slate-200/80 dark:border-slate-800'
              } ${isSelected ? 'ring-2 ring-emerald-400' : ''}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {isAuthorized && (
                    <button onClick={() => toggleSelectOne(notice.id)} className="text-slate-400">
                      {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                    </button>
                  )}
                  <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {notice.category}
                  </span>
                  {notice.isImportant && (
                    <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center gap-1">
                      <Pin className="w-3 h-3" /> Pinned
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                      notice.status === 'PUBLISHED'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {notice.status}
                  </span>
                </div>
              </div>

              <h3
                onClick={() => setViewNoticeDetail(notice)}
                className="text-sm font-extrabold text-slate-900 dark:text-white hover:text-emerald-600 transition cursor-pointer line-clamp-2"
              >
                {notice.title}
              </h3>

              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {notice.summary}
              </p>

              {hasAttachment && (
                <div className="flex items-center gap-2 text-2xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/60 dark:bg-emerald-950/40 p-2 rounded-xl">
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{notice.attachments!.length} File Attachment(s) (PDF / Documents)</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-2xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <span>{notice.publishedDate}</span>
                </div>

                {isAuthorized && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => noticeService.togglePin(notice.id)}
                      className={`p-1 rounded-lg ${
                        notice.isImportant ? 'text-rose-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                      title={notice.isImportant ? 'Unpin' : 'Pin to Notice Board'}
                    >
                      <Pin className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setEditingNotice(notice);
                        setIsFormModalOpen(true);
                      }}
                      className="p-1 text-blue-600 rounded-lg hover:bg-blue-50"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmTarget({ id: notice.id })}
                      className="p-1 text-rose-600 rounded-lg hover:bg-rose-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {noticeData.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page {noticeData.page} of {noticeData.totalPages}
          </span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page >= noticeData.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-100 dark:bg-slate-800 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      {isFormModalOpen && (
        <NoticeFormModal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingNotice(null);
          }}
          onSubmit={handleSaveNotice}
          initialData={editingNotice}
        />
      )}

      {viewNoticeDetail && (
        <NoticeDetailModal
          isOpen={!!viewNoticeDetail}
          onClose={() => setViewNoticeDetail(null)}
          notice={viewNoticeDetail}
        />
      )}

      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Are you sure you want to delete the selected notice board entry?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
