import React, { useState } from 'react';
import { FileUp, FileText, X } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface FileUploadProps {
  onFileSelected?: (file: File) => void;
  accept?: string;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelected, accept = '*', className }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (onFileSelected) onFileSelected(file);
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {selectedFile ? (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">{selectedFile.name}</p>
              <p className="text-[10px] text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <button onClick={() => setSelectedFile(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 transition-all">
          <FileUp className="h-8 w-8 text-slate-400 mb-1" />
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Select document or PDF file</p>
          <input type="file" accept={accept} onChange={handleFileChange} className="hidden" />
        </label>
      )}
    </div>
  );
};
