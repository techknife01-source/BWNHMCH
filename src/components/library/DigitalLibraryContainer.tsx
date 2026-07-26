import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { isFacultyUser, isStudentUser, getUserDisplayDesignation } from '../../utils/permissionHelper';
import { FacultyDigitalLibraryView } from './FacultyDigitalLibraryView';
import { StudentDigitalLibraryView } from './StudentDigitalLibraryView';
import { LibraryErpView } from '../../modules/admin/components/LibraryErpView';
import { BookOpen, Database, Library, Sparkles } from 'lucide-react';

export const DigitalLibraryContainer: React.FC = () => {
  const { user } = useAuth();
  const [activeFacultyTab, setActiveFacultyTab] = useState<'digital_library' | 'physical_catalog'>('digital_library');

  const isFaculty = isFacultyUser(user) || 
                    user?.roles?.some(r => ['ROLE_LIBRARIAN', 'ROLE_ADMIN', 'ROLE_SUPER_ADMIN', 'ROLE_SUPERADMIN'].includes(r));

  if (!isFaculty) {
    return <StudentDigitalLibraryView />;
  }

  return (
    <div className="space-y-6">
      {/* FACULTY TOP NAVIGATION TABS */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 p-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFacultyTab('digital_library')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeFacultyTab === 'digital_library'
                ? 'bg-[#002147] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Digital E-Library & Upload Manager</span>
          </button>

          <button
            onClick={() => setActiveFacultyTab('physical_catalog')}
            className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition cursor-pointer flex items-center gap-2 ${
              activeFacultyTab === 'physical_catalog'
                ? 'bg-[#002147] text-white shadow-md'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Database className="w-4 h-4 text-blue-400" />
            <span>Physical Library Catalog & Circulation</span>
          </button>
        </div>

        <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-xl text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
          <span>Faculty Mode: {getUserDisplayDesignation(user)}</span>
        </div>
      </div>

      {/* RENDER VIEW */}
      {activeFacultyTab === 'digital_library' ? (
        <FacultyDigitalLibraryView />
      ) : (
        <LibraryErpView />
      )}
    </div>
  );
};
