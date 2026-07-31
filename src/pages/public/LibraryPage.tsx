import React, { useState } from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { Card } from '../../components/common/Card';
import { BookOpen, Search, Laptop, Clock, CheckCircle2, FileText, Bookmark } from 'lucide-react';

export const LibraryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const catalogBooks = [
    { id: 'b1', title: 'Organon of Medicine (6th Edition)', author: 'Dr. Samuel Hahnemann', cat: 'Organon & Philosophy', copies: '28 Available', accNo: 'BHMC-LIB-0042' },
    { id: 'b2', title: 'Lectures on Homoeopathic Materia Medica', author: 'Dr. J. T. Kent', cat: 'Materia Medica', copies: '15 Available', accNo: 'BHMC-LIB-0189' },
    { id: 'b3', title: 'Repertory of the Homoeopathic Materia Medica', author: 'Dr. J. T. Kent', cat: 'Repertory', copies: '20 Available', accNo: 'BHMC-LIB-0312' },
    { id: 'b4', title: 'Homoeopathic Pharmacopoeia of India (HPI Vol I - X)', author: 'Govt. of India Ministry of AYUSH', cat: 'Pharmacy', copies: '10 Sets', accNo: 'BHMC-LIB-0890' },
    { id: 'b5', title: 'Gray\'s Anatomy (42nd Edition)', author: 'Susan Standring', cat: 'Anatomy', copies: '12 Available', accNo: 'BHMC-LIB-1204' },
    { id: 'b6', title: 'Harrison\'s Principles of Internal Medicine', author: 'J. Larry Jameson', cat: 'Practice of Medicine', copies: '8 Available', accNo: 'BHMC-LIB-1540' },
  ];

  const filtered = catalogBooks.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
      <Breadcrumb items={[{ label: 'Central Library' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4">
        <span className="px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30">
          Knowledge Resource Center
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Central Digital Library & Archives
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Housing over 12,500 physical medical volumes, rare Hahnemannian manuscripts, national e-journal subscriptions, and an air-conditioned 100-seat silent reading hall.
        </p>

        {/* OPAC Search Bar */}
        <div className="pt-4 max-w-xl relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search OPAC catalog by book title, author, or subject..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 text-white placeholder-slate-400 border border-white/20 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 space-y-2 border border-slate-200/80 dark:border-slate-800">
          <BookOpen className="h-8 w-8 text-blue-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">12,500+ Volumes</h3>
          <p className="text-xs text-slate-500">Comprehensive collection of classic homoeopathic treatises, rare journals, and medical textbooks.</p>
        </Card>
        <Card className="p-6 space-y-2 border border-slate-200/80 dark:border-slate-800">
          <Laptop className="h-8 w-8 text-emerald-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">e-Journal Consortium</h3>
          <p className="text-xs text-slate-500">Access to international medical databases, WHO archives, and research publications.</p>
        </Card>
        <Card className="p-6 space-y-2 border border-slate-200/80 dark:border-slate-800">
          <Clock className="h-8 w-8 text-amber-600" />
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">Reading Hall Timings</h3>
          <p className="text-xs text-slate-500">Mon - Sat: 08:30 AM - 07:00 PM. High-speed Wi-Fi and 15 digital catalog workstations.</p>
        </Card>
      </div>

      {/* Catalog Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Online Public Access Catalog (OPAC)</h2>
          <span className="text-xs text-slate-400 font-mono">Showing {filtered.length} Titles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => (
            <Card key={b.id} className="p-6 space-y-3 border border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                  {b.cat}
                </span>
                <span className="text-2xs font-mono text-slate-400">{b.accNo}</span>
              </div>

              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white leading-snug">{b.title}</h3>
              <p className="text-xs text-slate-500">Author: <strong className="text-slate-700 dark:text-slate-300">{b.author}</strong></p>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{b.copies}</span>
                <button
                  onClick={() => alert(`Issue Request for ${b.title} logged to Librarian Portal`)}
                  className="font-bold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Reserve Issue →
                </button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
