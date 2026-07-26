import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Bookmark,
  Eye,
  Download,
  Lock,
  Unlock,
  Shield,
  Layers,
  Sparkles,
  FileText,
  File,
  CheckCircle2,
  X,
} from 'lucide-react';
import { LibraryBook } from '../../types/index';
import { libraryApi } from '../../services/api/library.api';
import { EmbeddedPdfViewer } from './EmbeddedPdfViewer';

const DEPARTMENTS = [
  'Organon of Medicine & Homoeopathic Philosophy',
  'Homoeopathic Materia Medica',
  'Repertory & Case Taking',
  'Homoeopathic Pharmacy',
  'Practice of Medicine',
  'Anatomy',
  'Physiology & Biochemistry',
  'Pathology & Microbiology',
  'Community Medicine',
  'Forensic Medicine & Toxicology',
  'Surgery & Homoeopathic Therapeutics',
  'Obstetrics & Gynaecology',
];

const SEMESTERS = ['1st BHMS', '2nd BHMS', '3rd BHMS', '4th BHMS', 'PG Homoeopathy'];

const CATEGORIES = [
  'All',
  'Materia Medica',
  'Organon',
  'Repertory',
  'Pharmacy',
  'Practice of Medicine',
  'Anatomy',
  'Physiology',
  'Pathology',
  'Research Journal',
  'Question Paper',
];

export const StudentDigitalLibraryView: React.FC = () => {
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);

  // Active Reader
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const res = await libraryApi.getBooks();
        if (res.data) setBooks(res.data);
      } catch (err) {
        console.error('Error fetching student library books:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, []);

  const toggleBookmark = async (bookId: string) => {
    try {
      await libraryApi.toggleBookmark(bookId);
      if (bookmarks.includes(bookId)) {
        setBookmarks(bookmarks.filter((id) => id !== bookId));
      } else {
        setBookmarks([...bookmarks, bookId]);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    }
  };

  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.subject && b.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesDept = selectedDept === 'All' || b.department === selectedDept;
    const matchesSemester = selectedSemester === 'All' || b.semester === selectedSemester;
    const matchesFormat = selectedFormat === 'All' || b.fileFormat === selectedFormat;
    const matchesBookmark = !onlyBookmarks || bookmarks.includes(b.id) || b.isBookmarked;

    return (
      matchesSearch &&
      matchesCat &&
      matchesDept &&
      matchesSemester &&
      matchesFormat &&
      matchesBookmark
    );
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* STUDENT HEADER */}
      <div className="bg-gradient-to-r from-[#002147] via-[#003366] to-[#00A651] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-black uppercase tracking-wider">
                Student E-Library
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full text-xs font-semibold">
                BHMS Academic Repository
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Homoeopathic Digital Library & Reading Room
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium">
              Read classical homeopathic literature, lecture presentations, faculty notes, and official BHMS question papers online with built-in DRM streaming.
            </p>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-xs font-bold shrink-0">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>DRM Protected Portal</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 rounded-3xl space-y-4 shadow-xs">
        {/* Category Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold tracking-wide transition cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#002147] text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Dropdown Filters and Search */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, author, subject..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-[#002147] dark:text-white"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {/* Department */}
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments</option>
              {DEPARTMENTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Semester */}
            <select
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All Semesters</option>
              {SEMESTERS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            {/* Format */}
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
            >
              <option value="All">All Formats</option>
              <option value="PDF">PDF Books</option>
              <option value="DOCX">DOC / DOCX Notes</option>
              <option value="PPTX">PPT Lectures</option>
            </select>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                onlyBookmarks
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarks</span>
            </button>
          </div>
        </div>
      </div>

      {/* BOOKS GRID */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 font-bold text-xs bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          Loading library catalog...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div className="p-16 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">
            No matching resources found
          </h3>
          <p className="text-xs text-slate-400">
            Try adjusting your search query, department, or semester filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const isBookmarked = bookmarks.includes(book.id) || book.isBookmarked;
            return (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-xl transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Cover Header */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img
                      src={
                        book.coverUrl ||
                        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80'
                      }
                      alt={book.title}
                      className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                    <div className="absolute top-3 right-3 flex gap-1.5 z-10">
                      <button
                        onClick={() => toggleBookmark(book.id)}
                        className={`p-2 rounded-full backdrop-blur-md transition cursor-pointer ${
                          isBookmarked
                            ? 'bg-amber-500 text-white shadow-lg'
                            : 'bg-black/50 text-white hover:bg-black/80'
                        }`}
                        title="Bookmark Resource"
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <span className="absolute bottom-3 left-3 px-2.5 py-1 bg-black/80 backdrop-blur-md text-emerald-400 rounded-lg text-[10px] font-mono font-bold uppercase border border-emerald-500/30">
                      {book.fileFormat || 'PDF'} • {book.category}
                    </span>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-2">
                    <h3 className="font-extrabold text-slate-900 dark:text-white text-sm line-clamp-2 leading-snug">
                      {book.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">By {book.author}</p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      {book.department || 'BHMCH Faculty'} • {book.semester || 'All Semesters'}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                  <button
                    onClick={() => setActiveReadingBook(book)}
                    className="flex-1 py-2.5 bg-[#002147] hover:bg-[#001833] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-emerald-400" />
                    <span>Read Online</span>
                  </button>

                  {book.allowDownload ? (
                    <button
                      onClick={() => {
                        alert(`Starting download for: ${book.title}`);
                      }}
                      className="p-2.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl transition cursor-pointer"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  ) : (
                    <span
                      className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl cursor-not-allowed"
                      title="Download restricted by faculty"
                    >
                      <Lock className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EMBEDDED PDF READER MODAL */}
      {activeReadingBook && (
        <EmbeddedPdfViewer
          book={activeReadingBook}
          onClose={() => setActiveReadingBook(null)}
          canDownload={activeReadingBook.allowDownload ?? false}
        />
      )}
    </div>
  );
};
