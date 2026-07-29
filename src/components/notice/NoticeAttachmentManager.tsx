import React, { useRef } from 'react';
import { NoticeAttachment } from '../../types/notice';
import { FileText, Image as ImageIcon, Download, Trash2, Paperclip, FileSpreadsheet, Presentation } from 'lucide-react';
import toast from 'react-hot-toast';

interface NoticeAttachmentManagerProps {
  attachments: NoticeAttachment[];
  onChange?: (attachments: NoticeAttachment[]) => void;
  readOnly?: boolean;
}

export const NoticeAttachmentManager: React.FC<NoticeAttachmentManagerProps> = ({
  attachments,
  onChange,
  readOnly = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAttachmentIcon = (type: NoticeAttachment['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'docx':
        return <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'ppt':
        return <Presentation className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      default:
        return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  const getBadgeStyle = (type: NoticeAttachment['type']) => {
    switch (type) {
      case 'pdf':
        return 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-900';
      case 'docx':
        return 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-900';
      case 'ppt':
        return 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-900';
      case 'image':
        return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900';
      default:
        return 'bg-slate-50 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !onChange) return;

    const newAttachments: NoticeAttachment[] = [...attachments];

    Array.from(files).forEach((file: File) => {
      let type: NoticeAttachment['type'] = 'pdf';
      const nameLower = file.name.toLowerCase();

      if (nameLower.endsWith('.pdf')) type = 'pdf';
      else if (nameLower.endsWith('.doc') || nameLower.endsWith('.docx')) type = 'docx';
      else if (nameLower.endsWith('.ppt') || nameLower.endsWith('.pptx')) type = 'ppt';
      else if (
        nameLower.endsWith('.png') ||
        nameLower.endsWith('.jpg') ||
        nameLower.endsWith('.jpeg') ||
        nameLower.endsWith('.webp')
      ) {
        type = 'image';
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const fileUrl = event.target?.result as string;
        newAttachments.push({
          id: `att-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          name: file.name,
          type,
          url: fileUrl || 'data:application/octet-stream;base64,',
          size: `${(file.size / 1024).toFixed(0)} KB`,
        });
        onChange([...newAttachments]);
        toast.success(`Attached ${file.name}`);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (att: NoticeAttachment) => {
    if (att.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = att.url;
      link.download = att.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`Downloading ${att.name}...`);
    } else {
      // Direct file path download simulation
      const element = document.createElement('a');
      const file = new Blob([`BHMC Notice Attachment: ${att.name}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = att.name;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success(`Downloading ${att.name}`);
    }
  };

  const handleRemove = (id: string) => {
    if (!onChange) return;
    onChange(attachments.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-3">
      {!readOnly && onChange && (
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Paperclip className="w-4 h-4 text-emerald-600" />
            <span>Notice Attachments (PDF, DOCX, PPT, Image)</span>
          </label>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition cursor-pointer flex items-center gap-1"
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Upload File</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.webp"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {attachments.length === 0 ? (
        readOnly ? null : (
          <p className="text-xs text-slate-400 italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center">
            No document attachments added yet. Support for PDF, DOCX, PPT & Images.
          </p>
        )
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {attachments.map((att) => (
            <div
              key={att.id}
              className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 text-xs font-semibold ${getBadgeStyle(
                att.type
              )}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="p-1.5 rounded-lg bg-white/80 dark:bg-slate-900/80 shadow-2xs shrink-0">
                  {getAttachmentIcon(att.type)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate text-slate-900 dark:text-white text-xs">{att.name}</p>
                  <p className="text-[10px] opacity-75 uppercase font-mono">{att.type} • {att.size || 'Attachment'}</p>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => handleDownload(att)}
                  className="p-1.5 hover:bg-white/80 dark:hover:bg-slate-900/80 rounded-lg text-slate-700 dark:text-slate-200 transition cursor-pointer"
                  title="Download Attachment"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                {!readOnly && onChange && (
                  <button
                    type="button"
                    onClick={() => handleRemove(att.id)}
                    className="p-1.5 hover:bg-rose-100 text-rose-600 dark:hover:bg-rose-950 rounded-lg transition cursor-pointer"
                    title="Remove Attachment"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
