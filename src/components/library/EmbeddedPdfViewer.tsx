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
} from 'lucide-react';
import { LibraryBook } from '../../types/index';
import { getAbsolutePdfUrl } from '../../utils/urlUtils';

interface EmbeddedPdfViewerProps {
  book: LibraryBook;
  onClose: () => void;
  canDownload?: boolean;
}

export const EmbeddedPdfViewer: React.FC<EmbeddedPdfViewerProps> = ({
  book,
  onClose,
  canDownload = true,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [pageInputValue, setPageInputValue] = useState<string>('1');
  const [downloadSuccess, setDownloadSuccess] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const totalPages = book.sampleContent?.length || book.pageCount || 10;

  useEffect(() => {
    setPageInputValue(currentPage.toString());
  }, [currentPage]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => setZoomLevel(100);

  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInputValue, 10);
    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    } else {
      setPageInputValue(currentPage.toString());
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleDownload = () => {
    if (!canDownload) {
      alert('Security Restrictions: Download permission is turned off for this document.');
      return;
    }
    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);

    const rawUrl = book.fileDataUrl || (book as any).pdfUrl || book.fileUrl || book.streamUrl || '#';
    const targetUrl = getAbsolutePdfUrl(rawUrl);

    // Create anchor trigger
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = `${book.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const sampleText =
    book.sampleContent && book.sampleContent[currentPage - 1]
      ? book.sampleContent[currentPage - 1]
      : `Page ${currentPage} of ${book.title}. Detailed academic homoeopathic study resource covering principles, clinical observations, repertory formulations, and therapeutic applications for medical scholars and faculty.`;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 select-none animate-fadeIn">
      <div
        ref={containerRef}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden shadow-2xl text-slate-100"
      >
        {/* HEADER TOOLBAR */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Document Meta */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 bg-[#002147] border border-blue-900/50 rounded-xl shrink-0">
              <FileText className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-white text-xs truncate max-w-xs sm:max-w-md">
                {book.title}
              </h3>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                <span>By {book.author}</span>
                <span>•</span>
                <span className="uppercase text-emerald-400 font-semibold">{book.fileFormat || 'PDF'}</span>
              </p>
            </div>
          </div>

          {/* Controls Group */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Download Status Toast */}
            {downloadSuccess && (
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-lg text-[10px] font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>Download Started</span>
              </span>
            )}

            {/* Action Buttons */}
            {canDownload ? (
              <button
                onClick={handleDownload}
                className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="Download PDF Document"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>
            ) : (
              <span
                className="p-2 bg-slate-800 text-slate-500 rounded-xl text-xs font-medium flex items-center gap-1 cursor-not-allowed"
                title="Download Disabled for Students"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Read Only</span>
              </span>
            )}

            <button
              onClick={handlePrint}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition cursor-pointer"
              title="Print Page / Document"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={toggleFullscreen}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition cursor-pointer"
              title={isFullscreen ? 'Exit Full Screen' : 'Full Screen Mode'}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 bg-rose-900/40 hover:bg-rose-800/60 text-rose-300 border border-rose-800/50 rounded-xl text-xs transition cursor-pointer ml-2"
              title="Close PDF Reader"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* SECONDARY TOOLBAR: ZOOM & PAGE NAVIGATION */}
        <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Page Navigation */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="First Page"
            >
              <ChevronsLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Page</span>
              <input
                type="text"
                value={pageInputValue}
                onChange={(e) => setPageInputValue(e.target.value)}
                onBlur={handlePageInputSubmit}
                className="w-10 py-0.5 px-1 bg-slate-950 border border-slate-700 rounded text-center text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
              <span className="text-[11px] text-slate-400">of {totalPages}</span>
            </form>

            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleLastPage}
              disabled={currentPage >= totalPages}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="Last Page"
            >
              <ChevronsRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel <= 50}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="Zoom Out (-25%)"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <select
              value={zoomLevel}
              onChange={(e) => setZoomLevel(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 text-white text-[11px] font-mono font-bold py-1 px-2 rounded-lg focus:outline-none focus:border-emerald-500 cursor-pointer"
            >
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100% (Fit Width)</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
              <option value={200}>200%</option>
            </select>

            <button
              onClick={handleZoomIn}
              disabled={zoomLevel >= 200}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="Zoom In (+25%)"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleRotate}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
              title="Rotate Clockwise"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* VIEWPORT CANVAS / PAGE CONTENT AREA */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 bg-slate-950/90 flex justify-center items-start">
          <div
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-out',
            }}
            className="w-full max-w-2xl bg-white text-slate-900 rounded-xl shadow-2xl p-8 sm:p-12 border border-slate-200 min-h-[600px] flex flex-col justify-between relative my-4"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 overflow-hidden">
              <span className="text-5xl font-black text-slate-900 -rotate-45 uppercase tracking-widest whitespace-nowrap">
                BHMCH DIGITAL E-LIBRARY
              </span>
            </div>

            {/* Page Header */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-6">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-700 block">
                    {book.department || 'BURDWAN HOMOEOPATHIC MEDICAL COLLEGE & HOSPITAL'}
                  </span>
                  <h2 className="text-base font-bold text-[#002147] mt-0.5">{book.title}</h2>
                </div>
                <span className="px-2 py-0.5 bg-slate-100 rounded text-[10px] font-mono text-slate-600 font-bold uppercase">
                  {book.category}
                </span>
              </div>

              {/* Page Body Content */}
              <div className="space-y-4 text-xs sm:text-sm text-slate-800 font-serif leading-relaxed">
                <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-[#002147] first-letter:mr-1">
                  {sampleText}
                </p>
                <p className="text-slate-600">
                  {book.description ||
                    'Comprehensive academic compilation approved by the National Commission for Homoeopathy (NCH) for undergraduate and postgraduate homoeopathic clinical education.'}
                </p>
                {book.subject && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-sans text-emerald-900 my-4">
                    <strong>Subject Module:</strong> {book.subject} • <strong>Semester:</strong> {book.semester || 'All Professional Years'}
                  </div>
                )}
              </div>
            </div>

            {/* Page Footer */}
            <div className="pt-6 border-t border-slate-200 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>BHMCH Digital Rights Reserved • {book.year || '2026'}</span>
              <span>Page {currentPage} of {totalPages}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
