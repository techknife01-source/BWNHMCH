import React from 'react';
import { NoticeItem, NoticeUserRole } from '../../types/notice';
import { Modal } from '../common/Modal';
import { NoticeAttachmentManager } from './NoticeAttachmentManager';
import {
  Bell,
  Calendar,
  User,
  Building2,
  Pin,
  CheckCircle2,
  Share2,
  Printer,
  Edit,
  Trash2,
  Clock,
  Eye,
  FileText,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface NoticeDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  notice: NoticeItem | null;
  currentRole?: NoticeUserRole;
  onEdit?: (notice: NoticeItem) => void;
  onDelete?: (id: string) => void;
  onPublishToggle?: (id: string, status: NoticeItem['status']) => void;
}

export const NoticeDetailModal: React.FC<NoticeDetailModalProps> = ({
  isOpen,
  onClose,
  notice,
  currentRole = 'STUDENT',
  onEdit,
  onDelete,
  onPublishToggle,
}) => {
  if (!notice) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Notice permalink copied to clipboard!');
    }
  };

  const handlePrint = () => {
    toast.success('Preparing notice document for printing...');
    window.print();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Notice: ${notice.noticeNo}`} className="max-w-3xl">
      <div className="space-y-5 text-slate-900 dark:text-slate-100">
        {/* Header Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-lg text-3xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {notice.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-3xs font-extrabold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
              {notice.department}
            </span>
            {notice.isImportant && (
              <span className="px-2.5 py-1 bg-rose-500 text-white font-black text-3xs rounded-lg uppercase flex items-center gap-1 animate-pulse">
                <Pin className="w-3 h-3 fill-white rotate-45" /> Important / Urgent
              </span>
            )}
            <span
              className={`px-2.5 py-1 rounded-lg text-3xs font-extrabold uppercase ${
                notice.status === 'PUBLISHED'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/80 dark:text-emerald-300'
                  : notice.status === 'DRAFT'
                  ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              STATUS: {notice.status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={handleShare}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Copy Link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={handlePrint}
              className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-300 transition cursor-pointer"
              title="Print Notice"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Notice Title */}
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-tight">
            {notice.title}
          </h2>
          {notice.summary && (
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 font-medium leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              {notice.summary}
            </p>
          )}
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Issued By</span>
            <span className="font-extrabold text-slate-900 dark:text-white truncate block">{notice.author}</span>
            <span className="text-[10px] text-slate-500">{notice.authorRole || 'Official'}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Publish Date</span>
            <span className="font-extrabold text-slate-900 dark:text-white block">{notice.publishedDate}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Target Audience</span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 block">{notice.targetAudience}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Views Count</span>
            <span className="font-extrabold text-blue-600 dark:text-blue-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" /> {notice.viewsCount || 1} Reads
            </span>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="space-y-2">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Official Directive Text</h4>
          <div
            className="prose dark:prose-invert max-w-none text-sm text-slate-800 dark:text-slate-200 leading-relaxed bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800"
            dangerouslySetInnerHTML={{ __html: notice.content }}
          />
        </div>

        {/* Attachments Section */}
        {notice.attachments && notice.attachments.length > 0 && (
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Associated Circular Files</h4>
            <NoticeAttachmentManager attachments={notice.attachments} readOnly={true} />
          </div>
        )}

        {/* Footer Role Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Verified Gazette Document</span>
          </div>

          <div className="flex items-center gap-2">
            {(currentRole === 'ADMIN' || currentRole === 'PRINCIPAL' || currentRole === 'HOD') && onEdit && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(notice);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Edit className="w-3.5 h-3.5" /> Edit Notice
              </button>
            )}

            {(currentRole === 'ADMIN' || currentRole === 'PRINCIPAL') && onDelete && (
              <button
                onClick={() => {
                  onClose();
                  onDelete(notice.id);
                }}
                className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Notice
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-[#002147] text-white font-bold rounded-xl shadow-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
