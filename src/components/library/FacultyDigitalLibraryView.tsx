import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  BookOpen,
  FileText,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  Search,
  Filter,
  BarChart2,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileCode,
  File,
  Layers,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Bookmark,
  X,
  Lock,
  Unlock,
  FileSpreadsheet,
  Presentation,
  Image as ImageIcon,
  Archive,
  RefreshCw,
} from 'lucide-react';
import { LibraryBook, DigitalResourceType, DigitalFileFormat } from '../../types/index';
import { libraryApi } from '../../services/api/library.api';
import { UniversalDocumentViewer } from './UniversalDocumentViewer';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayDesignation } from '../../utils/permissionHelper';

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

const SEMESTERS = ['1st BHMS', '2nd BHMS', '3rd BHMS', '4th BHMS', 'PG Homoeopathy', 'Faculty Reference'];

const CATEGORIES = [
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

export const FacultyDigitalLibraryView: React.FC = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState<LibraryBook[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedSemester, setSelectedSemester] = useState<string>('All');
  const [selectedFormat, setSelectedFormat] = useState<string>('All');

  // Reader Modal State
  const [activeReadingBook, setActiveReadingBook] = useState<LibraryBook | null>(null);

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<LibraryBook | null>(null);

  // File Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  // Form Fields
  const [formData, setFormData] = useState({
    title: '',
    author: user?.fullName || 'Faculty Member',
    category: 'Materia Medica',
    department: DEPARTMENTS[0],
    semester: SEMESTERS[2],
    subject: 'Organon & Philosophy',
    year: '2026',
    publisher: 'BHMCH Academic Press',
    pageCount: 150,
    resourceType: 'BOOK' as DigitalResourceType,
    fileFormat: 'PDF' as DigitalFileFormat,
    allowDownload: true,
    description: '',
  });

  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await libraryApi.getBooks();
      if (res.data) setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch library items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3500);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const detectFormatFromFilename = (name: string): DigitalFileFormat => {
    const ext = name.split('.').pop()?.toUpperCase();
    if (ext === 'DOC' || ext === 'DOCX') return 'DOCX' as DigitalFileFormat;
    if (ext === 'PPT' || ext === 'PPTX') return 'PPTX' as DigitalFileFormat;
    if (ext === 'XLS' || ext === 'XLSX') return 'DOCX' as DigitalFileFormat;
    if (ext === 'TXT') return 'DOCX' as DigitalFileFormat;
    return 'PDF' as DigitalFileFormat;
  };

  const processSelectedFile = (file: File) => {
    // 50MB Max Check
    if (file.size > 50 * 1024 * 1024) {
      showToast('File size exceeds the 50MB maximum limit', 'error');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(10);

    const detectedFmt = detectFormatFromFilename(file.name);
    setFormData((prev) => ({
      ...prev,
      fileFormat: detectedFmt,
      title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
    }));

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 25;
      });
    }, 150);

    // Read Data URL for preview/download
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setFileDataUrl(null);
    setUploadProgress(0);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleOpenUpload = (bookToEdit?: LibraryBook) => {
    setSelectedFile(null);
    setFileDataUrl(null);
    setUploadProgress(0);
    setIsUploading(false);

    if (bookToEdit) {
      setEditingBook(bookToEdit);
      setFormData({
        title: bookToEdit.title,
        author: bookToEdit.author,
        category: bookToEdit.category,
        department: bookToEdit.department || DEPARTMENTS[0],
        semester: bookToEdit.semester || SEMESTERS[2],
        subject: bookToEdit.subject || '',
        year: bookToEdit.year?.toString() || '2026',
        publisher: bookToEdit.publisher || 'BHMCH Academic Press',
        pageCount: bookToEdit.pageCount || 100,
        resourceType: bookToEdit.resourceType || 'BOOK',
        fileFormat: bookToEdit.fileFormat || 'PDF',
        allowDownload: bookToEdit.allowDownload ?? true,
        description: bookToEdit.description || '',
      });
    } else {
      setEditingBook(null);
      setFormData({
        title: '',
        author: user?.fullName || 'Faculty Member',
        category: 'Materia Medica',
        department: DEPARTMENTS[0],
        semester: SEMESTERS[2],
        subject: 'Organon & Philosophy',
        year: '2026',
        publisher: 'BHMCH Academic Press',
        pageCount: 150,
        resourceType: 'BOOK',
        fileFormat: 'PDF',
        allowDownload: true,
        description: '',
      });
    }
    setIsUploadOpen(true);
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a valid resource title', 'error');
      return;
    }

    try {
      if (editingBook) {
        const res = await libraryApi.updateResource(editingBook.id, {
          title: formData.title,
          author: formData.author,
          category: formData.category,
          department: formData.department,
          semester: formData.semester,
          subject: formData.subject,
          year: parseInt(formData.year, 10) || 2026,
          publisher: formData.publisher,
          pageCount: formData.pageCount,
          resourceType: formData.resourceType,
          fileFormat: formData.fileFormat,
          allowDownload: formData.allowDownload,
          description: formData.description,
          fileName: selectedFile?.name || editingBook.fileName,
          fileSize: selectedFile ? formatFileSize(selectedFile.size) : editingBook.fileSize,
          fileDataUrl: fileDataUrl || editingBook.fileDataUrl,
        });
        if (res.data) {
          setBooks((prev) => prev.map((b) => (b.id === editingBook.id ? res.data : b)));
          showToast('Resource updated successfully');
        }
      } else {
        const newResourcePayload = {
          title: formData.title,
          author: formData.author || user?.fullName || 'Faculty Member',
          category: formData.category,
          department: formData.department,
          semester: formData.semester,
          subject: formData.subject,
          year: parseInt(formData.year, 10) || 2026,
          publisher: formData.publisher,
          pageCount: formData.pageCount,
          resourceType: formData.resourceType,
          fileFormat: formData.fileFormat,
          allowDownload: formData.allowDownload,
          uploadedBy: user?.fullName || 'Faculty Member',
          uploadedByRole: getUserDisplayDesignation(user),
          uploadedAt: new Date().toISOString().split('T')[0],
          description: formData.description,
          fileName: selectedFile?.name || `${formData.title.replace(/\s+/g, '_')}.${formData.fileFormat.toLowerCase()}`,
          fileSize: selectedFile ? formatFileSize(selectedFile.size) : '4.5 MB',
          fileDataUrl: fileDataUrl || undefined,
          coverUrl:
            formData.fileFormat === 'PPTX'
              ? 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=400&q=80'
              : formData.fileFormat === 'DOCX'
              ? 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=400&q=80'
              : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80',
        };
        const res = await libraryApi.addResource(newResourcePayload);
        if (res.data) {
          setBooks((prev) => [res.data, ...prev]);
          showToast('New digital resource published successfully!');
        }
      }
      setIsUploadOpen(false);
    } catch (err) {
      showToast('Failed to save resource', 'error');
    }
  };

  const handleDeleteResource = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await libraryApi.deleteResource(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      showToast('Resource deleted successfully');
    } catch (err) {
      showToast('Failed to delete resource', 'error');
    }
  };

  // Filtered list
  const filteredBooks = books.filter((b) => {
    const matchesSearch =
      b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.subject && b.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesDept = selectedDept === 'All' || b.department === selectedDept;
    const matchesSemester = selectedSemester === 'All' || b.semester === selectedSemester;
    const matchesFormat = selectedFormat === 'All' || b.fileFormat === selectedFormat;

    return matchesSearch && matchesDept && matchesSemester && matchesFormat;
  });

  // Calculate statistics
  const totalUploads = books.length;
  const totalDownloads = books.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  const totalViews = books.reduce((acc, curr) => acc + (curr.viewCount || 0), 0);
  const pdfCount = books.filter((b) => b.fileFormat === 'PDF').length;
  const docCount = books.filter((b) => b.fileFormat === 'DOCX').length;
  const pptCount = books.filter((b) => b.fileFormat === 'PPTX').length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-2xl border text-xs font-bold flex items-center gap-2 animate-bounce ${
            notification.type === 'success'
              ? 'bg-emerald-900 border-emerald-700 text-emerald-100'
              : 'bg-rose-900 border-rose-700 text-rose-100'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* FACULTY DIGITAL LIBRARY HEADER */}
      <div className="bg-gradient-to-r from-[#002147] via-[#003366] to-[#00A651] rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white border border-white/20 rounded-full text-xs font-black uppercase tracking-wider">
                Faculty Workspace
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 rounded-full text-xs font-semibold">
                {getUserDisplayDesignation(user)} Access Enabled
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Faculty Digital Library & Knowledge Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 max-w-2xl font-medium">
              Publish PDF treatises, clinical lecture notes, PPT presentations, and past BHMS question papers for student scholarship and academic archival.
            </p>
          </div>

          <button
            onClick={() => handleOpenUpload()}
            className="px-5 py-3 bg-[#00A651] hover:bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl shadow-lg transition duration-200 flex items-center gap-2.5 cursor-pointer shrink-0 border border-emerald-400/30"
          >
            <Upload className="w-4 h-4" />
            <span>Upload New E-Resource</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-xl text-blue-600 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Total Published</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{totalUploads} Files</h3>
            <p className="text-[10px] text-slate-500">{pdfCount} PDF • {docCount} DOC • {pptCount} PPT</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-emerald-600 dark:text-emerald-400">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Total Downloads</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{totalDownloads} Times</h3>
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">+18% this month</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 rounded-xl text-purple-600 dark:text-purple-400">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Student Online Reads</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{totalViews} Views</h3>
            <p className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold">Active Reader Streaming</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-600 dark:text-amber-400">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xs font-bold text-slate-400 uppercase tracking-wider">Active Departments</p>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mt-0.5">{DEPARTMENTS.length} Depts</h3>
            <p className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">1st-4th BHMS Coverage</p>
          </div>
        </div>
      </div>

      {/* SEARCH AND FILTER BAR */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-4 rounded-2xl flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resource, author, or subject..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-[#002147] dark:text-white"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Department Filter */}
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="All">All Departments</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>

          {/* Semester Filter */}
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="All">All Semesters</option>
            {SEMESTERS.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>

          {/* Format Filter */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-xl focus:outline-none cursor-pointer"
          >
            <option value="All">All Formats</option>
            <option value="PDF">PDF Documents</option>
            <option value="DOCX">Word Documents (DOCX)</option>
            <option value="PPTX">Presentations (PPTX)</option>
          </select>
        </div>
      </div>

      {/* RESOURCE MANAGEMENT TABLE / CARDS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        <div className="p-5 border-b border-slate-200/80 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#002147] dark:text-emerald-400" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm uppercase tracking-wider">
              Faculty Published E-Resources ({filteredBooks.length})
            </h3>
          </div>
          <span className="text-2xs font-mono font-bold text-slate-400">
            Showing {filteredBooks.length} of {books.length} Total
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 font-bold text-xs">
            Loading digital library resources...
          </div>
        ) : filteredBooks.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              No digital resources found matching your current filters.
            </p>
            <button
              onClick={() => handleOpenUpload()}
              className="px-4 py-2 bg-[#002147] text-white text-xs font-bold rounded-xl hover:bg-[#001833] transition"
            >
              Upload First Resource
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-400 font-mono text-[10px] uppercase tracking-wider">
                  <th className="p-4 font-bold">Resource Title & Format</th>
                  <th className="p-4 font-bold">Department & Semester</th>
                  <th className="p-4 font-bold">Uploaded By</th>
                  <th className="p-4 font-bold">Permissions</th>
                  <th className="p-4 font-bold">Stats</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            book.fileFormat === 'PDF'
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200'
                              : book.fileFormat === 'PPTX'
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border border-blue-200'
                          }`}
                        >
                          {book.fileFormat || 'PDF'}
                        </div>
                        <div>
                          <h4 className="font-extrabold text-slate-900 dark:text-white line-clamp-1 max-w-xs">
                            {book.title}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-medium">
                            By {book.author} • {book.category} {book.subject ? `• ${book.subject}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-slate-200 block line-clamp-1">
                          {book.department || 'Central Academic'}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                          {book.semester || 'All Semesters'}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{book.uploadedBy || 'Faculty'}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{book.uploadedByRole || 'Faculty'}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      {book.allowDownload ? (
                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 rounded text-[10px] font-bold flex items-center gap-1 w-max">
                          <Unlock className="w-3 h-3 text-emerald-500" />
                          <span>Download Allowed</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400 border border-amber-200 rounded text-[10px] font-bold flex items-center gap-1 w-max">
                          <Lock className="w-3 h-3 text-amber-500" />
                          <span>Read Online Only</span>
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <div className="font-mono text-[10px] text-slate-500 space-y-0.5">
                        <p className="flex items-center gap-1">
                          <Eye className="w-3 h-3 text-purple-500" />
                          <span>{book.viewCount || 0} Reads</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <Download className="w-3 h-3 text-emerald-500" />
                          <span>{book.downloadCount || 0} Downloads</span>
                        </p>
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveReadingBook(book)}
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg transition cursor-pointer"
                          title="Open in Embedded PDF Reader"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenUpload(book)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 rounded-lg transition cursor-pointer"
                          title="Edit Resource"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteResource(book.id, book.title)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 rounded-lg transition cursor-pointer"
                          title="Delete Resource"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* UNIVERSAL DOCUMENT READER MODAL */}
      {activeReadingBook && (
        <UniversalDocumentViewer
          book={activeReadingBook}
          onClose={() => setActiveReadingBook(null)}
          canDownload={true}
        />
      )}

      {/* UPLOAD / EDIT MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 bg-[#002147] text-white rounded-xl">
                  <Upload className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                    {editingBook ? 'Edit Published Resource' : 'Publish New E-Library Resource'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {getUserDisplayDesignation(user)} Authorized Upload Gateway
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-xl transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveResource} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Kent's Comparative Repertory Notes for 3rd BHMS"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#002147] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Author / Presenter
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#002147] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    File Format
                  </label>
                  <select
                    value={formData.fileFormat}
                    onChange={(e) =>
                      setFormData({ ...formData, fileFormat: e.target.value as DigitalFileFormat })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none cursor-pointer dark:text-white"
                  >
                    <option value="PDF">PDF Portable Document</option>
                    <option value="DOCX">DOC / DOCX Word File</option>
                    <option value="PPTX">PPT / PPTX Presentation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none cursor-pointer dark:text-white"
                  >
                    {DEPARTMENTS.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Semester / Target Batch
                  </label>
                  <select
                    value={formData.semester}
                    onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none cursor-pointer dark:text-white"
                  >
                    {SEMESTERS.map((sem) => (
                      <option key={sem} value={sem}>
                        {sem}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Subject Name
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Organon & Philosophy"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold focus:outline-none focus:border-[#002147] dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold focus:outline-none cursor-pointer dark:text-white"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Student Download Permissions
                  </label>
                  <div className="flex items-center gap-6 p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                      <input
                        type="radio"
                        name="allowDownload"
                        checked={formData.allowDownload === true}
                        onChange={() => setFormData({ ...formData, allowDownload: true })}
                        className="text-emerald-600 focus:ring-emerald-500"
                      />
                      <span>Allow PDF/File Download</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-800 dark:text-slate-200">
                      <input
                        type="radio"
                        name="allowDownload"
                        checked={formData.allowDownload === false}
                        onChange={() => setFormData({ ...formData, allowDownload: false })}
                        className="text-rose-600 focus:ring-rose-500"
                      />
                      <span>Restricted (Read Online Only)</span>
                    </label>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Description / Academic Synopsis
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Provide a brief summary of the lecture notes or textbook..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-medium focus:outline-none focus:border-[#002147] dark:text-white"
                  />
                </div>

                {/* DIGITAL LIBRARY FILE UPLOAD SYSTEM */}
                <div className="sm:col-span-2 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3">
                  <label className="block text-2xs font-extrabold uppercase text-slate-500 mb-1">
                    Upload Resource Document (PDF, DOC/X, PPT/X, XLS/X, TXT, Image, ZIP)
                  </label>

                  <input
                    ref={fileInputRef}
                    type="file"
                    onChange={handleFileChange}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.png,.jpg,.jpeg,.webp,.zip"
                    className="hidden"
                  />

                  {!selectedFile ? (
                    <div
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                        isDragOver
                          ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20'
                          : 'border-slate-300 dark:border-slate-700 hover:border-[#002147] dark:hover:border-emerald-400 bg-slate-50/50 dark:bg-slate-800/50'
                      }`}
                    >
                      <div className="p-3 bg-[#002147]/10 dark:bg-emerald-950/50 text-[#002147] dark:text-emerald-400 rounded-full">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                          Click to Choose File or Drag & Drop here
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                          Supports PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, Images, ZIP up to 50MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="mt-1 px-3.5 py-1.5 bg-[#002147] hover:bg-[#001833] text-white text-xs font-bold rounded-xl transition"
                      >
                        Choose File
                      </button>
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-2.5 bg-[#002147] text-white rounded-xl shrink-0 font-black text-2xs uppercase">
                            {selectedFile.name.split('.').pop()?.toUpperCase() || 'FILE'}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                              {selectedFile.name}
                            </h4>
                            <p className="text-[10px] text-slate-400 font-mono">
                              {formatFileSize(selectedFile.size)} • {selectedFile.type || 'Document'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="p-2 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 rounded-xl text-xs font-bold hover:bg-blue-100 transition cursor-pointer flex items-center gap-1"
                            title="Replace File"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Replace</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveFile}
                            className="p-2 bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300 rounded-xl text-xs font-bold hover:bg-rose-100 transition cursor-pointer flex items-center gap-1"
                            title="Remove File"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>

                      {/* UPLOAD PROGRESS BAR */}
                      {isUploading || uploadProgress < 100 ? (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-slate-500">
                            <span>Processing File Upload...</span>
                            <span>{uploadProgress}%</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-emerald-500 transition-all duration-300"
                              style={{ width: `${uploadProgress}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-extrabold text-[11px]">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>File Ready for Publishing</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#002147] hover:bg-[#001833] text-white font-extrabold text-xs rounded-xl transition shadow-md cursor-pointer flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{editingBook ? 'Save Changes' : 'Publish Resource'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
