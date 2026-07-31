import React, { useState, useEffect } from 'react';
import { noticeService } from '../../../services/noticeService';
import { NoticeItem, NoticeCategory, NoticeStatus } from '../../../types/notice';
import { Card } from '../../../components/common/Card';
import { useAuth } from '../../../contexts/AuthContext';
import { isSuperAdmin, isAdmin, isPrincipal, isVicePrincipal, getUserDisplayDesignation } from '../../../utils/permissionHelper';
import { NoticeFormModal } from '../../../components/notice/NoticeFormModal';
import { NoticeDetailModal } from '../../../components/notice/NoticeDetailModal';
import {
  Bell,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Pin,
  FileText,
  Download,
  FileSpreadsheet,
  CheckSquare,
  Square,
  Eye,
  X,
  ShieldAlert,
  Archive,
  Paperclip,
  Calendar,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

export const NoticeManagementPanel: React.FC = () => {
  const { user } = useAuth();
  const isAuthorized = isSuperAdmin(user) || isAdmin(user) || isPrincipal(user) || isVicePrincipal(user);

  // Search & Filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState<'ALL' | 'IMPORTANT' | 'NORMAL'>('ALL');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [noticeData, setNoticeData] = useState(() =>
    noticeService.getNotices({
      search,
      category: categoryFilter,
      status: statusFilter,
      priority: priorityFilter,
      role: isAuthorized ? 'ADMIN' : 'STUDENT',
      page,
      pageSize,
    })
  );

  // Selection & Bulk
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCategory, setBulkCategory] = useState<NoticeCategory>('ACADEMIC');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState<NoticeItem | null>(null);
  const [viewNoticeDetail, setViewNoticeDetail] = useState<NoticeItem | null>(null);
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{ id?: string; bulk?: boolean } | null>(null);

  const loadData = () => {
    const res = noticeService.getNotices({
      search,
      category: categoryFilter,
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
  }, [search, categoryFilter, statusFilter, priorityFilter, page, pageSize, isAuthorized]);

  const categories = ['ALL', 'ACADEMIC', 'EXAM', 'HOSPITAL', 'ADMISSION', 'ADMINISTRATIVE', 'RESEARCH', 'GENERAL'];

  // Checkbox handlers
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
      toast.error('Permission denied: Authorized role required.');
      return;
    }
    if (editingNotice) {
      noticeService.updateNotice(editingNotice.id, data);
    } else {
      noticeService.createNotice({
        ...data,
        author: user?.fullName || getUserDisplayDesignation(user),
        authorRole: getUserDisplayDesignation(user),
      });
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

  const handleExport = () => {
    const jsonStr = noticeService.exportNotices(selectedIds.length > 0 ? selectedIds : undefined);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BHMCH_Notices_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    toast.success('Notices exported successfully!');
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      noticeService.importNotices(content);
      loadData();
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2.5 bg-emerald-50 dark:bg-emerald-950/80 text-[#00A651] rounded-2xl">
              <Bell className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Official Notice & Gazette Management
            </h2>
            <span className="px-2.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-extrabold text-2xs rounded-full">
              {noticeData.total} Total Notices
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Create academic circulars, pin important directives, attach PDFs/images & schedule publication dates.
          </p>
        </div>

        {isAuthorized ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setEditingNotice(null);
                setIsFormModalOpen(true);
              }}
              className="px-4 py-2.5 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Notice
            </button>
            <button
              onClick={handleExport}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export
            </button>
            <label className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-2xl transition flex items-center gap-1.5 cursor-pointer">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Import
              <input type="file" accept=".json" onChange={handleImport} className="hidden" />
            </label>
          </div>
        ) : (
          <div className="px-3 py-1.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 rounded-xl text-2xs font-extrabold flex items-center gap-1">
            <ShieldAlert className="w-4 h-4" /> View Only Mode
          </div>
        )}
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by notice no, title, author, content..."
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
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold"
            >
              {categories.map((c) => (
                <option key={c} value={c}>{c === 'ALL' ? 'All Categories' : c}</option>
              ))}
            </select>
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
              <option value="ALL">All Statuses</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
              <option value="SCHEDULED">Scheduled</option>
            </select>
          </div>
        </div>

        {/* Bulk Action Toolbar */}
        {isAuthorized && selectedIds.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-emerald-50/50 dark:bg-emerald-950/20 p-3 rounded-2xl">
            <span className="text-xs font-black text-emerald-800 dark:text-emerald-300">
              {selectedIds.length} notice(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => {
                  noticeService.bulkPublishNotices(selectedIds);
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-xl transition cursor-pointer"
              >
                Publish Selected
              </button>
              <button
                onClick={() => {
                  noticeService.bulkArchiveNotices(selectedIds);
                  setSelectedIds([]);
                  loadData();
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-2xs rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Archive className="w-3.5 h-3.5" /> Archive Selected
              </button>
              <div className="flex items-center gap-1">
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value as NoticeCategory)}
                  className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-300 text-xs font-bold rounded-lg"
                >
                  {categories.filter((c) => c !== 'ALL').map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    noticeService.bulkCategoryUpdateNotices(selectedIds, bulkCategory);
                    setSelectedIds([]);
                    loadData();
                  }}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-2xs rounded-xl"
                >
                  Move Category
                </button>
              </div>
              <button
                onClick={() => setDeleteConfirmTarget({ bulk: true })}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-2xs rounded-xl transition flex items-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Selected
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notices Table / List */}
      <div className="space-y-3">
        {noticeData.data.map((notice) => {
          const isSelected = selectedIds.includes(notice.id);
          return (
            <Card
              key={notice.id}
              className={`p-5 space-y-3 border transition rounded-3xl ${
                notice.isImportant
                  ? 'border-emerald-500/80 bg-emerald-50/10 dark:bg-emerald-950/10'
                  : 'border-slate-200/80 dark:border-slate-800'
              } ${isSelected ? 'ring-2 ring-emerald-400/50 bg-emerald-50/20' : ''}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  {isAuthorized && (
                    <button
                      onClick={() => toggleSelectOne(notice.id)}
                      className="mt-1 p-1 text-slate-400 hover:text-emerald-600 cursor-pointer"
                    >
                      {isSelected ? <CheckSquare className="w-4 h-4 text-emerald-600" /> : <Square className="w-4 h-4" />}
                    </button>
                  )}

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-2xs font-mono font-bold text-slate-400">{notice.noticeNo}</span>
                      <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {notice.category}
                      </span>
                      {notice.isImportant && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center gap-1">
                          <Pin className="w-3 h-3" /> PINNED
                        </span>
                      )}
                      <span
                        className={`px-2 py-0.5 text-[10px] font-extrabold rounded-full ${
                          notice.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : notice.status === 'ARCHIVED'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800'
                        }`}
                      >
                        {notice.status}
                      </span>
                    </div>

                    <h3
                      onClick={() => setViewNoticeDetail(notice)}
                      className="text-sm font-extrabold text-slate-900 dark:text-white hover:text-emerald-600 transition cursor-pointer"
                    >
                      {notice.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notice.summary}</p>
                  </div>
                </div>

                {/* Right Meta & Actions */}
                <div className="flex sm:flex-col items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 dark:border-slate-800 shrink-0">
                  <div className="text-[10px] text-slate-400 text-right">
                    <div>Date: <span className="font-bold text-slate-600 dark:text-slate-300">{notice.publishedDate}</span></div>
                    {notice.expiryDate && (
                      <div className="text-amber-600 font-bold">Expires: {notice.expiryDate}</div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setViewNoticeDetail(notice)}
                      className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-xl cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {isAuthorized && (
                      <>
                        <button
                          onClick={() => noticeService.togglePin(notice.id)}
                          className={`p-1.5 rounded-xl transition cursor-pointer ${
                            notice.isImportant
                              ? 'text-rose-600 bg-rose-50 dark:bg-rose-950/50'
                              : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                          }`}
                          title={notice.isImportant ? 'Unpin' : 'Pin to Top'}
                        >
                          <Pin className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingNotice(notice);
                            setIsFormModalOpen(true);
                          }}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-xl cursor-pointer"
                          title="Edit Notice"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmTarget({ id: notice.id })}
                          className="p-1.5 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-xl cursor-pointer"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Pagination Footer */}
      {noticeData.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span className="text-xs text-slate-500">
            Page {noticeData.page} of {noticeData.totalPages} ({noticeData.total} items)
          </span>
          <div className="flex items-center gap-2">
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

      {/* MODAL 1: Form Create/Edit Modal */}
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

      {/* MODAL 2: Detail View Modal */}
      {viewNoticeDetail && (
        <NoticeDetailModal
          isOpen={!!viewNoticeDetail}
          onClose={() => setViewNoticeDetail(null)}
          notice={viewNoticeDetail}
        />
      )}

      {/* MODAL 3: Delete Confirmation */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <Trash2 className="w-6 h-6" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Confirm Deletion</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {deleteConfirmTarget.bulk
                ? `Are you sure you want to permanently delete ${selectedIds.length} selected notice(s)?`
                : 'Are you sure you want to delete this notice?'}
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md cursor-pointer"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
