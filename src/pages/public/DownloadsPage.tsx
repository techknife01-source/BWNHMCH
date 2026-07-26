import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { FileText, Download, Search, Filter, HardDrive, CheckCircle2 } from 'lucide-react';

interface DownloadableItem {
  id: string;
  title: string;
  category: 'Syllabus' | 'Forms & Applications' | 'Hospital & Internship' | 'Regulatory & NCH';
  fileType: string;
  fileSize: string;
  updatedAt: string;
}

export const DownloadsPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const files: DownloadableItem[] = [
    { id: 'd1', title: 'BHMS 1st to 4th Professional WBUHS Detailed Syllabus & Marks Scheme', category: 'Syllabus', fileType: 'PDF', fileSize: '4.8 MB', updatedAt: '2026-06-10' },
    { id: 'd2', title: 'M.D. (Hom.) Postgraduate Degree Curriculum & Thesis Submission Guidelines', category: 'Syllabus', fileType: 'PDF', fileSize: '2.1 MB', updatedAt: '2026-05-18' },
    { id: 'd3', title: 'NEET AYUSH Counseling Document Verification & Domicile Proforma (a1/a2/b)', category: 'Forms & Applications', fileType: 'PDF', fileSize: '1.4 MB', updatedAt: '2026-07-01' },
    { id: 'd4', title: 'Student Hostel Admission Application & Parent Declaration Form', category: 'Forms & Applications', fileType: 'PDF', fileSize: '680 KB', updatedAt: '2026-06-25' },
    { id: 'd5', title: 'Compulsory Rotatory Internship Logbook & Clinical Duty Assessment Sheet', category: 'Hospital & Internship', fileType: 'PDF', fileSize: '3.2 MB', updatedAt: '2026-04-12' },
    { id: 'd6', title: 'Anti-Ragging Mandatory Affidavit & Student Welfare Rules Booklet', category: 'Regulatory & NCH', fileType: 'PDF', fileSize: '920 KB', updatedAt: '2026-07-10' },
    { id: 'd7', title: 'NCH Form 10 Mandatory College Disclosure Document (2026-27)', category: 'Regulatory & NCH', fileType: 'PDF', fileSize: '5.5 MB', updatedAt: '2026-07-01' },
    { id: 'd8', title: 'Free Medical Camp Volunteer & NSS Intern Registration Sheet', category: 'Hospital & Internship', fileType: 'PDF', fileSize: '510 KB', updatedAt: '2026-06-05' },
  ];

  const categories = ['All', 'Syllabus', 'Forms & Applications', 'Hospital & Internship', 'Regulatory & NCH'];

  const filtered = files.filter((f) => {
    const matchesSearch = f.title.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || f.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Forms & Downloads' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Official Documents Repository
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Syllabi, Application Forms & Logbooks
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Download official academic syllabi, admission application forms, hostel rules, NCH compliance disclosures, and hospital internship logbooks.
        </p>

        {/* Filter and Search Bar */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
            <Filter className="w-4 h-4 text-slate-400 shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  selectedCategory === cat
                    ? 'bg-[#00A651] text-white shadow-md'
                    : 'bg-white/10 text-slate-200 hover:bg-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search file by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-xl text-xs focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Files Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((f) => (
          <Card
            key={f.id}
            className="p-6 flex items-start justify-between gap-4 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-start space-x-4 min-w-0">
              <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl shrink-0 mt-0.5">
                <FileText className="w-6 h-6" />
              </div>

              <div className="space-y-1.5 min-w-0">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {f.category}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">
                  {f.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Format: {f.fileType} • Size: {f.fileSize} • Updated: {f.updatedAt}
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Initiating download for ${f.title}`)}
              className="p-3 bg-slate-100 dark:bg-slate-800 hover:bg-[#002147] hover:text-white dark:hover:bg-[#00A651] text-slate-800 dark:text-slate-200 rounded-2xl transition shrink-0 cursor-pointer"
              title="Download File"
            >
              <Download className="w-5 h-5" />
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
};
