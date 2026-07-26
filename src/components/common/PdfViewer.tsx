import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { Button } from './Button';

export interface PdfViewerProps {
  fileUrl: string;
  title?: string;
}

export const PdfViewer: React.FC<PdfViewerProps> = ({ fileUrl, title = 'Document Preview' }) => {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-rose-600" />
          <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">{title}</span>
        </div>
        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
          <Button variant="outline" size="sm">
            <span>Open PDF</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </Button>
        </a>
      </div>
      <div className="h-96 w-full bg-slate-100 dark:bg-slate-950">
        <iframe src={fileUrl} title={title} className="h-full w-full border-none" />
      </div>
    </div>
  );
};
