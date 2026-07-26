import React, { useState } from 'react';
import { LibraryBook, UserRole } from '../types';
import { BookOpen, Lock, Download, Shield, Search, Bookmark, ChevronLeft, ChevronRight, AlertCircle, Eye } from 'lucide-react';

interface SecureELibraryProps {
  books: LibraryBook[];
  userRole: UserRole;
  onUploadBook?: (book: LibraryBook) => void;
}

export const SecureELibrary: React.FC<SecureELibraryProps> = ({ books, userRole, onUploadBook }) => {
  const [selectedBook, setSelectedBook] = useState<LibraryBook | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [readingNotice, setReadingNotice] = useState(false);

  const isStudent = userRole === 'student' || userRole === 'patient' || userRole === 'guest';
  const canUpload = ['super_admin', 'principal', 'librarian', 'faculty', 'hod'].includes(userRole);

  const categories = ['All', 'Materia Medica', 'Organon', 'Repertory', 'Pharmacy', 'Medicine', 'Research Journal', 'Question Paper'];

  const filteredBooks = books.filter(b => {
    const matchesCat = selectedCategory === 'All' || b.category === selectedCategory;
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenReader = (book: LibraryBook) => {
    setSelectedBook(book);
    setCurrentPage(0);
    setReadingNotice(true);
    setTimeout(() => setReadingNotice(false), 4000);
  };

  const toggleBookmark = (bookId: string) => {
    if (bookmarks.includes(bookId)) {
      setBookmarks(bookmarks.filter(id => id !== bookId));
    } else {
      setBookmarks([...bookmarks, bookId]);
    }
  };

  // Prevent right-click during reader mode
  const handleContextMenu = (e: React.MouseEvent) => {
    if (isStudent) {
      e.preventDefault();
      alert('Security Policy: Content copying and context menu downloads are disabled for students.');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* HEADER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#002147] dark:text-blue-400" />
            <h3 className="text-sm font-black uppercase tracking-wider text-[#002147] dark:text-white">
              BHMCH Advanced Digital E-Library
            </h3>
          </div>
          <p className="text-3xs text-slate-400 mt-1">
            Access classical homeopathic treatises, Organon archives, repertories, and peer-reviewed AYUSH journals online.
          </p>
        </div>

        {/* SECURITY STATUS BADGE */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-4xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>DRM Reader Active • DRM Download Protection</span>
        </div>
      </div>

      {/* FILTER & SEARCH */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-3xs font-bold uppercase tracking-wider transition whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#002147] text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search book, author..."
            className="w-full pl-9 pr-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-xl text-3xs bg-transparent focus:outline-none focus:border-[#002147]"
          />
        </div>
      </div>

      {/* BOOKS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredBooks.map(book => {
          const isBookmarked = bookmarks.includes(book.id);
          return (
            <div
              key={book.id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img
                    src={book.coverUrl}
                    alt={book.title}
                    className="w-full h-full object-cover opacity-90 hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={() => toggleBookmark(book.id)}
                      className={`p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
                        isBookmarked ? 'bg-amber-500 text-white' : 'bg-black/40 text-white hover:bg-black/60'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-md text-white rounded text-4xs font-mono font-bold uppercase">
                    {book.category}
                  </span>
                </div>

                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-black text-[#002147] dark:text-white line-clamp-2 leading-snug">
                    {book.title}
                  </h4>
                  <p className="text-3xs font-semibold text-slate-500">
                    By {book.author}
                  </p>
                  <p className="text-4xs text-slate-400 font-mono">
                    {book.publisher} • {book.year} • {book.pageCount} Pages
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-slate-50 dark:border-slate-850 flex gap-2 mt-2">
                <button
                  onClick={() => handleOpenReader(book)}
                  className="w-full py-2 bg-[#002147] hover:bg-[#001833] text-white rounded-xl text-3xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Read Online</span>
                </button>

                {(!isStudent || book.allowDownload) ? (
                  <a
                    href="#"
                    onClick={(e) => { e.preventDefault(); alert('Download starting for authorized faculty user.'); }}
                    className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl transition cursor-pointer"
                    title="Download PDF"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                ) : (
                  <span className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-xl cursor-not-allowed" title="Download disabled for students">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* SECURE ONLINE PDF READER MODAL */}
      {selectedBook && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 select-none"
          onContextMenu={handleContextMenu}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full h-[85vh] flex flex-col overflow-hidden shadow-2xl text-slate-100">
            {/* READER NAVBAR */}
            <div className="p-4 bg-slate-950 border-b border-slate-800 flex justify-between items-center text-xs">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-950 border border-blue-800 rounded-xl">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs leading-tight">{selectedBook.title}</h4>
                  <p className="text-4xs text-slate-400 font-mono">
                    Streamed DRM View • Page {currentPage + 1} of {selectedBook.sampleContent.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {isStudent && (
                  <span className="hidden sm:flex items-center gap-1 text-4xs font-bold text-amber-400 bg-amber-950/60 border border-amber-800 px-2.5 py-1 rounded-full">
                    <Lock className="w-3 h-3" />
                    <span>Download Disabled for Students</span>
                  </span>
                )}
                <button
                  onClick={() => setSelectedBook(null)}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold uppercase tracking-wider text-3xs rounded-xl transition cursor-pointer"
                >
                  Close Reader
                </button>
              </div>
            </div>

            {/* SECURITY WARNING NOTICE BANNER */}
            {readingNotice && (
              <div className="bg-amber-500/20 border-b border-amber-500/30 px-4 py-2 text-3xs text-amber-300 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>
                  <strong>Strict DRM Policy:</strong> Text copying, saving, printing, and screenshot capture are strictly disabled to protect library copyright.
                </span>
              </div>
            )}

            {/* SECURE CANVAS READER BODY */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-950/80 space-y-6 text-sm leading-relaxed font-serif text-slate-200">
              <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-xl space-y-6 relative border-t-4 border-t-[#00A651]">
                <div className="text-center border-b border-slate-800 pb-4">
                  <span className="text-4xs font-mono font-bold uppercase tracking-widest text-emerald-400 block">
                    BHMCH E-LIBRARY SECURE STREAM
                  </span>
                  <h2 className="text-base font-bold text-white mt-1">{selectedBook.title}</h2>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">By {selectedBook.author}</p>
                </div>

                <div className="text-xs sm:text-sm text-slate-200 space-y-4 font-serif leading-loose">
                  <p className="first-letter:text-3xl first-letter:font-bold first-letter:text-emerald-400">
                    {selectedBook.sampleContent[currentPage]}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 flex justify-between items-center text-4xs font-mono text-slate-500">
                  <span>Authorized User: {userRole.toUpperCase()}</span>
                  <span>Watermarked Digital Record</span>
                </div>
              </div>
            </div>

            {/* PAGE NAVIGATION CONTROLS */}
            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center text-2xs">
              <button
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Page</span>
              </button>

              <span className="font-mono text-3xs text-slate-400">
                Page {currentPage + 1} / {selectedBook.sampleContent.length}
              </span>

              <button
                disabled={currentPage >= selectedBook.sampleContent.length - 1}
                onClick={() => setCurrentPage(prev => Math.min(selectedBook.sampleContent.length - 1, prev + 1))}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold uppercase tracking-wider rounded-xl transition cursor-pointer flex items-center gap-1.5"
              >
                <span>Next Page</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
