import React, { useState, useEffect } from 'react';
import { NoticeItem, NoticeCategory, NoticeStatus, NoticeUserRole } from '../../types/notice';
import { noticeService } from '../../services/noticeService';
import { NoticeFormModal } from './NoticeFormModal';
import { NoticeDetailModal } from './NoticeDetailModal';
import { SearchBar } from '../common/SearchBar';
import { Badge } from '../common/Badge';
import {
  Bell,
  Plus,
  Filter,
  Pin,
  FileText,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Building2,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Archive,
  Send,
  FileCode,
  ShieldCheck,
  Paperclip,
  Clock,
  Layers,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NoticeBoardViewProps {
  initialRole?: NoticeUserRole;
  departmentScope?: string;
  isWidget?: boolean;
}

export const NoticeBoardView: React.FC<NoticeBoardViewProps> = ({
  initialRole = 'STUDENT',
  departmentScope = 'All',
  isWidget = false,
}) => {
  const [currentRole, setCurrentRole] = useState<NoticeUserRole>(initialRole);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState<string>(departmentScope);
  const [selectedPriority, setSelectedPriority] = useState<'ALL' | 'IMPORTANT' | 'NORMAL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);

  const [noticeData, setNoticeData] = useState({
    data: [] as NoticeItem[],
    total: 0,
    page: 1,
    pageSize: 6,
    totalPages: 1,
  });

  const [unreadCount, setUnreadCount] = useState(0);

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [noticeToEdit, setNoticeToEdit] = useState<NoticeItem | null>(null);
  const [selectedNoticeForDetail, setSelectedNoticeForDetail] = useState<NoticeItem | null>(null);

  const loadNotices = () => {
    const res = noticeService.getNotices({
      search,
      category: selectedCategory,
      department: selectedDepartment,
      priority: selectedPriority,
      status: selectedStatus,
      role: currentRole,
      page,
      pageSize,
    });
    setNoticeData(res);

    // Calculate unread count
    const unread = res.data.filter((n) => !noticeService.isNoticeRead(n.id)).length;
    setUnreadCount(unread);
  };

  useEffect(() => {
    loadNotices();
  }, [search, selectedCategory, selectedDepartment, selectedPriority, selectedStatus, currentRole, page, pageSize]);

  const handleOpenDetail = (notice: NoticeItem) => {
    noticeService.markNoticeAsRead(notice.id);
    const updated = noticeService.getNoticeById(notice.id);
    setSelectedNoticeForDetail(updated || notice);
    loadNotices();
  };

  const handleCreateOrUpdateNotice = (data: Partial<NoticeItem>) => {
    if (noticeToEdit) {
      noticeService.updateNotice(noticeToEdit.id, data);
    } else {
      noticeService.createNotice(data);
    }
    loadNotices();
  };

  const handleDeleteNotice = (id: string) => {
    if (window.confirm('Are you sure you want to delete this official notice?')) {
      noticeService.deleteNotice(id);
      loadNotices();
    }
  };

  const handleTogglePin = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    noticeService.togglePin(id);
    loadNotices();
  };

  const handleChangeStatus = (e: React.MouseEvent, id: string, newStatus: NoticeStatus) => {
    e.stopPropagation();
    noticeService.changeStatus(id, newStatus);
    loadNotices();
  };

  const categories = ['ALL', 'ACADEMIC', 'EXAM', 'HOSPITAL', 'ADMISSION', 'ADMINISTRATIVE', 'RESEARCH', 'GENERAL'];

  const departmentsList = [
    'All',
    'Practice of Medicine',
    'Organon of Medicine',
    'Homoeopathic Materia Medica',
    'Repertory',
    'Pharmacy',
    'Anatomy',
    'Physiology',
    'Pathology',
    'Forensic Medicine',
    'Gynaecology & Obstetrics',
    'Surgery',
    'Community Medicine',
  ];

  return (
    <div className="space-y-6">
      {/* Role Switcher & Header Bar */}
      {!isWidget && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 rounded-xl">
                <Bell className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Institutional Notice Board & Official Gazette
              </h2>
              {unreadCount > 0 && (
                <span className="px-2.5 py-0.5 bg-rose-500 text-white font-black text-xs rounded-full animate-bounce">
                  {unreadCount} Unread
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Official notifications, academic circulars, examination routines & hospital directives
            </p>
          </div>

          {/* Role Selector Toolbar for Testing */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-bold">
              <span className="text-[10px] uppercase text-slate-400 font-extrabold px-2">Role:</span>
              {(['ADMIN', 'PRINCIPAL', 'HOD', 'FACULTY', 'STUDENT'] as NoticeUserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => {
                    setCurrentRole(r);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer text-2xs ${
                    currentRole === r
                      ? 'bg-[#002147] text-white shadow-xs font-black'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>

            {noticeService.canManageNotices(currentRole) && (
              <button
                onClick={() => {
                  setNoticeToEdit(null);
                  setIsCreateModalOpen(true);
                }}
                className="px-4 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-2xl shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Notice</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setSelectedCategory(cat);
                setPage(1);
              }}
              className={`px-3.5 py-1.5 text-xs font-extrabold rounded-xl transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search & Dropdown Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="sm:col-span-2">
            <SearchBar
              value={search}
              onChange={(val) => {
                setSearch(val);
                setPage(1);
              }}
              placeholder="Search by keyword, notice no, or author..."
              className="w-full bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700"
            />
          </div>

          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                setPage(1);
              }}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="All">All Departments</option>
              {departmentsList.filter((d) => d !== 'All').map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={selectedPriority}
              onChange={(e) => {
                setSelectedPriority(e.target.value as any);
                setPage(1);
              }}
              className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs font-bold text-slate-800 dark:text-slate-200"
            >
              <option value="ALL">All Priorities</option>
              <option value="IMPORTANT">Urgent / Pinned Only</option>
              <option value="NORMAL">Normal Priority</option>
            </select>
          </div>
        </div>

        {/* Management Status Filters (For Faculty/Admin/HOD) */}
        {currentRole !== 'STUDENT' && (
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-slate-500 text-2xs uppercase">Status:</span>
            {['ALL', 'PUBLISHED', 'DRAFT', 'SCHEDULED', 'ARCHIVED'].map((st) => (
              <button
                key={st}
                onClick={() => {
                  setSelectedStatus(st);
                  setPage(1);
                }}
                className={`px-2.5 py-1 rounded-lg text-2xs font-extrabold transition cursor-pointer ${
                  selectedStatus === st
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Notice List Cards */}
      {noticeData.data.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Bell className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">No notices found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            No notices match your selected filters. Try adjusting search keywords or category filters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {noticeData.data.map((notice) => {
            const isRead = noticeService.isNoticeRead(notice.id);

            return (
              <div
                key={notice.id}
                onClick={() => handleOpenDetail(notice)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer relative hover:shadow-md ${
                  notice.isImportant
                    ? 'bg-amber-50/40 dark:bg-amber-950/20 border-amber-300 dark:border-amber-800/60'
                    : isRead
                    ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                    : 'bg-blue-50/30 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                  <div className="flex flex-wrap items-center gap-2">
                    {!isRead && (
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" title="Unread Notice" />
                    )}

                    <span className="text-[10px] font-mono font-bold text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {notice.noticeNo}
                    </span>

                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      {notice.category}
                    </span>

                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {notice.department}
                    </span>

                    {notice.isImportant && (
                      <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded uppercase flex items-center gap-1">
                        <Pin className="w-3 h-3 fill-white rotate-45" /> Pinned
                      </span>
                    )}

                    {currentRole !== 'STUDENT' && (
                      <span
                        className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded ${
                          notice.status === 'PUBLISHED'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : notice.status === 'DRAFT'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {notice.status}
                      </span>
                    )}
                  </div>

                  <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> {notice.publishedDate}
                  </span>
                </div>

                <div className="space-y-1.5 mt-2">
                  <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                    {notice.title}
                  </h3>
                  {notice.summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 font-medium">
                      {notice.summary}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 text-xs">
                  <div className="flex items-center gap-2 text-slate-500 font-medium">
                    <span>Issued By: <strong className="text-slate-800 dark:text-slate-200">{notice.author}</strong></span>
                    {notice.attachments && notice.attachments.length > 0 && (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-lg">
                        <Paperclip className="w-3 h-3" /> {notice.attachments.length} Attachment(s)
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1">
                    {noticeService.canManageNotices(currentRole) && (
                      <>
                        <button
                          onClick={(e) => handleTogglePin(e, notice.id)}
                          className={`p-1.5 rounded-lg transition cursor-pointer ${
                            notice.isImportant ? 'text-amber-600 bg-amber-100 dark:bg-amber-950' : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title="Pin/Unpin Notice"
                        >
                          <Pin className="w-4 h-4 rotate-45" />
                        </button>

                        {notice.status === 'DRAFT' && (
                          <button
                            onClick={(e) => handleChangeStatus(e, notice.id, 'PUBLISHED')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-2xs rounded-lg transition cursor-pointer flex items-center gap-1"
                            title="Publish Draft Notice"
                          >
                            <Send className="w-3 h-3" /> Publish
                          </button>
                        )}

                        {notice.status === 'PUBLISHED' && (
                          <button
                            onClick={(e) => handleChangeStatus(e, notice.id, 'ARCHIVED')}
                            className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-2xs rounded-lg transition cursor-pointer flex items-center gap-1"
                            title="Archive Notice"
                          >
                            <Archive className="w-3 h-3" /> Archive
                          </button>
                        )}

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNoticeToEdit(notice);
                            setIsCreateModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 dark:hover:bg-blue-950 rounded-lg transition cursor-pointer"
                          title="Edit Notice"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </>
                    )}

                    {noticeService.canDeleteNotice(currentRole) && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotice(notice.id);
                        }}
                        className="p-1.5 hover:bg-rose-50 text-rose-600 dark:hover:bg-rose-950 rounded-lg transition cursor-pointer"
                        title="Delete Notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 ml-2">
                      View Details <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {noticeData.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 text-xs">
          <div className="text-slate-500 font-bold">
            Showing Page <strong>{noticeData.page}</strong> of <strong>{noticeData.totalPages}</strong> ({noticeData.total} Total Notices)
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition cursor-pointer flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>

            <span className="font-extrabold text-slate-800 dark:text-slate-200 px-2">
              {page} / {noticeData.totalPages}
            </span>

            <button
              disabled={page >= noticeData.totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition cursor-pointer flex items-center gap-1"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Form Modal for Create & Edit */}
      <NoticeFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        noticeToEdit={noticeToEdit}
        onSave={handleCreateOrUpdateNotice}
        currentRole={currentRole}
      />

      {/* Detail Modal for View */}
      <NoticeDetailModal
        isOpen={!!selectedNoticeForDetail}
        onClose={() => setSelectedNoticeForDetail(null)}
        notice={selectedNoticeForDetail}
        currentRole={currentRole}
        onEdit={(n) => {
          setNoticeToEdit(n);
          setIsCreateModalOpen(true);
        }}
        onDelete={handleDeleteNotice}
      />
    </div>
  );
};
