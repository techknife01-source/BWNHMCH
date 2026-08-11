import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import {
  BookOpen,
  Search,
  Laptop,
  Clock,
  FileText,
  Eye,
  Download,
  Filter,
  Sparkles,
  Lock,
  Layers,
  ChevronRight,
  ShieldCheck,
  UserCheck,
  RefreshCw,
  FileCode,
  Presentation,
  FileSpreadsheet,
} from 'lucide-react';
import { LibraryBook } from '../../types/index';
import { libraryApi } from '../../services/api/library.api';
import { UniversalDocumentViewer } from '../../components/library/UniversalDocumentViewer';

const CATEGORIES = [
  'All',
  'Materia Medica',
  'Organon & Philosophy',
  'Repertory',
  'Homoeopathic Pharmacy',
  'Practice of Medicine',
  'Anatomy & Physiology',
  'Research Journal',
  'Question Paper',
];

const DEPARTMENTS = [
  'All',
  'Organon of Medicine',
  'Materia Medica',
  'Repertory',
  'Homoeopathic Pharmacy',
  'Practice of Medicine',
  'Anatomy',
  'Physiology',
  'Pathology',
];

export const LibraryPage: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');

  // Reader Modal State
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getBooks();
      if (res.data) {
        setBooks(res.data);
      }
    } catch (err) {
      console.error('Error loading public library resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleOpenReader = (book: LibraryBook) => {
    // Track view count
    libraryApi.incrementView(book.id).catch(() => {});
    setActiveReadingBook(book);
  };

  const filteredBooks = books.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.category.toLowerCase().includes(q) ||
      (b.department && b.department.toLowerCase().includes(q)) ||
      (b.subject && b.subject.toLowerCase().includes(q)) ||
      (b.accessionNo && b.accessionNo.toLowerCase().includes(q));

    const matchesCategory =
      selectedCategory === 'All' ||
      b.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      (selectedCategory === 'Organon & Philosophy' && b.category.toLowerCase().includes('organon'));

    const matchesDept =
      selectedDept === 'All' ||
      (b.department && b.department.toLowerCase().includes(selectedDept.toLowerCase())) ||
      b.category.toLowerCase().includes(selectedDept.toLowerCase());

    const matchesFormat =
      selectedFormat === 'All' ||
      (b.fileFormat && b.fileFormat.toUpperCase() === selectedFormat.toUpperCase());

    return matchesSearch && matchesCategory && matchesDept && matchesFormat;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Central E-Library' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#002147] via-[#003366] to-slate-900 text-white p-8 sm:p-12 shadow-xl space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <BookOpen className="w-96 h-96 text-white" />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30 inline-flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Official Open Public Access E-Library (OPAC)
            </span>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
              Central Digital Library & Archives
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Public access repository housing uploaded Hahnemannian medical texts, organon commentaries, materia medica notes, research journals, and university examination syllabi. Read complete PDF documents directly online.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20 text-center sm:text-left shrink-0 max-w-xs space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Public Reader Access</span>
            </div>
            <p className="text-3xs text-slate-300">
              Free reading access for medical students, researchers, and homoeopathic clinicians. No login required for reading published resources.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center justify-center w-full mt-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition shadow-sm"
            >
              <span>Faculty & Librarian Upload Desk →</span>
            </Link>
          </div>
        </div>

        {/* OPAC Search Bar */}
        <div className="pt-2 max-w-2xl relative z-10">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 absolute left-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search published E-Library by book title, author, subject, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-2xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 backdrop-blur-md shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-xs text-slate-400 hover:text-white px-2 py-1 bg-white/10 rounded-lg"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Quick Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <span className="text-2xs font-mono font-bold text-slate-400">12,500+ Physical Volumes</span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Classical Homoeopathic Repository</h3>
          <p className="text-xs text-slate-500">Comprehensive collection of classic Hahnemannian treatises, rare journals, and medical textbooks.</p>
        </Card>

        <Card className="p-6 space-y-2 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <Laptop className="h-8 w-8 text-emerald-600" />
            <span className="text-2xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">PDF Direct View</span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Embedded Responsive PDF Viewer</h3>
          <p className="text-xs text-slate-500">Full-featured document reader supporting page navigation, zoom, rotation, printing, and downloading.</p>
        </Card>

        <Card className="p-6 space-y-2 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between">
            <Clock className="h-8 w-8 text-amber-600" />
            <span className="text-2xs font-mono font-bold text-slate-400">Reading Room Timings</span>
          </div>
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Air-Conditioned Reading Hall</h3>
          <p className="text-xs text-slate-500">Mon - Sat: 08:30 AM - 07:00 PM. High-speed Wi-Fi and digital catalog workstations.</p>
        </Card>
      </div>

      {/* CATEGORY & FILTER CONTROLS */}
      <div className="space-y-4">
        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#002147] text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filter Bar */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xs">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-slate-700 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-slate-400 uppercase text-3xs font-black tracking-widest">
              <Filter className="w-3.5 h-3.5 text-emerald-500" /> Filter Catalog:
            </span>

            {/* Department Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-normal">Department:</span>
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Format Filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-normal">Format:</span>
              <select
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="All">All Formats</option>
                <option value="PDF">PDF Documents</option>
                <option value="PPTX">PowerPoint (PPTX)</option>
                <option value="DOCX">Word (DOCX)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchBooks}
              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Refresh Catalog"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-xl border border-emerald-200">
              Showing {filteredBooks.length} Resources
            </span>
          </div>
        </div>
      </div>

      {/* PUBLIC E-LIBRARY BOOKS GRID */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-20 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <RefreshCw className="w-8 h-8 text-emerald-500 animate-spin mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Loading Central E-Library digital repository...
            </p>
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="py-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
            <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No matching library resources found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Try adjusting your search query, selecting "All" categories, or clearing filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
                setSelectedDept('All');
                setSelectedFormat('All');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 transition cursor-pointer"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((b) => (
              <Card
                key={b.id}
                className="p-6 space-y-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                      {b.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded uppercase">
                      {b.fileFormat || 'PDF'}
                    </span>
                  </div>

                  {/* Title & Author */}
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Author / Publisher: <strong className="text-slate-700 dark:text-slate-200">{b.author}</strong>
                    </p>
                  </div>

                  {/* Meta Details */}
                  <div className="bg-slate-50 dark:bg-slate-850 p-3 rounded-xl border border-slate-100 dark:border-slate-800 text-2xs space-y-1">
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Department:</span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[160px]">{b.department || 'General'}</span>
                    </div>
                    <div className="flex justify-between text-slate-600 dark:text-slate-400">
                      <span>Acc No / Semester:</span>
                      <span className="font-mono text-slate-800 dark:text-slate-200">{b.accessionNo || b.semester || 'BHMS'}</span>
                    </div>
                    {b.fileSize && (
                      <div className="flex justify-between text-slate-600 dark:text-slate-400">
                        <span>File Size & Pages:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{b.fileSize} • {b.pageCount || 10} Pages</span>
                      </div>
                    )}
                  </div>

                  {/* Description Snippet */}
                  {b.description && (
                    <p className="text-3xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {b.description}
                    </p>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3 text-3xs font-mono text-slate-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-blue-500" /> {b.viewsCount || 0}</span>
                    <span className="flex items-center gap-1"><Download className="w-3 h-3 text-emerald-500" /> {b.downloadsCount || 0}</span>
                  </div>

                  <button
                    onClick={() => handleOpenReader(b)}
                    className="px-3.5 py-2 bg-[#002147] hover:bg-emerald-600 text-white rounded-xl text-xs font-extrabold transition shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Read / Open PDF</span>
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* POPUP FULLSCREEN PDF DOCUMENT VIEWER MODAL */}
      {activeReadingBook && (
        <UniversalDocumentViewer
          book={activeReadingBook}
          onClose={() => setActiveReadingBook(null)}
          canDownload={activeReadingBook.allowDownload !== false}
        />
      )}
    </div>
  );
};
