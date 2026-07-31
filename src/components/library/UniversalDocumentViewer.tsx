import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  Printer,
  RotateCw,
  X,
  Lock,
  FileText,
  Shield,
  Eye,
  ChevronsLeft,
  ChevronsRight,
  CheckCircle2,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  Archive,
  Search,
  Copy,
  Table,
} from 'lucide-react';
import { LibraryBook } from '../../types/index';

interface UniversalDocumentViewerProps {
  book: LibraryBook;
  onClose: () => void;
  canDownload?: boolean;
}

export const UniversalDocumentViewer: React.FC<UniversalDocumentViewerProps> = ({
  book,
  onClose,
  canDownload = true,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedText, setCopiedText] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const format = (book.fileFormat || 'PDF').toUpperCase();
  const filename = book.fileName || `${book.title.replace(/\s+/g, '_')}.${format.toLowerCase()}`;

  // Page or slide or sheet count
  const totalPages = book.pageCount || (format === 'PPTX' || format === 'PPT' ? 12 : format === 'XLSX' || format === 'XLS' ? 3 : 8);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleDownload = () => {
    if (!canDownload) {
      alert('Security Notice: File download permission is disabled for this resource by faculty.');
      return;
    }
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    const targetUrl = book.fileDataUrl || book.fileUrl || '#';
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyContent = () => {
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
    navigator.clipboard?.writeText?.(`Document: ${book.title}\nAuthor: ${book.author}\nDepartment: ${book.department}`);
  };

  // Icon selector based on file format
  const renderFormatIcon = () => {
    switch (format) {
      case 'PDF':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'DOC':
      case 'DOCX':
        return <FileText className="w-5 h-5 text-blue-400" />;
      case 'PPT':
      case 'PPTX':
        return <Presentation className="w-5 h-5 text-amber-400" />;
      case 'XLS':
      case 'XLSX':
        return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
      case 'PNG':
      case 'JPG':
      case 'JPEG':
      case 'WEBP':
        return <ImageIcon className="w-5 h-5 text-purple-400" />;
      case 'TXT':
        return <FileCode className="w-5 h-5 text-cyan-400" />;
      case 'ZIP':
        return <Archive className="w-5 h-5 text-orange-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn">
      <div
        ref={containerRef}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-100"
      >
        {/* HEADER TOOLBAR */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-[#002147] border border-blue-900/50 rounded-xl shrink-0">
              {renderFormatIcon()}
            </div>
            <div className="min-w-0">
              <h3 className="font-extrabold text-white text-xs truncate max-w-xs sm:max-w-md">
                {book.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <span>File: {filename}</span>
                <span>•</span>
                <span>{book.fileSize || '3.5 MB'}</span>
                <span>•</span>
                <span className="uppercase text-emerald-400 font-bold">{format}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {downloadSuccess && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Downloading File...</span>
              </span>
            )}

            {canDownload ? (
              <button
                onClick={handleDownload}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Download Resource File"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            ) : (
              <span className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed">
                <Lock className="w-3.5 h-3.5 text-amber-500" />
                <span>Read Only</span>
              </span>
            )}

            <button
              onClick={handleCopyContent}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition cursor-pointer"
              title="Copy Citation"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition cursor-pointer"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-rose-900/40 hover:bg-rose-800/60 text-rose-300 border border-rose-800/50 rounded-xl text-xs transition cursor-pointer ml-2"
              title="Close Viewer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SUB-NAVBAR FOR NAVIGATION & ZOOM */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-2xs font-mono font-bold text-slate-300">
              {format === 'PPTX' || format === 'PPT' ? 'Slide' : format === 'XLSX' || format === 'XLS' ? 'Sheet' : 'Page'} {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-2xs font-mono font-bold text-slate-300">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setRotation((prev) => (prev + 90) % 360)}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
              title="Rotate 90°"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* MAIN VIEWER DISPLAY AREA */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-950/90 flex justify-center items-start">
          <div
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out',
            }}
            className="w-full max-w-3xl bg-white text-slate-900 rounded-2xl shadow-2xl p-6 sm:p-10 border border-slate-200 min-h-[580px] flex flex-col justify-between relative my-2"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
              <span className="text-4xl font-black text-slate-900 -rotate-45 uppercase tracking-widest whitespace-nowrap">
                BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL
              </span>
            </div>

            {/* DOCUMENT HEADER */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 block">
                    {book.department || 'BHMCH Academic Repository'}
                  </span>
                  <h2 className="text-base font-extrabold text-[#002147] mt-0.5">{book.title}</h2>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-2xs font-mono font-bold uppercase">
                  {format} Format
                </span>
              </div>

              {/* FORMAT SPECIFIC CONTENT PREVIEW */}
              {['PNG', 'JPG', 'JPEG', 'WEBP'].includes(format) || book.fileType?.startsWith('image/') ? (
                <div className="text-center space-y-4 my-4">
                  <img
                    src={book.fileDataUrl || book.coverUrl || book.coverImageUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'}
                    alt={book.title}
                    className="max-h-96 mx-auto rounded-xl object-contain shadow-lg border border-slate-200"
                  />
                  <p className="text-xs font-semibold text-slate-500">Full Resolution Image View • Uploaded by {book.author}</p>
                </div>
              ) : format === 'PPTX' || format === 'PPT' ? (
                /* Presentation Slide Renderer */
                <div className="space-y-6 my-4">
                  <div className="bg-slate-900 text-white rounded-2xl p-8 shadow-xl border border-slate-800 min-h-[300px] flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="px-2.5 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg text-[10px] font-mono font-bold uppercase">
                        Slide #{currentPage} of {totalPages}
                      </span>
                      <h3 className="text-lg font-black text-amber-400">
                        {currentPage === 1 ? `Title Slide: ${book.title}` : `Topic ${currentPage - 1}: Clinical Case Analysis & Remedies`}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        {currentPage === 1
                          ? `Presented by ${book.author} (${book.department || 'Academic Dept'}). Subject: ${book.subject || 'Homoeopathic Philosophy'}. Target Batch: ${book.semester || 'All BHMS'}.`
                          : `Keynote symptom breakdown for high-potency prescribing. Systematic analysis of mental generals, physical generals, and modalities in constitutional homoeopathic prescribing.`}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 text-[10px] text-slate-400 font-mono flex justify-between">
                      <span>BHMCH Presentation Hub</span>
                      <span>Slide {currentPage}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-2xs font-sans text-amber-900">
                    <strong>Speaker Notes:</strong> Ensure students take notes on Kentian evaluation of symptoms and miasmatic classification.
                  </div>
                </div>
              ) : format === 'XLSX' || format === 'XLS' ? (
                /* Spreadsheet Grid Renderer */
                <div className="space-y-4 my-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xs font-bold font-mono text-emerald-700 uppercase flex items-center gap-1">
                      <Table className="w-3.5 h-3.5" />
                      <span>Sheet Tab: {currentPage === 1 ? 'Data Records' : currentPage === 2 ? 'Statistical Summary' : 'Raw Metrics'}</span>
                    </span>
                    <span className="text-2xs font-mono text-slate-400">Excel Grid View</span>
                  </div>

                  <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
                    <table className="w-full text-left text-2xs font-mono">
                      <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                        <tr>
                          <th className="p-2 border-r border-slate-200 font-bold">#</th>
                          <th className="p-2 border-r border-slate-200 font-bold">Record ID</th>
                          <th className="p-2 border-r border-slate-200 font-bold">Category / Topic</th>
                          <th className="p-2 border-r border-slate-200 font-bold">Value / Metric</th>
                          <th className="p-2 font-bold">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[1, 2, 3, 4, 5, 6].map((row) => (
                          <tr key={row} className="hover:bg-slate-50">
                            <td className="p-2 border-r border-slate-200 font-bold bg-slate-50">{row}</td>
                            <td className="p-2 border-r border-slate-200 text-slate-800 font-semibold">REC-2026-0{row}</td>
                            <td className="p-2 border-r border-slate-200 text-slate-700">{book.category || 'Materia Medica'} Dataset #{row}</td>
                            <td className="p-2 border-r border-slate-200 font-bold text-emerald-700">{row * 14.2} %</td>
                            <td className="p-2 text-emerald-600 font-bold">Verified</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : format === 'TXT' ? (
                /* Monospace Text File Renderer */
                <div className="space-y-4 my-4">
                  <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-5 rounded-2xl border border-slate-800 shadow-inner overflow-x-auto min-h-[280px]">
                    <p className="text-slate-500">// File: {filename}</p>
                    <p className="text-slate-500">// Uploaded By: {book.author}</p>
                    <p className="text-slate-500">// Department: {book.department || 'General Academic'}</p>
                    <p className="text-[#00A651] mt-2">--------------------------------------------------</p>
                    <p className="text-slate-200 mt-2 leading-relaxed">
                      {book.description || 'Raw text document containing academic syllabus notes, clinical observations, and reference links.'}
                    </p>
                    <p className="text-emerald-300 mt-4">
                      [SECTION {currentPage}] Detailed notes on Hahnemannian aphorisms 1 to 291 with commentary.
                    </p>
                  </div>
                </div>
              ) : (
                /* Standard PDF / DOCX Document View */
                <div className="space-y-4 text-xs sm:text-sm text-slate-800 font-serif leading-relaxed my-4">
                  <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#002147] first-letter:mr-1">
                    Page {currentPage}: {book.description || `Comprehensive academic resource for ${book.subject || 'Homeopathy Studies'}. Published for BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL students and faculty.`}
                  </p>
                  <p className="text-slate-600">
                    Detailed analysis of classical homoeopathic literature, clinical posology rules, and case taking methodology. Approved for academic archival under NCH syllabus guidelines.
                  </p>
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-sans text-emerald-900 my-4">
                    <strong>Department:</strong> {book.department || 'Central Academic'} • <strong>Semester:</strong> {book.semester || 'All BHMS Years'}
                  </div>
                </div>
              )}
            </div>

            {/* FOOTER METADATA */}
            <div className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Uploaded By: {book.author || 'Faculty Member'}</span>
              <span>BHMCH E-Library • {book.year || '2026'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
