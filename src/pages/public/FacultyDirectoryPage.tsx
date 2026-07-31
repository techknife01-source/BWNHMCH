import React from 'react';
import { Breadcrumb } from '../../components/common/Breadcrumb';
import { DepartmentStaffManagementPanel } from '../../modules/cms/components/DepartmentStaffManagementPanel';
import { Users, GraduationCap, Award, ShieldCheck } from 'lucide-react';

export const FacultyDirectoryPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      <Breadcrumb items={[{ label: 'Centralized Faculty Directory' }]} />

      {/* Hero Header Banner */}
      <div className="rounded-3xl bg-[#002147] text-white p-8 sm:p-12 shadow-xl space-y-4 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
          <GraduationCap className="w-96 h-96 text-white" />
        </div>

        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-black rounded-full uppercase tracking-wider border border-emerald-500/30 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              Institutional Academic Roster
            </span>
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 text-xs font-bold rounded-full border border-blue-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              NCH Compliant
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Centralized Faculty Directory
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Comprehensive directory of academic faculty members, professors, associate professors, assistant professors, and clinical tutors across all departments of Burdwan Homoeopathic Medical College & Hospital.
          </p>
        </div>
      </div>

      {/* Main Faculty Management / Directory Panel */}
      <DepartmentStaffManagementPanel />
    </div>
  );
};
