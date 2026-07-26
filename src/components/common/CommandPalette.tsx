import React, { useState, useEffect } from 'react';
import { Search, Command, GraduationCap, Users, Stethoscope, BookOpen, Building2, Bell, Image, FileText, PlusCircle, ArrowRight, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CommandItem {
  category: string;
  label: string;
  path: string;
  icon: any;
  badge?: string;
}

export const CommandPalette: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    // Quick Actions
    { category: 'Quick Actions', label: 'Register New Patient (OPD)', path: '/portal/reception', icon: PlusCircle, badge: 'OPD' },
    { category: 'Quick Actions', label: 'Issue Digital Library Book', path: '/portal/library', icon: BookOpen, badge: 'Library' },
    { category: 'Quick Actions', label: 'Mark Class Attendance (BHMS 3rd Yr)', path: '/portal/faculty', icon: UserCheck, badge: 'Academic' },
    { category: 'Quick Actions', label: 'Publish College Notice', path: '/portal/principal', icon: Bell, badge: 'Principal' },

    // Global Search Entities
    { category: 'Students', label: 'Arjun Sen (BHMS 3rd Year - Reg #045)', path: '/portal/student', icon: GraduationCap },
    { category: 'Students', label: 'Priya Mukherjee (BHMS 1st Year - Reg #112)', path: '/portal/student', icon: GraduationCap },
    { category: 'Faculty', label: 'Dr. S. K. Banerjea (HOD Materia Medica)', path: '/portal/faculty', icon: Users },
    { category: 'Faculty', label: 'Dr. Susmita Chatterjee (Principal)', path: '/portal/principal', icon: Users },
    { category: 'Patients', label: 'Savitri Devi (OPD #2026-90812 - General)', path: '/portal/hospital', icon: Stethoscope },
    { category: 'Patients', label: 'Ramesh Das (IPD Bed #12 - Male Ward)', path: '/portal/hospital', icon: Stethoscope },
    { category: 'Books', label: 'Organon of Medicine (Samuel Hahnemann - 6th Ed)', path: '/portal/library', icon: BookOpen },
    { category: 'Books', label: 'Kent Repertory of Homoeopathic Materia Medica', path: '/portal/library', icon: BookOpen },
    { category: 'Departments', label: 'Organon of Medicine & Homoeopathic Philosophy', path: '/departments', icon: Building2 },
    { category: 'Departments', label: 'Repertory & Homoeopathic Pharmacy', path: '/departments', icon: Building2 },
    
    // Navigation Portals
    { category: 'Portals', label: 'Student Portal Dashboard', path: '/portal/student', icon: GraduationCap },
    { category: 'Portals', label: 'Faculty Academic Desk', path: '/portal/faculty', icon: Users },
    { category: 'Portals', label: 'Principal Executive Room', path: '/portal/principal', icon: FileText },
    { category: 'Portals', label: 'Hospital Care & OPD System', path: '/portal/hospital', icon: Stethoscope },
    { category: 'Portals', label: 'Digital Library Catalogue', path: '/portal/library', icon: BookOpen },
    { category: 'Portals', label: 'Reception & Appointment Desk', path: '/portal/reception', icon: UserCheck },
    { category: 'Portals', label: 'Accounts & Fee Billing', path: '/portal/accounts', icon: FileText },
    { category: 'Portals', label: 'Super Admin Control Center', path: '/portal/super-admin', icon: Command },
    { category: 'Public Pages', label: 'Latest College Notices & Gazette', path: '/notice', icon: Bell },
    { category: 'Public Pages', label: 'Campus Gallery & Laboratories', path: '/gallery', icon: Image },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (!open) return null;

  const filtered = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()) ||
    c.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 p-4">
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setOpen(false)} />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="h-5 w-5 text-[#002147] dark:text-[#00A651] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students, faculty, patients, books, notices, or quick actions (Ctrl + K)..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setOpen(false)}
            className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md font-mono"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No matching records or commands found. Try searching for "Arjun", "Organon", or "OPD".
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={() => {
                    navigate(cmd.path);
                    setOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs text-slate-700 hover:bg-[#002147] hover:text-white dark:text-slate-200 dark:hover:bg-slate-800 transition group"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <Icon className="h-4 w-4 text-[#00A651] shrink-0 group-hover:text-white" />
                    <div className="truncate">
                      <span className="font-semibold block truncate">{cmd.label}</span>
                      <span className="text-[10px] text-slate-400 group-hover:text-slate-200 uppercase tracking-wider font-bold">
                        {cmd.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {cmd.badge && (
                      <span className="px-2 py-0.5 rounded text-[9px] font-black bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 uppercase">
                        {cmd.badge}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-white transition" />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
          <span>Tip: Navigate with <kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border">↑</kbd> <kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border">↓</kbd></span>
          <span>Burdwan HomoeoERP Global Search</span>
        </div>
      </div>
    </div>
  );
};
