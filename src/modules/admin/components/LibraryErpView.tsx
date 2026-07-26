import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  RotateCcw,
  Barcode,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Download,
  Filter,
  UserCheck,
  Bookmark,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
} from 'lucide-react';

interface BookItem {
  id: string;
  accNo: string;
  title: string;
  author: string;
  isbn: string;
  category: 'ORGANON' | 'MATERIA_MEDICA' | 'REPERTORY' | 'ANATOMY' | 'PHYSIOLOGY' | 'PATHOLOGY' | 'JOURNAL';
  totalCopies: number;
  availableCopies: number;
  rackNo: string;
  publisher: string;
}

interface CirculationRecord {
  id: string;
  issueId: string;
  borrowerName: string;
  borrowerRoll: string;
  borrowerRole: 'STUDENT' | 'FACULTY';
  bookTitle: string;
  accNo: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  fineAmount: number;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
}

export const LibraryErpView: React.FC = () => {
  const [books, setBooks] = useState<BookItem[]>([
    {
      id: 'BK-001',
      accNo: 'ACC-2024-0012',
      title: 'Organon of Medicine (6th Edition)',
      author: 'Dr. Samuel Hahnemann',
      isbn: '978-8131903215',
      category: 'ORGANON',
      totalCopies: 25,
      availableCopies: 18,
      rackNo: 'RACK-A2-04',
      publisher: 'B. Jain Publishers',
    },
    {
      id: 'BK-002',
      accNo: 'ACC-2024-0045',
      title: 'Keynotes and Characteristics with Comparisons',
      author: 'Dr. H.C. Allen',
      isbn: '978-8131900382',
      category: 'MATERIA_MEDICA',
      totalCopies: 30,
      availableCopies: 12,
      rackNo: 'RACK-B1-02',
      publisher: 'B. Jain Publishers',
    },
    {
      id: 'BK-003',
      accNo: 'ACC-2024-0098',
      title: 'Repertory of the Homoeopathic Materia Medica',
      author: 'Dr. J.T. Kent',
      isbn: '978-8131900016',
      category: 'REPERTORY',
      totalCopies: 20,
      availableCopies: 5,
      rackNo: 'RACK-C3-01',
      publisher: 'B. Jain Publishers',
    },
    {
      id: 'BK-004',
      accNo: 'ACC-2024-0150',
      title: 'BD Chaurasia Human Anatomy (Vol 1-4)',
      author: 'B.D. Chaurasia',
      isbn: '978-9388902724',
      category: 'ANATOMY',
      totalCopies: 40,
      availableCopies: 22,
      rackNo: 'RACK-D2-08',
      publisher: 'CBS Publishers',
    },
  ]);

  const [circulations, setCirculations] = useState<CirculationRecord[]>([
    {
      id: 'CIRC-001',
      issueId: 'ISS-8812',
      borrowerName: 'Surojit Das',
      borrowerRoll: 'BHMS/2023/042',
      borrowerRole: 'STUDENT',
      bookTitle: 'Organon of Medicine (6th Edition)',
      accNo: 'ACC-2024-0012',
      issueDate: '2026-07-01',
      dueDate: '2026-07-15',
      fineAmount: 50,
      status: 'OVERDUE',
    },
    {
      id: 'CIRC-002',
      issueId: 'ISS-8815',
      borrowerName: 'Dr. Debabrata Sen',
      borrowerRoll: 'FAC-HOM-009',
      borrowerRole: 'FACULTY',
      bookTitle: 'Repertory of the Homoeopathic Materia Medica',
      accNo: 'ACC-2024-0098',
      issueDate: '2026-07-10',
      dueDate: '2026-08-10',
      fineAmount: 0,
      status: 'ISSUED',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'catalog' | 'circulation' | 'e-library' | 'fines' | 'reservations'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  // Issue Form State
  const [issueBookAccNo, setIssueBookAccNo] = useState('');
  const [issueStudentRoll, setIssueStudentRoll] = useState('');

  const filteredBooks = books.filter((b) => {
    const matchesQuery =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.accNo.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || b.category === selectedCategory;
    return matchesQuery && matchesCat;
  });

  const handleIssueBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!issueBookAccNo || !issueStudentRoll) return;

    const book = books.find((b) => b.accNo === issueBookAccNo);
    if (!book || book.availableCopies <= 0) {
      alert('Book not found or no copies available!');
      return;
    }

    const newCirculation: CirculationRecord = {
      id: `CIRC-${Date.now()}`,
      issueId: `ISS-${Math.floor(1000 + Math.random() * 9000)}`,
      borrowerName: 'Student Member (' + issueStudentRoll + ')',
      borrowerRoll: issueStudentRoll,
      borrowerRole: 'STUDENT',
      bookTitle: book.title,
      accNo: book.accNo,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      fineAmount: 0,
      status: 'ISSUED',
    };

    setCirculations([newCirculation, ...circulations]);
    setBooks(books.map((b) => (b.accNo === issueBookAccNo ? { ...b, availableCopies: b.availableCopies - 1 } : b)));
    setIssueBookAccNo('');
    setIssueStudentRoll('');
    alert('Book issued successfully!');
  };

  const handleReturnBook = (id: string) => {
    setCirculations(
      circulations.map((c) =>
        c.id === id ? { ...c, status: 'RETURNED', returnDate: new Date().toISOString().split('T')[0] } : c
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#002147] text-white p-6 rounded-2xl shadow-md border border-blue-900 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-amber-400 text-slate-900 font-extrabold text-[10px] rounded-full uppercase">
              BHMC DIGITAL LIBRARY ERP
            </span>
            <span className="text-xs text-blue-200">• KOHA-Standard Cataloging</span>
          </div>
          <h2 className="text-2xl font-black mt-1">Central Medical Library Terminal</h2>
          <p className="text-xs text-blue-200">
            Book accession cataloging, circulation RFID issue/return, Homoeopathic e-journals & overdue fine register
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert('Opening Add Book Volume Form...')}
            className="px-4 py-2 bg-[#00A651] hover:bg-emerald-600 text-white font-bold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Accession Volume</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold overflow-x-auto">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Accession Catalog ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('circulation')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'circulation'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <RotateCcw className="w-4 h-4 text-emerald-400" />
          <span>Issue / Return Circulation Desk</span>
        </button>

        <button
          onClick={() => setActiveTab('e-library')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'e-library'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4 text-blue-400" />
          <span>Digital E-Library & Archives</span>
        </button>

        <button
          onClick={() => setActiveTab('fines')}
          className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'fines'
              ? 'bg-[#002147] text-white'
              : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4 text-red-400" />
          <span>Overdue Fine Audit</span>
        </button>
      </div>

      {/* Catalog View */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row gap-3 text-xs">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by book title, author name, accession number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-bold"
            >
              <option value="ALL">All Categories</option>
              <option value="ORGANON">Organon of Medicine</option>
              <option value="MATERIA_MEDICA">Materia Medica</option>
              <option value="REPERTORY">Repertory</option>
              <option value="ANATOMY">Human Anatomy</option>
              <option value="PHYSIOLOGY">Physiology</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredBooks.map((book) => (
              <div
                key={book.id}
                className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-[10px] font-bold text-blue-600 dark:text-blue-400">{book.accNo}</span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 font-bold text-[10px]">
                      {book.rackNo}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white mt-1">{book.title}</h3>
                  <p className="text-xs text-slate-500 font-medium">By {book.author}</p>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-400">Available: </span>
                    <span className="font-extrabold text-emerald-600">{book.availableCopies}</span>
                    <span className="text-slate-400"> / {book.totalCopies} Copies</span>
                  </div>
                  <button
                    onClick={() => {
                      setIssueBookAccNo(book.accNo);
                      setActiveTab('circulation');
                    }}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                  >
                    Issue Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Circulation Desk */}
      {activeTab === 'circulation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Issue Form */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Barcode className="w-4 h-4 text-emerald-500" />
              <span>Issue Book Counter</span>
            </h3>

            <form onSubmit={handleIssueBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Accession Number / Barcode
                </label>
                <input
                  type="text"
                  placeholder="e.g. ACC-2024-0012"
                  value={issueBookAccNo}
                  onChange={(e) => setIssueBookAccNo(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Borrower Student Roll No
                </label>
                <input
                  type="text"
                  placeholder="e.g. BHMS/2023/042"
                  value={issueStudentRoll}
                  onChange={(e) => setIssueStudentRoll(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-mono font-bold"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#002147] hover:bg-blue-900 text-white font-bold rounded-xl transition cursor-pointer"
              >
                Confirm Issue Loan (14 Days)
              </button>
            </form>
          </div>

          {/* Active Loans Table */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Active Borrowing Transactions</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200 dark:border-slate-800">
                    <th className="p-3">Borrower</th>
                    <th className="p-3">Book Title</th>
                    <th className="p-3">Issue / Due Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Return</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-[11px]">
                  {circulations.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="p-3">
                        <p className="font-bold text-slate-900 dark:text-white">{c.borrowerName}</p>
                        <p className="font-mono text-[10px] text-slate-400">{c.borrowerRoll}</p>
                      </td>
                      <td className="p-3 font-semibold">{c.bookTitle}</td>
                      <td className="p-3 font-mono text-[10px] text-slate-500">
                        <div>Iss: {c.issueDate}</div>
                        <div className="font-bold text-amber-600">Due: {c.dueDate}</div>
                      </td>
                      <td className="p-3">
                        {c.status === 'RETURNED' ? (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-md">
                            RETURNED
                          </span>
                        ) : c.status === 'OVERDUE' ? (
                          <span className="px-2 py-0.5 bg-red-100 text-red-700 font-bold text-[10px] rounded-md">
                            OVERDUE (₹{c.fineAmount})
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 font-bold text-[10px] rounded-md">
                            ISSUED
                          </span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        {c.status !== 'RETURNED' && (
                          <button
                            onClick={() => handleReturnBook(c.id)}
                            className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg text-xs hover:bg-emerald-700 cursor-pointer"
                          >
                            Return Book
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Digital Library */}
      {activeTab === 'e-library' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">Homoeopathic Digital E-Journal Repository</h3>
          <p className="text-xs text-slate-500">Access digitized rare manuscripts, Organon original German translations & research databases</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Indian Journal of Research in Homoeopathy (IJRH)</h4>
              <p className="text-[10px] text-slate-500">CCRH Official Peer-Reviewed Quarterly Publication (2015-2026)</p>
              <button
                onClick={() => alert('Downloading PDF volume...')}
                className="px-3 py-1 bg-[#002147] text-white text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> Read Journal (PDF)
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">National Digital Library of India (NDLI) Gateway</h4>
              <p className="text-[10px] text-slate-500">Integrated access to 100,000+ medical research theses & e-books</p>
              <button
                onClick={() => alert('Launching NDLI Portal Access...')}
                className="px-3 py-1 bg-[#002147] text-white text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> Launch Portal
              </button>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2">
              <h4 className="font-bold text-xs text-slate-900 dark:text-white">Rare Homoeopathic Classical Manuscripts</h4>
              <p className="text-[10px] text-slate-500">High-resolution scans of Boenninghausen Therapeutic Pocketbook</p>
              <button
                onClick={() => alert('Accessing Rare Manuscript Archive...')}
                className="px-3 py-1 bg-[#002147] text-white text-[10px] font-bold rounded-md flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" /> Open Vault
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Fines */}
      {activeTab === 'fines' && (
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white text-red-600">Pending Overdue Fine Receipts</h3>
          <p className="text-xs text-slate-500">Automated ₹5/day penalty calculator for books returned after 14-day loan threshold</p>
          <div className="p-4 bg-red-50 dark:bg-red-950/40 rounded-xl border border-red-200 dark:border-red-900 flex justify-between items-center text-xs">
            <div>
              <p className="font-bold text-red-800 dark:text-red-300">Total Uncollected Overdue Fines</p>
              <p className="text-lg font-black text-red-600">₹450.00</p>
            </div>
            <button
              onClick={() => alert('Generating Fine Collection Clearance Receipts...')}
              className="px-4 py-2 bg-red-600 text-white font-bold rounded-xl cursor-pointer"
            >
              Collect Fine Clearance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
