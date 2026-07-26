import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, GraduationCap, BookOpen, FileText, FlaskConical, Library, Building2, Bell, Stethoscope, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchResultItem {
  id: string;
  type: 'Student' | 'Subject' | 'Assignment' | 'Research' | 'Book' | 'Department' | 'Notice' | 'Hospital';
  title: string;
  subtitle: string;
  route: string;
  badge?: string;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  // Students
  { id: 's1', type: 'Student', title: 'Rahul Sharma', subtitle: '1st BHMS • Roll No. 104', route: '/faculty/attendance', badge: 'Active' },
  { id: 's2', type: 'Student', title: 'Ananya Das', subtitle: '2nd BHMS • Roll No. 212', route: '/faculty/attendance', badge: 'Distinction' },
  { id: 's3', type: 'Student', title: 'Priya Mukherjee', subtitle: '3rd BHMS • Roll No. 308', route: '/faculty/attendance', badge: 'Active' },

  // Subjects
  { id: 'sub1', type: 'Subject', title: 'Organon of Medicine & Homoeopathic Philosophy', subtitle: '1st & 2nd BHMS Core Module', route: '/faculty/classes', badge: 'Theory' },
  { id: 'sub2', type: 'Subject', title: 'Homoeopathic Materia Medica', subtitle: '2nd & 3rd BHMS Core Module', route: '/faculty/classes', badge: 'Theory' },
  { id: 'sub3', type: 'Subject', title: 'Homoeopathic Pharmacy & Pharmacognosy', subtitle: '1st BHMS Practical & Lab', route: '/faculty/classes', badge: 'Practical' },

  // Assignments
  { id: 'a1', type: 'Assignment', title: 'Chronic Case Taking Logbook #4', subtitle: 'Due 28th July • 2nd BHMS Batch A', route: '/faculty/assignments', badge: '24 Submissions' },
  { id: 'a2', type: 'Assignment', title: 'Potentisation & Trituration Lab Report', subtitle: 'Due 30th July • 1st BHMS Batch B', route: '/faculty/assignments', badge: '18 Submissions' },

  // Research
  { id: 'r1', type: 'Research', title: 'AYUSH Trial: Homoeopathic Efficacy in Allergic Rhinitis', subtitle: 'CCRH Funded • Phase II Clinical Trial', route: '/faculty/research', badge: 'Ongoing' },
  { id: 'r2', type: 'Research', title: 'Nano-dilution Spectroscopic Study of Arsenicum Album', subtitle: 'Joint Academic Paper with WBUHS', route: '/faculty/research', badge: 'Under Review' },

  // Books
  { id: 'b1', type: 'Book', title: "Kent's Lectures on Homoeopathic Philosophy", subtitle: 'E-Book Ref: LIB-2026-88', route: '/faculty/library', badge: 'Available' },
  { id: 'b2', type: 'Book', title: "Boenninghausen's Therapeutic Pocket Book", subtitle: 'Digital Edition • Access Code 9920', route: '/faculty/library', badge: 'E-Copy' },

  // Departments
  { id: 'd1', type: 'Department', title: 'Department of Organon of Medicine', subtitle: 'HOD: Dr. S. K. Mukherjee • Block B', route: '/faculty/notices', badge: 'Dept Portal' },
  { id: 'd2', type: 'Department', title: 'Department of Homoeopathic Pharmacy', subtitle: 'Block A • Lab 2', route: '/faculty/notices', badge: 'Dept Portal' },

  // Notices
  { id: 'n1', type: 'Notice', title: 'WBUHS Annual Internal Assessment Schedule 2026', subtitle: 'Published by Academic Council', route: '/faculty/notices', badge: 'Important' },
  { id: 'n2', type: 'Notice', title: 'NMC & CCH Guidelines for Clinical Internship Rotation', subtitle: 'Notice #AC-2026-11', route: '/faculty/notices', badge: 'Circular' },

  // Hospital
  { id: 'h1', type: 'Hospital', title: 'General Medicine OPD Duty - Room 4', subtitle: 'Dr. Faculty Shift: 11:30 AM - 02:30 PM', route: '/faculty/hospital', badge: 'Shift Active' },
  { id: 'h2', type: 'Hospital', title: 'Female Clinical Ward Inpatient Inspection', subtitle: 'Ward Bed 12-24 • Emergency Duty', route: '/faculty/hospital', badge: 'OPD Duty' },
];

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const navigate = useNavigate();

  // Debounce effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard escape shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filteredResults = useMemo(() => {
    if (!debouncedQuery.trim() && selectedType === 'All') return SEARCH_DATABASE.slice(0, 6);

    const q = debouncedQuery.toLowerCase().trim();
    return SEARCH_DATABASE.filter((item) => {
      const typeMatches = selectedType === 'All' || item.type === selectedType;
      if (!typeMatches) return false;
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    });
  }, [debouncedQuery, selectedType]);

  if (!isOpen) return null;

  const handleSelect = (route: string) => {
    navigate(route);
    onClose();
  };

  const getItemIcon = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'Student': return <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
      case 'Subject': return <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
      case 'Assignment': return <FileText className="w-4 h-4 text-amber-600 dark:text-amber-400" />;
      case 'Research': return <FlaskConical className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
      case 'Book': return <Library className="w-4 h-4 text-teal-600 dark:text-teal-400" />;
      case 'Department': return <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />;
      case 'Notice': return <Bell className="w-4 h-4 text-rose-600 dark:text-rose-400" />;
      case 'Hospital': return <Stethoscope className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Search Bar Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, subjects, assignments, research, books, notices..."
            className="w-full text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 bg-transparent focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block px-2 py-0.5 text-3xs font-mono font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md">
            ESC
          </span>
        </div>

        {/* Category Type Tabs */}
        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {['All', 'Student', 'Subject', 'Assignment', 'Research', 'Book', 'Department', 'Notice', 'Hospital'].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-2.5 py-1 text-3xs font-black rounded-lg transition uppercase tracking-wider shrink-0 cursor-pointer ${
                selectedType === type
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1 divide-y divide-slate-100 dark:divide-slate-800/50">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.route)}
                className="pt-2 pb-2 first:pt-0 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/60 transition cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700 transition shrink-0">
                    {getItemIcon(item.type)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white truncate">
                        {item.title}
                      </span>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-md text-3xs font-extrabold uppercase bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-800">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-3xs text-slate-500 dark:text-slate-400 truncate">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition shrink-0" />
              </div>
            ))
          ) : (
            <div className="py-12 text-center space-y-2">
              <Search className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
                No search results found for "{debouncedQuery}"
              </p>
              <p className="text-3xs text-slate-400">
                Try searching with a different term or select another category filter.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-3xs text-slate-400">
          <span>
            Showing <strong className="text-slate-700 dark:text-slate-300">{filteredResults.length}</strong> index items
          </span>
          <span className="flex items-center gap-1">
            Press <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 font-mono text-3xs text-slate-600 dark:text-slate-300">Cmd + K</kbd> anytime to search
          </span>
        </div>
      </div>
    </div>
  );
};
