import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { NoticeBoardView } from '../../components/notice/NoticeBoardView';
import { Bell } from 'lucide-react';

export const NoticePage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumb items={[{ label: 'Notices & Circulars' }]} />

      {/* Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full filter blur-3xl pointer-events-none" />
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400 uppercase tracking-widest">
          <Bell className="w-4 h-4 animate-bounce" />
          <span>Official Institutional Gazette & Notice Board</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Notices, Orders & Exam Routines
        </h1>
        <p className="text-slate-300 text-sm sm:text-base max-w-3xl leading-relaxed">
          Access official circulars, examination schedules, WBUHS notifications, hospital duty rosters, and academic announcements issued by the Office of the Principal and Department HODs.
        </p>
      </div>

      {/* Main Notice Board Module View */}
      <NoticeBoardView initialRole="STUDENT" />
    </div>
  );
};
