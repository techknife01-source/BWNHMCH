import React, { useState, useEffect } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { SearchBar } from '../../components/common/SearchBar';
import { Badge } from '../../components/common/Badge';
import { FileText, Download, Bell, Filter, Sparkles, AlertCircle } from 'lucide-react';
import { cmsApi } from '../../services/api/cms.api';

interface NoticeItem {
  id: string;
  title: string;
  date: string;
  category: 'ACADEMIC' | 'HOSPITAL' | 'EXAM' | 'GENERAL' | 'ADMISSION';
  isImportant: boolean;
  fileUrl?: string;
}

export const NoticePage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const [notices, setNotices] = useState<NoticeItem[]>([
    { id: '1', title: 'BHMS 1st Professional WBUHS Supplementary Examination Routine 2026', date: '2026-07-20', category: 'EXAM', isImportant: true },
    { id: '2', title: 'Notification regarding Homoeopathic Hospital OPD Roster during National Holiday', date: '2026-07-18', category: 'HOSPITAL', isImportant: false },
    { id: '3', title: 'Registration Form Fill-up Notice for Fresh Enrolled BHMS Batch 2026-27', date: '2026-07-15', category: 'ACADEMIC', isImportant: true },
    { id: '4', title: 'WBMCC State AYUSH Counselling Document Verification Helpline Desk', date: '2026-07-12', category: 'ADMISSION', isImportant: true },
    { id: '5', title: 'Central Library Book Issue & Digital Journal Access Guidelines for Interns', date: '2026-07-10', category: 'GENERAL', isImportant: false },
    { id: '6', title: 'M.D. Homoeopathy Dissertation Submission Deadline Extension Circular', date: '2026-07-05', category: 'ACADEMIC', isImportant: false },
  ]);

  useEffect(() => {
    cmsApi.getNotices()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          // Merge or replace
        }
      })
      .catch(() => {
        // Fallback
      });
  }, []);

  const categories = ['ALL', 'ACADEMIC', 'EXAM', 'HOSPITAL', 'ADMISSION', 'GENERAL'];

  const filtered = notices.filter((n) => {
    const matchesSearch = n.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'ALL' || n.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Notices & Circulars' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <Bell className="w-4 h-4" />
          <span>Official Institutional Gazette</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Notices, Orders & Exam Routines
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Access official circulars, examination schedules, WBUHS notifications, hospital duty rosters, and academic announcements issued by the Office of the Principal.
        </p>

        {/* Filter and Search Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#00A651] text-white shadow-md'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search notice by keyword..."
            className="w-full sm:w-72 bg-white/10 text-white placeholder-slate-400 border-white/20"
          />
        </div>
      </div>

      {/* Notice List */}
      <div className="space-y-4">
        {filtered.map((n) => (
          <Card
            key={n.id}
            className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-emerald-500 transition-all border border-slate-200/80 dark:border-slate-800 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              <div className="rounded-2xl bg-blue-50 p-3 text-blue-600 dark:bg-blue-950 dark:text-blue-400 shrink-0 mt-1">
                <FileText className="h-6 w-6" />
              </div>

              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                    {n.category}
                  </span>
                  {n.isImportant && (
                    <span className="px-2 py-0.5 bg-rose-500 text-white font-black text-[10px] rounded uppercase animate-pulse flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Important Notice
                    </span>
                  )}
                  <span className="text-[11px] text-slate-400 font-mono">• {n.date}</span>
                </div>

                <h3 className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                  {n.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => alert(`Downloading circular: ${n.title}`)}
              className="flex items-center space-x-2 rounded-xl bg-slate-100 hover:bg-[#002147] hover:text-white dark:bg-slate-800 dark:hover:bg-[#00A651] px-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-200 transition shrink-0 cursor-pointer"
            >
              <Download className="h-4 w-4" />
              <span>Download PDF</span>
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
