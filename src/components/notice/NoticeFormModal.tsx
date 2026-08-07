import React, { useState, useEffect } from 'react';
import { NoticeItem, NoticeCategory, NoticeStatus, NoticeAttachment } from '../../types/notice';
import { Modal } from '../common/Modal';
import { RichTextEditor } from '../common/RichTextEditor';
import { NoticeAttachmentManager } from './NoticeAttachmentManager';
import { Bell, Calendar, Send, Pin, AlertCircle, FileText, Clock, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

interface NoticeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  noticeToEdit?: NoticeItem | null;
  onSave: (data: Partial<NoticeItem>) => void;
  currentRole?: string;
}

export const NoticeFormModal: React.FC<NoticeFormModalProps> = ({
  isOpen,
  onClose,
  noticeToEdit,
  onSave,
  currentRole = 'ADMIN',
}) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('ACADEMIC');
  const [department, setDepartment] = useState('All');
  const [author, setAuthor] = useState('Prof. (Dr.) Susmita Chatterjee');
  const [authorRole, setAuthorRole] = useState('Principal');
  const [publishedDate, setPublishedDate] = useState(new Date().toISOString().split('T')[0]);
  const [scheduledPublishDate, setScheduledPublishDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [status, setStatus] = useState<NoticeStatus>('PUBLISHED');
  const [targetAudience, setTargetAudience] = useState<NoticeItem['targetAudience']>('ALL');
  const [attachments, setAttachments] = useState<NoticeAttachment[]>([]);

  useEffect(() => {
    if (noticeToEdit) {
      setTitle(noticeToEdit.title || '');
      setSummary(noticeToEdit.summary || '');
      setContent(noticeToEdit.content || '');
      setCategory(noticeToEdit.category || 'ACADEMIC');
      setDepartment(noticeToEdit.department || 'All');
      setAuthor(noticeToEdit.author || 'Prof. (Dr.) Susmita Chatterjee');
      setAuthorRole(noticeToEdit.authorRole || 'Principal');
      setPublishedDate(noticeToEdit.publishedDate || new Date().toISOString().split('T')[0]);
      setScheduledPublishDate(noticeToEdit.scheduledPublishDate || '');
      setExpiryDate(noticeToEdit.expiryDate || '');
      setIsImportant(noticeToEdit.isImportant ?? false);
      setStatus(noticeToEdit.status || 'PUBLISHED');
      setTargetAudience(noticeToEdit.targetAudience || 'ALL');
      setAttachments(noticeToEdit.attachments || []);
    } else {
      // Reset form
      setTitle('');
      setSummary('');
      setContent('<p>Enter official directive content here...</p>');
      setCategory('ACADEMIC');
      setDepartment('All');
      setAuthor(currentRole === 'HOD' ? 'HOD Office' : 'Prof. (Dr.) Susmita Chatterjee');
      setAuthorRole(currentRole === 'HOD' ? 'Head of Department' : 'Principal');
      setPublishedDate(new Date().toISOString().split('T')[0]);
      setScheduledPublishDate('');
      setExpiryDate('');
      setIsImportant(false);
      setStatus('PUBLISHED');
      setTargetAudience('ALL');
      setAttachments([]);
    }
  }, [noticeToEdit, isOpen, currentRole]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Please provide a notice title');
      return;
    }

    const noticeData: Partial<NoticeItem> = {
      title,
      summary,
      content,
      category,
      department,
      author,
      authorRole,
      publishedDate,
      scheduledPublishDate: scheduledPublishDate || undefined,
      expiryDate: expiryDate || undefined,
      isImportant,
      status,
      targetAudience,
      attachments,
    };

    onSave(noticeData);
    onClose();
  };

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={noticeToEdit ? `Edit Notice #${noticeToEdit.noticeNo}` : 'Publish New Notice / Circular'}
      className="max-w-3xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        {/* Title */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notice Headline / Subject *</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., BHMS 1st Professional Examination Routine 2026"
            className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#002147]"
          />
        </div>

        {/* Category & Department & Target Audience */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notice Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="ACADEMIC">ACADEMIC</option>
              <option value="EXAM">EXAMINATION</option>
              <option value="HOSPITAL">HOSPITAL & OPD</option>
              <option value="ADMISSION">ADMISSION</option>
              <option value="ADMINISTRATIVE">ADMINISTRATIVE</option>
              <option value="RESEARCH">RESEARCH & CME</option>
              <option value="GENERAL">GENERAL</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              {departmentsList.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Target Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as NoticeItem['targetAudience'])}
              className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="ALL">ALL (Students & Faculty)</option>
              <option value="STUDENTS">STUDENTS ONLY</option>
              <option value="FACULTY">FACULTY ONLY</option>
              <option value="HOSPITAL_STAFF">HOSPITAL STAFF</option>
              <option value="HOD">HODs & DEANS</option>
            </select>
          </div>
        </div>

        {/* Status & Priority & Dates */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Publishing Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as NoticeStatus)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl font-extrabold"
              >
                <option value="PUBLISHED">PUBLISHED</option>
                <option value="DRAFT">DRAFT</option>
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Publish Date</label>
              <input
                type="date"
                value={publishedDate}
                onChange={(e) => setPublishedDate(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Schedule Date (Optional)</label>
              <input
                type="date"
                value={scheduledPublishDate}
                onChange={(e) => setScheduledPublishDate(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Expiry Date (Optional)</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center space-x-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isImportant}
                onChange={(e) => setIsImportant(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                <Pin className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Pin as High Priority / Urgent Notice
              </span>
            </label>
          </div>
        </div>

        {/* Author & Designation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Author Name *</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Author Designation / Office</label>
            <input
              type="text"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Short Executive Summary</label>
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Brief 1-line overview displayed in card feeds..."
            className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl"
          />
        </div>

        {/* Rich Text Editor for Detailed Content */}
        <div>
          <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notice Directive Body (Rich Text)</label>
          <RichTextEditor value={content} onChange={setContent} minHeight="180px" />
        </div>

        {/* Attachment Manager */}
        <NoticeAttachmentManager attachments={attachments} onChange={setAttachments} />

        {/* Actions */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-xl text-slate-700 dark:text-slate-300 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 bg-[#002147] hover:bg-blue-900 text-white font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{noticeToEdit ? 'Save Changes' : 'Publish / Save Notice'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
