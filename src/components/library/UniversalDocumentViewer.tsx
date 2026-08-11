import React, { useState, useRef, useEffect } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCw,
  X,
  Lock,
  FileText,
  CheckCircle2,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  FileCode,
  Archive,
  Copy,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { LibraryBook } from '../../types/index';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined' && pdfjsLib) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.mjs`;
  } catch (e) {
    console.warn('PDF.js worker initialization notice:', e);
  }
}

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

  // PDF.js State
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const [realPageCount, setRealPageCount] = useState<number | null>(null);
  const [isRenderingPage, setIsRenderingPage] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const currentRenderTaskRef = useRef<any>(null);

  const format = (book.fileFormat || 'PDF').toUpperCase();
  const filename = book.fileName || `${book.title.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
  const pdfUrl = book.fileDataUrl || book.fileUrl || book.streamUrl || '#';

  // Total pages calculation: Real PDF page count if loaded, else fallback
  const totalPages = realPageCount || book.pageCount || (format === 'PPTX' || format === 'PPT' ? 12 : format === 'XLSX' || format === 'XLS' ? 3 : 1);

  // Load PDF document using pdfjs
  const loadPdfDocument = async () => {
    if (format !== 'PDF' && !pdfUrl.endsWith('.pdf') && !pdfUrl.startsWith('data:application/pdf')) {
      return;
    }

    setPdfLoading(true);
    setPdfError(null);

    try {
      const loadingTask = pdfjsLib.getDocument({
        url: pdfUrl,
        withCredentials: false,
      });

      const loadedDoc = await loadingTask.promise;
      setPdfDoc(loadedDoc);
      setRealPageCount(loadedDoc.numPages);
      setPdfLoading(false);
    } catch (err: any) {
      console.error('[PDF Viewer Error]:', err);
      setPdfLoading(false);
      setPdfError(err?.message || 'Failed to fetch or parse PDF file from server');
    }
  };

  useEffect(() => {
    if (format === 'PDF' || pdfUrl.endsWith('.pdf') || pdfUrl.startsWith('data:application/pdf')) {
      loadPdfDocument();
    }
  }, [pdfUrl, format]);

  // Render current page onto Canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    let isCancelled = false;

    const renderPage = async () => {
      try {
        setIsRenderingPage(true);

        // Cancel previous render if in progress
        if (currentRenderTaskRef.current) {
          currentRenderTaskRef.current.cancel();
        }

        const page = await pdfDoc.getPage(currentPage);
        if (isCancelled) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Base scale for crisp rendering
        const scale = (zoomLevel / 100) * 1.5;
        const viewport = page.getViewport({ scale, rotation });

        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        const renderTask = page.render(renderContext);
        currentRenderTaskRef.current = renderTask;

        await renderTask.promise;
        setIsRenderingPage(false);
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('[Page Render Error]:', err);
        }
        setIsRenderingPage(false);
      }
    };

    renderPage();

    return () => {
      isCancelled = true;
      if (currentRenderTaskRef.current) {
        currentRenderTaskRef.current.cancel();
      }
    };
  }, [pdfDoc, currentPage, zoomLevel, rotation]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 25, 250));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoomLevel(100);
    setRotation(0);
  };

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

    const targetUrl = pdfUrl !== '#' ? pdfUrl : book.fileUrl || '#';
    const link = document.createElement('a');
    link.href = targetUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyContent = () => {
    navigator.clipboard?.writeText?.(`Document: ${book.title}\nAuthor: ${book.author}\nDepartment: ${book.department}`);
  };

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
                <span>{book.fileSize || '14.2 MB'}</span>
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
              disabled={currentPage === 1 || pdfLoading}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-2xs font-mono font-bold text-slate-300">
              {format === 'PPTX' || format === 'PPT' ? 'Slide' : format === 'XLSX' || format === 'XLS' ? 'Sheet' : 'Page'} {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage >= totalPages || pdfLoading}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 rounded-lg transition cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-2xs font-mono font-bold text-slate-300">{zoomLevel}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition cursor-pointer"
              title="Reset Zoom & Rotation"
            >
              <RotateCcw className="w-3.5 h-3.5" />
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
          {format === 'PDF' || pdfUrl.endsWith('.pdf') || pdfUrl.startsWith('data:application/pdf') ? (
            <div className="w-full flex flex-col items-center justify-center my-2">
              {pdfLoading && (
                <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full shadow-xl space-y-4 my-8">
                  <Loader2 className="w-8 h-8 text-emerald-400 animate-spin mx-auto" />
                  <div>
                    <h4 className="text-sm font-bold text-white">Loading Digital PDF Resource</h4>
                    <p className="text-xs text-slate-400 mt-1">Fetching {filename} from secure repository...</p>
                  </div>
                </div>
              )}

              {pdfError && !pdfLoading && (
                <div className="p-8 text-center bg-slate-900/90 border border-rose-900/50 rounded-2xl max-w-lg w-full shadow-2xl space-y-4 my-8">
                  <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-rose-300">Unable to Load PDF Document</h4>
                    <p className="text-xs text-slate-400 font-mono bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-left overflow-x-auto">
                      {pdfError}
                    </p>
                  </div>
                  <div className="pt-2 flex items-center justify-center gap-3">
                    <button
                      onClick={loadPdfDocument}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Retry Loading</span>
                    </button>
                    {canDownload && (
                      <button
                        onClick={handleDownload}
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition flex items-center gap-2 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Direct PDF</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!pdfLoading && !pdfError && (
                <div className="flex flex-col items-center max-w-full overflow-auto">
                  {isRenderingPage && (
                    <div className="text-[11px] font-mono font-semibold text-emerald-400 mb-2 flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>Rendering Page {currentPage}...</span>
                    </div>
                  )}

                  <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-slate-200 relative">
                    <canvas
                      ref={canvasRef}
                      className="max-w-full block mx-auto transition-all duration-200"
                    />
                  </div>
                </div>
              )}
            </div>
          ) : ['PNG', 'JPG', 'JPEG', 'WEBP'].includes(format) || book.fileType?.startsWith('image/') ? (
            <div className="text-center space-y-4 my-4">
              <img
                src={book.fileDataUrl || book.coverUrl || book.coverImageUrl || 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80'}
                alt={book.title}
                className="max-h-[550px] mx-auto rounded-xl object-contain shadow-lg border border-slate-200"
              />
              <p className="text-xs font-semibold text-slate-400">Full Resolution Image View • Uploaded by {book.author}</p>
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full my-8 space-y-4">
              <FileText className="w-10 h-10 text-emerald-400 mx-auto" />
              <div>
                <h4 className="text-sm font-bold text-white">{book.title}</h4>
                <p className="text-xs text-slate-400 mt-1">{book.description || 'Academic resource file'}</p>
              </div>
              <div className="pt-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition flex items-center gap-2 mx-auto cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Resource File ({format})</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
