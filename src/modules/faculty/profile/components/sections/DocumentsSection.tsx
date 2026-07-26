import React, { useState, useRef } from 'react';
import { ProfileDocument } from '../../types/profile.types';
import { FolderOpen, Upload, FileText, CheckCircle2, Clock, Download, Eye, Plus, X } from 'lucide-react';

interface DocumentsSectionProps {
  documents: ProfileDocument[];
  onUploadDoc: (file: File, category: string, title: string) => Promise<void>;
  isSaving: boolean;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  onUploadDoc,
  isSaving,
}) => {
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [docTitle, setDocTitle] = useState('');
  const [category, setCategory] = useState('Degree Certificate');
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docTitle) return;

    await onUploadDoc(file, category, docTitle);
    setShowUploadModal(false);
    setDocTitle('');
    setFile(null);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-2xs space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-5 h-5 text-emerald-600" />
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
            Documents Vault & Academic Certificates
          </h3>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-3.5 py-1.5 bg-[#002147] hover:bg-[#003366] text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 text-emerald-400" />
          <span>Upload Document</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                  {doc.category}
                </span>

                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                    doc.verificationStatus === 'Verified'
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      : 'bg-amber-50 text-amber-600 border border-amber-200'
                  }`}
                >
                  {doc.verificationStatus === 'Verified' ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <Clock className="w-3 h-3" />
                  )}
                  {doc.verificationStatus}
                </span>
              </div>

              <h4 className="font-extrabold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                {doc.title}
              </h4>

              <p className="text-3xs text-slate-400 font-medium">
                Size: {doc.fileSize} • Uploaded on {doc.uploadedAt}
              </p>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-1.5 bg-white dark:bg-slate-700 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-xl text-3xs font-extrabold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View</span>
              </a>
              <a
                href={doc.fileUrl}
                download
                className="flex-1 py-1.5 bg-emerald-50 dark:bg-emerald-950/80 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl text-3xs font-extrabold border border-emerald-200 dark:border-emerald-800 transition flex items-center justify-center gap-1 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <Upload className="w-4 h-4 text-emerald-600" /> Upload Certificate / Document
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4 text-xs font-bold">
              <div className="space-y-1">
                <label className="text-3xs uppercase text-slate-400">Document Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. M.D. Final Degree Certificate"
                  value={docTitle}
                  onChange={(e) => setDocTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                />
              </div>

              <div className="space-y-1">
                <label className="text-3xs uppercase text-slate-400">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900"
                >
                  <option value="Degree Certificate">Degree Certificate</option>
                  <option value="Council Registration">Council Registration</option>
                  <option value="Identity Proof">Identity Proof</option>
                  <option value="Experience Letter">Experience Letter</option>
                  <option value="Publication">Publication</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-3xs uppercase text-slate-400">Select File (PDF/Image)</label>
                <input
                  type="file"
                  required
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-3xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 text-3xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !file || !docTitle}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-3xs font-bold disabled:opacity-50"
                >
                  {isSaving ? 'Uploading...' : 'Submit Document'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
